const t = require('tap')
const PlaceDep = require('../lib/place-dep.js')
const { KEEP } = require('../lib/can-place-dep.js')

// for diffing trees when we place something
const { strict } = require('tcompare')

const Node = require('../lib/node.js')

t.test('placement tests', t => {
  const path = '/some/path'

  // boilerplate so we can define a bunch of test cases declaratively
  const runTest = (desc, {
    tree,
    nodeLoc,
    peerSet,
    error,
    test,

    dep,
    preferDedupe = false,
    force = false,
    explicitRequest,
    updateNames = [],
    auditReport = null,
    legacyBundling = false,
    strictPeerDeps = false,
    legacyPeerDeps = false,
    globalStyle = false,
  }) => {
    const node = tree.inventory.get(nodeLoc)
    const edge = node.edgesOut.get(dep.name)
    if (!dep.satisfies(edge))
      edge.overridden = true
    const vr = new Node({
      sourceReference: node,
      path: node.path,
      pkg: { ...node.package },
      children: peerSet,
    })
    dep.parent = vr

    // mark any invalid edges in the virtual root as overridden
    for (const child of vr.children.values()) {
      for (const edgeIn of child.edgesIn) {
        if (edgeIn.invalid)
          edgeIn.overridden = true
      }
    }

    const msg = `place ${
      dep.package._id
    } for { ${
      edge.from.location || 'ROOT'
    } ${
      edge.type + ' ' + edge.name + '@' + edge.spec
    } }`

    const place = () => {
      return new PlaceDep({
        edge,
        dep,
        preferDedupe,
        force,
        explicitRequest,
        updateNames,
        auditReport,
        legacyBundling,
        strictPeerDeps,
        legacyPeerDeps,
        globalStyle,
      })
    }

    t.test(desc, t => {
      const before = tree.toJSON()

      // the 'error' arg is the ERESOLVE we expect to get
      if (error) {
        t.throws(place, error)
        const after = tree.toJSON()
        t.strictSame(before, after, 'tree should not change')
        t.end()
        return
      }

      const warnings = []
      const onwarn = (level, ...msg) => {
        if (level === 'warn')
          warnings.push(msg)
      }

      process.on('log', onwarn)
      const pd = place()
      process.removeListener('log', onwarn)

      if (test)
        test(t, tree)

      const after = tree.toJSON()
      const { diff } = strict(after, before)

      t.matchSnapshot(diff, 'changes to tree')
      t.matchSnapshot(warnings, 'warnings')
      t.matchSnapshot([pd, ...pd.allChildren].map(c => {
        if (c.canPlace && c.canPlace.canPlace === KEEP)
          t.equal(c.placed, null, 'should not place if result is KEEP')
        return {
          ...(c.parent ? { parent: c.parent.name } : {}),
          edge: `{ ${
            c.edge.from.location || 'ROOT'
          } ${c.edge.type} ${c.edge.name}@${c.edge.spec} }`,
          dep: `${c.dep.name}@${c.dep.version}`,
          canPlace: c.canPlace && c.canPlace.canPlace,
          canPlaceSelf: c.canPlaceSelf && c.canPlaceSelf.canPlaceSelf,
          placed: c.placed && c.placed.location,
          checks: new Map([...pd.checks].map(([target, cpd]) =>
            [target.location, [cpd.canPlace, cpd.canPlaceSelf]])),
        }
      }), 'placements')

      t.end()
    })
  }

  runTest('basic placement of a production dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' }},
    }),
    dep: new Node({ pkg: { name: 'foo', version: '1.0.0' }}),
    nodeLoc: '',
  })

  runTest('explicit placement of a production dep', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' }},
    }),
    dep: new Node({ pkg: { name: 'foo', version: '1.0.0' }}),
    nodeLoc: '',
    explicitRequest: true,
  })

  runTest('dedupe a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1' }}},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' }}),
    nodeLoc: 'node_modules/foo',
  })

  runTest('upgrade a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'bar', version: '1.0.0' }},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.1' }}),
    nodeLoc: 'node_modules/foo',
  })

  runTest('nest a transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' }}},
        { pkg: { name: 'bar', version: '1.0.1' }},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' }}),
    nodeLoc: 'node_modules/baz',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.1')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/baz/node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('accept an older transitive dependency', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' }}},
        { pkg: { name: 'bar', version: '1.0.0' }},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.1' }}),
    nodeLoc: 'node_modules/foo',
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('nest even though unnecessary, because legacy bundling', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' }}},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' }}),
    nodeLoc: 'node_modules/foo',
    legacyBundling: true,
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar, null)
    },
  })

  runTest('nest because globalStyle', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' }}),
    nodeLoc: 'node_modules/foo',
    globalStyle: true,
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
    },
  })

  runTest('nest only 1 level due to globalStyle', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        {
          pkg: {
            name: 'foo',
            version: '1.0.0',
            dependencies: { bar: '1' },
          },
          children: [
            {
              pkg: {
                name: 'bar',
                version: '1.0.0',
                dependencies: { baz: '' },
              },
            },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'baz', version: '1.0.0' }}),
    nodeLoc: 'node_modules/foo/node_modules/bar',
    globalStyle: true,
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      const foobarbaz = foobar.resolve('baz')
      t.equal(foobar.location, 'node_modules/foo/node_modules/bar')
      t.equal(foobarbaz.location, 'node_modules/foo/node_modules/baz')
    },
  })

  runTest('prefer to dedupe rather than nest', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1', baz: '1' }},
      children: [
        { pkg: { name: 'foo', version: '1.0.0', dependencies: { bar: '1' }}},
        { pkg: { name: 'baz', version: '1.0.0', dependencies: { bar: '1.0.0' }}},
        { pkg: { name: 'bar', version: '1.0.1' }},
      ],
    }),
    dep: new Node({ pkg: { name: 'bar', version: '1.0.0' }}),
    nodeLoc: 'node_modules/baz',
    preferDedupe: true,
    test: (t, tree) => {
      const foobar = tree.children.get('foo').resolve('bar')
      t.equal(foobar.location, 'node_modules/bar')
      t.equal(foobar.version, '1.0.0')
      const bazbar = tree.children.get('baz').resolve('bar')
      t.equal(bazbar.location, 'node_modules/bar')
      t.equal(bazbar.version, '1.0.0')
    },
  })

  runTest('dep with load error', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' }},
    }),
    dep: new Node({
      error: Object.assign(new Error('oops'), { code: 'testing' }),
      name: 'foo',
    }),
    nodeLoc: '',
  })

  // root -> (x, y@1)
  // +-- x -> (y@1.1)
  // |   +-- y@1.1.0 (replacing with 1.1.2, got KEEP at the root)
  // +-- y@1.1.2 (updated already from 1.0.0)
  runTest('keep, but dedupe', {
    tree: new Node({
      path,
      pkg: { dependencies: { x: '', y: '1', z: 'file:z' }},
      children: [
        { pkg: { name: 'y', version: '1.1.2' }},
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1.1' }},
          children: [{ pkg: { name: 'y', version: '1.1.0' }}],
        },
      ],
      fsChildren: [
        {
          path: `${path}/z`,
          pkg: { name: 'z', version: '1.2.3', dependencies: { y: '1' }},
          // this will get deduped out
          children: [{ pkg: { name: 'y', version: '1.1.2' }}],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.1.2' }}),
    updateNames: ['y'],
    nodeLoc: 'node_modules/x',
    test: (t, tree) => {
      const x = tree.children.get('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/y')
      t.equal(y.version, '1.1.2')
      const z = tree.inventory.get('z')
      const zy = z.resolve('y')
      t.equal(zy.location, y.location, 'y bundled under z is removed')
    },
  })

  // y depends on z@1, everything else depends on z@2, so every y has a z dupe
  // root -> (y@1, x, z@2, a, k@file:k)
  // +-- a -> (y@1.0.0, z@2.0.0)
  // |   +-- z@2.0.0
  // |   +-- y@1.0.0 -> (z@1, file:v) (will not be deduped)
  // |       +fs v@1.0.0 -> (z@2)
  // |       |   +-- z@2.0.0
  // |       +-- z@1.0.0
  // +-- z@2.1.0
  // +-- f@1.0.0 (will be pruned upon replacement)
  // +-- y@1.1.0 -> (z@1, f) (replacing with 1.2.2)
  // |   +-- z@1.0.0
  // +-- x -> (y@1.2, z@2)
  //     +-- y@1.2.0 -> (z@1, w@1) (got REPLACE at the root, will dedupe)
  //         +-- z@1.0.0
  // root/k -> (y@1.2)
  // +-- y@1.2.0 -> (z@1) (will dedupe)
  // +-- z@1.0.0 (will be pruned when y sibling removed)
  runTest('replace higher up, and dedupe descendants', {
    tree: new Node({
      path,
      pkg: { dependencies: { y: '1', z: '2', a: '', x: '' }},
      children: [
        {
          pkg: { name: 'a', version: '1.0.0', dependencies: { y: '1.0.0', z: '2.0.0' }},
          children: [
            { pkg: { name: 'z', version: '2.0.0' }},
            {
              pkg: { name: 'y', dependencies: { z: '1' }},
              children: [{ pkg: { name: 'z', version: '1.0.0' }}],
            },
          ],
        },
        { pkg: { name: 'f', version: '1.0.0', dependencies: { g: '' }}},
        { pkg: { name: 'g', version: '1.0.0' }},
        {
          pkg: { name: 'y', version: '1.1.0', dependencies: { z: '1', f: '' }},
          children: [{ pkg: { name: 'z', version: '1.0.0' }}],
        },
        { pkg: { name: 'z', version: '2.1.0' }},
        {
          pkg: { name: 'x', version: '1.0.0', dependencies: { y: '1.2', z: '2' }},
          children: [{
            pkg: { name: 'y', version: '1.2.0', dependencies: { z: '1' }},
            children: [{ pkg: { name: 'z', version: '1.0.0' }}],
          }],
        },
      ],
      // root/k -> (y@1.2)
      // +-- y@1.2.0 -> (z@1) (will dedupe)
      // +-- z@1.0.0
      fsChildren: [
        {
          pkg: { name: 'k', dependencies: { y: '1.2' }},
          path: `${path}/k`,
          children: [
            { pkg: { name: 'y', version: '1.2.0', dependencies: { z: '1' }}},
            { pkg: { name: 'z', version: '1.0.0' }},
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'y', version: '1.2.2', dependencies: { z: '1' }}}),
    updateNames: ['y'],
    nodeLoc: 'node_modules/x',
    test: (t, tree) => {
      const x = tree.children.get('x')
      const y = x.resolve('y')
      t.equal(y.location, 'node_modules/y')
      t.equal(y.version, '1.2.2')
      t.equal(tree.resolve('f'), null)
      t.equal(tree.resolve('g'), null)
      const z = tree.resolve('z')
      t.equal(z.location, 'node_modules/z')
      t.equal(z.version, '2.1.0')
      const k = tree.inventory.get('k')
      t.equal(k.children.size, 0, 'children of fsChild all deduped out')
    },
  })

  // root -> (a@1, b)
  // +-- a@1.0.0
  // +-- b -> (c@link:c, a@1.1)
  //     +-- a@1.1.0
  // root/node_modules/b/c -> (a@1.1.1)
  // +-- a@1.1.1
  //
  // place a@1.1.1 for b, dedupe all other a's
  runTest('replace higher up, and dedupe descendants', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '1', b: '' }},
      children: [
        { pkg: { name: 'a', version: '1.0.0' }},
        {
          pkg: {
            name: 'b',
            version: '1.0.0',
            dependencies: {
              c: 'file:c',
              a: '1.1',
            },
          },
          fsChildren: [
            {
              path: `${path}/node_modules/b/c`,
              pkg: {
                name: 'c',
                version: '1.0.0',
                dependencies: { a: '1.1.1' },
              },
              children: [{ pkg: { name: 'a', version: '1.1.1' }}],
            },
          ],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'a', version: '1.1.1' }}),
    nodeLoc: 'node_modules/b',
    test: (t, tree) => {
      const a = [...tree.inventory.query('name', 'a')].map(a => a.location)
      t.strictSame(a, ['node_modules/a'], 'should be left with one a')
    },
  })


  // a -> (b@1, c@1)
  // +-- c@1
  // +-- b -> PEEROPTIONAL(v) (c@2)
  //     +-- c@2 -> (v)
  // place v for c@2, should end up at a, skipping over b
  runTest('skip over peer dependents in the ancestry walkup', {
    tree: new Node({
      path,
      pkg: { dependencies: { a: '' }},
      children: [
        {
          pkg: { name: 'a', version: '1.0.0', dependencies: { b: '1.0.0', c: '1.0.0' }},
        },
        { pkg: { name: 'c', version: '1.0.0' }},
        {
          pkg: {
            name: 'b',
            version: '1.0.0',
            dependencies: { c: '2' },
            peerDependencies: { v: '' },
          },
          children: [{
            pkg: { name: 'c', version: '2.0.0', dependencies: { v: '1' }},
          }],
        },
      ],
    }),
    dep: new Node({ pkg: { name: 'v', version: '1.0.0' }}),
    nodeLoc: 'node_modules/b/node_modules/c',
    test: (t, tree) => t.ok(tree.children.get('v')),
  })

  // peer dep shenanigans
  runTest('basic placement of a production dep with peer deps', {
    tree: new Node({
      path,
      pkg: { dependencies: { foo: '1' }},
    }),
    dep: new Node({
      pkg: { name: 'foo', version: '1.0.0', peerDependencies: { bar: '' }},
    }),
    nodeLoc: '',
    peerSet: [
      { pkg: { name: 'bar', version: '1.0.0', peerDependencies: { baz: '' }}},
      { pkg: { name: 'baz', version: '1.0.0' }},
    ],
  })

  t.end()
})
