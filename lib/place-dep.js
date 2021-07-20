// Given a dep, a node that depends on it, and the edge representing that
// dependency, place the dep somewhere in the node's tree, and all of its
// peer dependencies.
//
// Handles all of the tree updating needed to place the dep, including
// removing replaced nodes, pruning now-extraneous or invalidated nodes,
// and saves a set of what was placed and what needs re-evaluation as
// a result.

const log = require('proc-log')
const deepestNestingTarget = require('./deepest-nesting-target.js')
const CanPlaceDep = require('./can-place-dep.js')
const {
  OK,
  REPLACE,
  KEEP,
  CONFLICT,
} = CanPlaceDep

const gatherDepSet = require('./gather-dep-set.js')
const peerEntrySets = require('./peer-entry-sets.js')
const debug = require('./debug.js')
const consoleError = (...args) => {
  // console.error(...args)
}

class PlaceDep {
  constructor (options) {
    const {
      dep,
      node,
      edge,
      parent = null,
    } = options
    this.name = edge.name
    this.dep = dep
    this.node = node
    this.edge = edge
    this.canPlace = null
    consoleError('')
    consoleError('PLACE DEP CTOR', {
    dep: [dep.name, dep.version],
    edge,
    parent: parent && [parent.dep.name, parent.dep.version],
    })
    consoleError('')


    this.target = null
    this.placed = null

    // inherit all these fields from the parent to ensure consistency.
    const {
      preferDedupe,
      force,
      explicitRequests,
      updateNames,
      auditReport,
      legacyBundling,
      strictPeerDeps,
      legacyPeerDeps,
      globalStyle,
    } = parent || options
    Object.assign(this, {
      preferDedupe,
      force,
      explicitRequests,
      updateNames,
      auditReport,
      legacyBundling,
      strictPeerDeps,
      legacyPeerDeps,
      globalStyle,
    })

    this.children = []
    this.parent = parent
    this.peerConflict = null

    this.checks = new Map()

    this.place()
  }

  place () {
    const {
      edge,
      dep,
      node,
      preferDedupe,
      globalStyle,
      legacyBundling,
      force,
      explicitRequests,
      updateNames,
      checks,
    } = this

    // nothing to do if the edge is fine as it is
    if (edge.to &&
        !edge.error &&
        !explicitRequests.has(edge) &&
        !updateNames.includes(edge.name) &&
        !this.isVulnerable(edge.to))
      return

    // walk up the tree until we hit either a top/root node, or a place
    // where the dep is not a peer dep.
    const start = this.getStartNode()

    let canPlace = null
    let canPlaceSelf = null
    for (const target of start.ancestry()) {
      // if the current location has a peerDep on it, then we can't place here
      // this is pretty rare to hit, since we always prefer deduping peers,
      // and the getStartNode will start us out above any peers from the
      // thing that depends on it.
      const targetEdge = target.edgesOut.get(edge.name)
      if (!target.isTop && targetEdge && targetEdge.peer)
        continue

      const cpd = new CanPlaceDep({
        dep,
        edge,
        node,
        // note: this sets the parent's canPlace as the parent of this
        // canPlace, but it does NOT add this canPlace to the parent's
        // children.  This way, we can know that it's a peer dep, and
        // get the peerEntryEdge easily, while still maintaining the
        // tree of checks that factored into the original decision.
        parent: this.parent && this.parent.canPlace,
        target,
        preferDedupe,
      })
      checks.set(target, cpd)

      // It's possible that a "conflict" is a conflict among the *peers* of
      // a given node we're trying to place, but there actually is no current
      // node.  Eg,
      // root -> (a, b)
      // a -> PEER(c)
      // b -> PEER(d)
      // d -> PEER(c@2)
      // We place (a), and get a peer of (c) along with it.
      // then we try to place (b), and get CONFLICT in the check, because
      // of the conflicting peer from (b)->(d)->(c@2).  In that case, we
      // should treat (b) and (d) as OK, and place them in the last place
      // where they did not themselves conflict, and skip c@2 if conflict
      // is ok by virtue of being forced or not ours and not strict.
      if (cpd.canPlaceSelf !== CONFLICT)
        canPlaceSelf = cpd

      // we found a place this can go, along with all its peer friends.
      // we break when we get the first conflict
      if (cpd.canPlace !== CONFLICT)
        canPlace = cpd
      else
        break

      // if it's a load failure, just plop it in the first place attempted,
      // since we're going to crash the build or prune it out anyway.
      // but, this will frequently NOT be a successful canPlace, because
      // it'll have no version or other information.
      if (dep.errors.length)
        break

      // nest packages like npm v1 and v2
      // very disk-inefficient
      if (legacyBundling)
        break

      // when installing globally, or just in global style, we never place
      // deps above the first level.
      if (globalStyle) {
        const rp = target.resolveParent
        if (rp && rp.isProjectRoot)
          break
      }
    }

    Object.assign(this, {
      canPlace,
      canPlaceSelf,
    })
    this.current = edge.to

    // if we can't find a target, that means that the last place checked,
    // and all the places before it, had a conflict.
    if (!canPlace) {
      // if not forced, or it's our dep, or strictPeerDeps is set, then
      // this is an ERESOLVE error.
      if (!this.conflictOk) {
        return this.failPeerConflict()
      }

      // ok!  we're gonna allow the conflict, but we should still warn
      // if we have a current, then we treat CONFLICT as a KEEP.
      // otherwise, we just skip it.  Only warn on the one that actually
      // could not be placed somewhere.
      if (!canPlaceSelf) {
        this.warnPeerConflict()
        return
      }

      this.canPlace = canPlaceSelf
    }

    // now we have a target, a tree of CanPlaceDep results for the peer group,
    // and we are ready to go
    consoleError('BEFORE PLACE IN TREE', [this.dep.name, this.dep.version, this.canPlace.target.location, this.canPlace.canPlaceSelf], this.node.root)
    this.placeInTree()
    consoleError('AFTER PLACE IN TREE', [this.dep.name, this.dep.version, this.canPlace.target.location, this.canPlace.canPlaceSelf], this.node.root)
  }

  placeInTree () {
    const {
      dep,
      canPlace,
      node,
      edge,
    } = this

    if (!canPlace)
      throw new Error('canPlace not set, but trying to place in tree')

    const { target } = canPlace

    log.silly(
      'placeDep',
      target.location || 'ROOT',
      `${dep.name}@${dep.version}`,
      canPlace.description,
      `for: ${node.package._id || node.location}`,
      `want: ${edge.spec || '*'}`
    )

    const placementType = canPlace.canPlace === CONFLICT
      ? canPlace.canPlaceSelf
      : canPlace.canPlace

    // if we're placing in the tree with --force, we can get here even though
    // it's a conflict.  Treat it as a KEEP, but warn and move on.
    if (placementType === KEEP) {
      if (edge.peer && !edge.valid)
        this.warnPeerConflict()

      // if we get a KEEP in a update scenario, then we MAY have something
      // already duplicating this unnecessarily!  For example:
      // ```
      // root (dep: y@1)
      // +-- x (dep: y@1.1)
      // |   +-- y@1.1.0 (replacing with 1.1.2, got KEEP at the root)
      // +-- y@1.1.2 (updated already from 1.0.0)
      // ```
      // Now say we do `reify({update:['y']})`, and the latest version is
      // 1.1.2, which we now have in the root.  We'll try to place y@1.1.2
      // first in x, then in the root, ending with KEEP, because we already
      // have it.  In that case, we ought to REMOVE the nm/x/nm/y node, because
      // it is an unnecessary duplicate.
      this.pruneDedupable(target)
      return
    }

    // XXX if we are replacing SOME of a peer entry group, we will need to
    // remove any that are not being replaced and will now be invalid, and
    // re-evaluate them deeper into the tree.

    const virtualRoot = dep.parent
    this.placed = new dep.constructor({
      name: dep.name,
      pkg: dep.package,
      resolved: dep.resolved,
      integrity: dep.integrity,
      legacyPeerDeps: this.legacyPeerDeps,
      error: dep.errors[0],
      ...(dep.target ? { target: dep.target, realpath: dep.target.path } : {}),
    })

    this.oldDep = target.children.get(this.name)
    if (this.oldDep)
      this.replaceOldDep()
    else
      this.placed.parent = target

    // if it's an overridden peer dep, warn about it
    if (edge.peer && !this.placed.satisfies(edge))
      this.warnPeerConflict()

    // If the edge is not an error, then we're updating something, and
    // MAY end up putting a better/identical node further up the tree in
    // a way that causes an unnecessary duplication.  If so, remove the
    // now-unnecessary node.
    if (edge.valid && edge.to && edge.to !== this.placed)
      this.pruneDedupable(edge.to, false)

    // in case we just made some duplicates that can be removed,
    // prune anything deeper in the tree that can be replaced by this
    for (const node of target.root.inventory.query('name', this.name)) {
      if (node.isDescendantOf(target) && !node.isTop)
        this.pruneDedupable(node, false)
    }

    // also place its unmet or invalid peer deps at this location
    // loop through any peer deps from the thing we just placed, and place
    // those ones as well.  it's safe to do this with the virtual nodes,
    // because we're copying rather than moving them out of the virtual root,
    // otherwise they'd be gone and the peer set would change throughout
    // this loop.
    for (const peerEdge of this.placed.edgesOut.values()) {
      if (peerEdge.overridden)
        continue

      const peer = virtualRoot.children.get(peerEdge.name)
      consoleError('peerEdge', peerEdge)

      // Note: if the virtualRoot *doesn't* have the peer, then that means
      // it's an optional peer dep.  If it's not being properly met (ie,
      // peerEdge.valid is false), then this is likely heading for an
      // ERESOLVE error, unless it can walk further up the tree.
      if (!peerEdge.peer || peerEdge.valid || !peer) {
        continue
      }

      if (!peerEdge.valid && !peer.satisfies(peerEdge))
        continue

      this.children.push(new PlaceDep({
        parent: this,
        dep: peer,
        node: this.placed,
        edge: peerEdge,
      }))
    }
  }

  replaceOldDep () {
    // XXX handle replacing an entire peer group?
    // what about cases where we need to push some other peer groups deeper
    // into the tree?  all the tree updating should be done here, and track
    // all the things that we add and remove, so that we can know what
    // to re-evaluate.

    // if we're replacing, we should also remove any nodes for edges that
    // are now invalid, and where this (or its deps) is the only dependent,
    // and also recurse on that pruning.  Otherwise leaving that dep node
    // around can result in spurious conflicts pushing nodes deeper into
    // the tree than needed in the case of cycles that will be removed
    // later anyway.
    const oldDeps = []
    for (const [name, edge] of this.oldDep.edgesOut.entries()) {
      if (!this.placed.edgesOut.has(name) && edge.to)
        oldDeps.push(...gatherDepSet([edge.to], e => e.to !== edge.to))
    }
    this.placed.replace(this.oldDep)
    this.pruneForReplacement(this.placed, oldDeps)
  }

  pruneForReplacement (node, oldDeps) {
    // gather up all the invalid edgesOut, and any now-extraneous
    // deps that the new node doesn't depend on but the old one did.
    const invalidDeps = new Set([...node.edgesOut.values()]
      .filter(e => e.to && !e.valid).map(e => e.to))
    for (const dep of oldDeps) {
      const set = gatherDepSet([dep], e => e.to !== dep && e.valid)
      for (const dep of set)
        invalidDeps.add(dep)
    }

    // ignore dependency edges from the node being replaced, but
    // otherwise filter the set down to just the set with no
    // dependencies from outside the set, except the node in question.
    const deps = gatherDepSet(invalidDeps, edge =>
      edge.from !== node && edge.to !== node && edge.valid)

    // now just delete whatever's left, because it's junk
    for (const dep of deps)
      dep.root = null
  }

  // prune all the nodes in a branch of the tree that can be safely removed
  // This is only the most basic duplication detection; it finds if there
  // is another satisfying node further up the tree, and if so, dedupes.
  // Even in legacyBundling mode, we do this amount of deduplication.
  pruneDedupable (node, descend = true) {
    if (node.canDedupe(this.preferDedupe)) {
      node.root = null
      return
    }
    if (descend) {
      // sort these so that they're deterministically ordered
      // otherwise, resulting tree shape is dependent on the order
      // in which they happened to be resolved.
      const nodeSort = (a, b) => a.location.localeCompare(b.location, 'en')

      const children = [...node.children.values()].sort(nodeSort)
      const fsChildren = [...node.fsChildren].sort(nodeSort)
      for (const child of children)
        this.pruneDedupable(child)
      for (const topNode of fsChildren) {
        const children = [...topNode.children.values()].sort(nodeSort)
        for (const child of children)
          this.pruneDedupable(child)
      }
    }
  }

  get conflictOk () {
    consoleError('> conflict ok?', {
      force: this.force,
      isMine: this.isMine,
      strictPeerDeps: this.strictPeerDeps,
    })
    return this.force || (!this.isMine && !this.strictPeerDeps)
  }

  get isMine () {
    const { edge, node } = this.top
    consoleError('isMine?', edge, node)

    if (node.isWorkspace || node.isProjectRoot) {
      console.error('> yes 1', node, node.isWorkspace, node.isProjectRoot)
      return true
    }

    if (edge.from.isWorkspace || edge.from.isProjectRoot){
      consoleError('> yes 2', edge, edge.from.isWorkspace, edge.from.isProjectRoot)
      return true
    }

    if (!edge.peer) {
      consoleError('> no, not peer edge')
      return false
    }

    // re-entry case.  check if any non-peer edges come from the project,
    // or any entryEdges on peer groups are from the root.
    let hasPeerEdges = false
    for (const edge of node.edgesIn) {
      if (edge.peer) {
        hasPeerEdges = true
        continue
      }
      if (edge.from.isProjectRoot || edge.from.isWorkspace) {
        consoleError('> yes 3', edge, edge.from.isWorkspace, edge.from.isProjectRoot)
        return true
      }
    }
    if (hasPeerEdges) {
      consoleError('> has peer edge')
      for (const edge of peerEntrySets(node).keys()) {
        if (edge.from.isProjectRoot || edge.from.isWorkspace) {
          consoleError('> yes 4', edge, edge.from.isProjectRoot, edge.from.isWorkspace)
          return true
        }
      }
    }

    consoleError('> no, final')
    return false
  }

  warnPeerConflict () {
    consoleError('> warn in pd', new Error('trace').stack)
    this.edge.overridden = true
    const expl = this.explainPeerConflict()
    log.warn('ERESOLVE', 'overriding peer dependency', expl)
  }

  failPeerConflict () {
    const expl = this.explainPeerConflict()
    throw Object.assign(new Error('could not resolve'), expl)
  }

  explainPeerConflict () {
    const edge = this.top.edge
    const node = edge.from
    const curNode = node.resolve(edge.name)

    const expl = { code: 'ERESOLVE' }

    if (this.parent) {
      // this is the conflicted peer
      expl.current = this.current && this.current.explain()
      expl.peerConflict = this.dep.explain(this.edge)
    } else
      expl.current = curNode && curNode.explain(edge)
    expl.edge = edge.explain()
    const {
      strictPeerDeps,
      force,
      isMine,
    } = this
    Object.assign(expl, {
      strictPeerDeps,
      force,
      isMine,
    })

    // XXX decorate more with this.canPlace and this.canPlaceSelf,
    // this.checks, this.children, walk over conflicted peers, etc.
    return expl
  }

  get conflictedPeers () {
    const conflicted = []
    if (!this.canPlaceSelf)
      conflicted.push(this)
    for (const child of this.children)
      conflicted.push(...child.conflictedPeers)
    return new Set(conflicted)
  }

  getStartNode () {
    // if we are a peer, then we MUST be at least as shallow as the
    // peer dependent
    const from = this.parent ? this.parent.getStartNode() : this.edge.from
    return deepestNestingTarget(from, this.name)
  }

  get top () {
    return this.parent ? this.parent.top : this
  }

  isVulnerable (node) {
    return this.auditReport && this.auditReport.isVulnerable(node)
  }

  get peerEntryEdge () {
    return this.top.edge
  }
}

module.exports = PlaceDep
