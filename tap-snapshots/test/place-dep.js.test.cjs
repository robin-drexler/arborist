/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/place-dep.js TAP basic placement tests accept an older transitive dependency > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP basic placement tests accept an older transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": undefined,
    "checks": Map {},
    "dep": "bar@1.0.1",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP basic placement tests accept an older transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests basic placement of a production dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,27 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP basic placement tests basic placement of a production dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests basic placement of a production dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests dedupe a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual
@@ -22,6 +22,30 @@
     },
   },
   "children": Map {
+    "bar" => ArboristNode {
+      "name": "bar",
+      "version": "1.0.0",
+      "location": "node_modules/bar",
+      "path": "/some/path/node_modules/bar",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "bar",
+          "spec": "1",
+          "from": "node_modules/baz",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "bar",
+          "spec": "1",
+          "from": "node_modules/foo",
+        },
+      },
+    },
     "baz" => ArboristNode {
       "name": "baz",
       "version": "1.0.0",
@@ -36,8 +60,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -63,8 +86,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/bar",
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP basic placement tests dedupe a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests dedupe a transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests dep with load error > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,9 +12,35 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "error": "MISSING",
+      "error": "INVALID",
       "overridden": true,
-      "to": null,
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "errors": Array [
+        Object {
+          "code": "testing",
+        },
+      ],
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "error": "INVALID",
+          "overridden": true,
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP basic placement tests dep with load error > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests dep with load error > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests explicit placement of a production dep > changes to tree 1`] = `
--- expected
+++ actual
@@ -12,8 +12,27 @@
       "type": "prod",
       "name": "foo",
       "spec": "1",
-      "to": null,
-      "error": "MISSING",
+      "to": "node_modules/foo",
     },
   },
+  "children": Map {
+    "foo" => ArboristNode {
+      "name": "foo",
+      "version": "1.0.0",
+      "location": "node_modules/foo",
+      "path": "/some/path/node_modules/foo",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "prod",
+          "name": "foo",
+          "spec": "1",
+          "from": "",
+        },
+      },
+    },
+  },
 }

`

exports[`test/place-dep.js TAP basic placement tests explicit placement of a production dep > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "foo@1.0.0",
    "edge": "{ ROOT prod foo@1 }",
    "placed": "node_modules/foo",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests explicit placement of a production dep > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests keep, but dedupe > changes to tree 1`] = `
--- expected
+++ actual
@@ -43,29 +43,9 @@
           "type": "prod",
           "name": "y",
           "spec": "1",
-          "to": "z/node_modules/y",
+          "to": "node_modules/y",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.1.2",
-          "location": "z/node_modules/y",
-          "path": "/some/path/z/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1",
-              "from": "z",
-            },
-          },
-        },
-      },
     },
   },
   "children": Map {
@@ -83,7 +63,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1.1",
-          "to": "node_modules/x/node_modules/y",
+          "to": "node_modules/y",
         },
       },
       "edgesIn": Set {
@@ -94,26 +74,6 @@
           "from": "",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.1.0",
-          "location": "node_modules/x/node_modules/y",
-          "path": "/some/path/node_modules/x/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.1",
-              "from": "node_modules/x",
-            },
-          },
-        },
-      },
     },
     "y" => ArboristNode {
       "name": "y",
@@ -131,6 +91,18 @@
           "spec": "1",
           "from": "",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.1",
+          "from": "node_modules/x",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1",
+          "from": "z",
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP basic placement tests keep, but dedupe > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(KEEP),
    "canPlaceSelf": Symbol(KEEP),
    "checks": Map {
      "node_modules/x" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
      "" => Array [
        Symbol(KEEP),
        Symbol(KEEP),
      ],
    },
    "dep": "y@1.1.2",
    "edge": "{ node_modules/x prod y@1.1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP basic placement tests keep, but dedupe > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests nest a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual
@@ -38,13 +38,6 @@
           "spec": "1",
           "from": "node_modules/foo",
         },
-        EdgeIn {
-          "type": "prod",
-          "name": "bar",
-          "spec": "1.0.0",
-          "error": "INVALID",
-          "from": "node_modules/baz",
-        },
       },
     },
     "baz" => ArboristNode {
@@ -61,8 +54,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1.0.0",
-          "to": "node_modules/bar",
-          "error": "INVALID",
+          "to": "node_modules/baz/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -73,6 +65,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/baz/node_modules/bar",
+          "path": "/some/path/node_modules/baz/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1.0.0",
+              "from": "node_modules/baz",
+            },
+          },
+        },
+      },
     },
     "foo" => ArboristNode {
       "name": "foo",

`

exports[`test/place-dep.js TAP basic placement tests nest a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/baz" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(CONFLICT),
        Symbol(CONFLICT),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/baz prod bar@1.0.0 }",
    "placed": "node_modules/baz/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests nest a transitive dependency > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests nest because globalStyle > changes to tree 1`] = `
--- expected
+++ actual
@@ -37,8 +37,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/foo/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -49,6 +48,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/bar",
+          "path": "/some/path/node_modules/foo/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1",
+              "from": "node_modules/foo",
+            },
+          },
+        },
+      },
     },
   },
 }

`

exports[`test/place-dep.js TAP basic placement tests nest because globalStyle > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/foo/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests nest because globalStyle > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests nest even though unnecessary, because legacy bundling > changes to tree 1`] = `
--- expected
+++ actual
@@ -63,8 +63,7 @@
           "type": "prod",
           "name": "bar",
           "spec": "1",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/foo/node_modules/bar",
         },
       },
       "edgesIn": Set {
@@ -75,6 +74,26 @@
           "from": "",
         },
       },
+      "children": Map {
+        "bar" => ArboristNode {
+          "name": "bar",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/bar",
+          "path": "/some/path/node_modules/foo/node_modules/bar",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "bar",
+              "spec": "1",
+              "from": "node_modules/foo",
+            },
+          },
+        },
+      },
     },
   },
 }

`

exports[`test/place-dep.js TAP basic placement tests nest even though unnecessary, because legacy bundling > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": "node_modules/foo/node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests nest even though unnecessary, because legacy bundling > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests nest only 1 level due to globalStyle > changes to tree 1`] = `
--- expected
+++ actual
@@ -63,8 +63,7 @@
               "type": "prod",
               "name": "baz",
               "spec": "*",
-              "to": null,
-              "error": "MISSING",
+              "to": "node_modules/foo/node_modules/baz",
             },
           },
           "edgesIn": Set {
@@ -76,6 +75,24 @@
             },
           },
         },
+        "baz" => ArboristNode {
+          "name": "baz",
+          "version": "1.0.0",
+          "location": "node_modules/foo/node_modules/baz",
+          "path": "/some/path/node_modules/foo/node_modules/baz",
+          "extraneous": true,
+          "dev": true,
+          "optional": true,
+          "peer": true,
+          "edgesIn": Set {
+            EdgeIn {
+              "type": "prod",
+              "name": "baz",
+              "spec": "*",
+              "from": "node_modules/foo/node_modules/bar",
+            },
+          },
+        },
       },
     },
   },

`

exports[`test/place-dep.js TAP basic placement tests nest only 1 level due to globalStyle > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/foo/node_modules/bar" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "node_modules/foo" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "baz@1.0.0",
    "edge": "{ node_modules/foo/node_modules/bar prod baz@ }",
    "placed": "node_modules/foo/node_modules/baz",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests nest only 1 level due to globalStyle > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests prefer to dedupe rather than nest > changes to tree 1`] = `
--- expected
+++ actual
@@ -24,7 +24,7 @@
   "children": Map {
     "bar" => ArboristNode {
       "name": "bar",
-      "version": "1.0.1",
+      "version": "1.0.0",
       "location": "node_modules/bar",
       "path": "/some/path/node_modules/bar",
       "extraneous": true,
@@ -35,15 +35,14 @@
         EdgeIn {
           "type": "prod",
           "name": "bar",
-          "spec": "1",
-          "from": "node_modules/foo",
+          "spec": "1.0.0",
+          "from": "node_modules/baz",
         },
         EdgeIn {
           "type": "prod",
           "name": "bar",
-          "spec": "1.0.0",
-          "error": "INVALID",
-          "from": "node_modules/baz",
+          "spec": "1",
+          "from": "node_modules/foo",
         },
       },
     },
@@ -62,7 +61,6 @@
           "name": "bar",
           "spec": "1.0.0",
           "to": "node_modules/bar",
-          "error": "INVALID",
         },
       },
       "edgesIn": Set {

`

exports[`test/place-dep.js TAP basic placement tests prefer to dedupe rather than nest > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/baz" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "bar@1.0.0",
    "edge": "{ node_modules/baz prod bar@1.0.0 }",
    "placed": "node_modules/bar",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests prefer to dedupe rather than nest > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > changes to tree 1`] = `
--- expected
+++ actual
@@ -47,55 +47,9 @@
           "type": "prod",
           "name": "y",
           "spec": "1.2",
-          "to": "k/node_modules/y",
+          "to": "node_modules/y",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.2.0",
-          "location": "k/node_modules/y",
-          "path": "/some/path/k/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesOut": Map {
-            "z" => EdgeOut {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "to": "k/node_modules/z",
-            },
-          },
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.2",
-              "from": "k",
-            },
-          },
-        },
-        "z" => ArboristNode {
-          "name": "z",
-          "version": "1.0.0",
-          "location": "k/node_modules/z",
-          "path": "/some/path/k/node_modules/z",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "from": "k/node_modules/y",
-            },
-          },
-        },
-      },
     },
   },
   "children": Map {
@@ -212,7 +166,7 @@
           "type": "prod",
           "name": "y",
           "spec": "1.2",
-          "to": "node_modules/x/node_modules/y",
+          "to": "node_modules/y",
         },
         "z" => EdgeOut {
           "type": "prod",
@@ -229,58 +183,10 @@
           "from": "",
         },
       },
-      "children": Map {
-        "y" => ArboristNode {
-          "name": "y",
-          "version": "1.2.0",
-          "location": "node_modules/x/node_modules/y",
-          "path": "/some/path/node_modules/x/node_modules/y",
-          "extraneous": true,
-          "dev": true,
-          "optional": true,
-          "peer": true,
-          "edgesOut": Map {
-            "z" => EdgeOut {
-              "type": "prod",
-              "name": "z",
-              "spec": "1",
-              "to": "node_modules/x/node_modules/y/node_modules/z",
-            },
-          },
-          "edgesIn": Set {
-            EdgeIn {
-              "type": "prod",
-              "name": "y",
-              "spec": "1.2",
-              "from": "node_modules/x",
-            },
-          },
-          "children": Map {
-            "z" => ArboristNode {
-              "name": "z",
-              "version": "1.0.0",
-              "location": "node_modules/x/node_modules/y/node_modules/z",
-              "path": "/some/path/node_modules/x/node_modules/y/node_modules/z",
-              "extraneous": true,
-              "dev": true,
-              "optional": true,
-              "peer": true,
-              "edgesIn": Set {
-                EdgeIn {
-                  "type": "prod",
-                  "name": "z",
-                  "spec": "1",
-                  "from": "node_modules/x/node_modules/y",
-                },
-              },
-            },
-          },
-        },
-      },
     },
     "y" => ArboristNode {
       "name": "y",
-      "version": "1.1.0",
+      "version": "1.2.2",
       "location": "node_modules/y",
       "path": "/some/path/node_modules/y",
       "extraneous": true,
@@ -294,12 +200,6 @@
           "spec": "1",
           "to": "node_modules/y/node_modules/z",
         },
-        "f" => EdgeOut {
-          "type": "prod",
-          "name": "f",
-          "spec": "*",
-          "to": "node_modules/f",
-        },
       },
       "edgesIn": Set {
         EdgeIn {
@@ -308,6 +208,18 @@
           "spec": "1",
           "from": "",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.2",
+          "from": "k",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "y",
+          "spec": "1.2",
+          "from": "node_modules/x",
+        },
       },
       "children": Map {
         "z" => ArboristNode {
@@ -354,49 +266,5 @@
         },
       },
     },
-    "f" => ArboristNode {
-      "name": "f",
-      "version": "1.0.0",
-      "location": "node_modules/f",
-      "path": "/some/path/node_modules/f",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesOut": Map {
-        "g" => EdgeOut {
-          "type": "prod",
-          "name": "g",
-          "spec": "*",
-          "to": "node_modules/g",
-        },
-      },
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "f",
-          "spec": "*",
-          "from": "node_modules/y",
-        },
-      },
-    },
-    "g" => ArboristNode {
-      "name": "g",
-      "version": "1.0.0",
-      "location": "node_modules/g",
-      "path": "/some/path/node_modules/g",
-      "extraneous": true,
-      "dev": true,
-      "optional": true,
-      "peer": true,
-      "edgesIn": Set {
-        EdgeIn {
-          "type": "prod",
-          "name": "g",
-          "spec": "*",
-          "from": "node_modules/f",
-        },
-      },
-    },
   },
 }

`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > changes to tree 2`] = `
--- expected
+++ actual
@@ -24,7 +24,7 @@
   "children": Map {
     "a" => ArboristNode {
       "name": "a",
-      "version": "1.0.0",
+      "version": "1.1.1",
       "location": "node_modules/a",
       "path": "/some/path/node_modules/a",
       "extraneous": true,
@@ -42,9 +42,14 @@
           "type": "prod",
           "name": "a",
           "spec": "1.1",
-          "error": "INVALID",
           "from": "node_modules/b",
         },
+        EdgeIn {
+          "type": "prod",
+          "name": "a",
+          "spec": "1.1.1",
+          "from": "node_modules/b/c",
+        },
       },
     },
     "b" => ArboristNode {
@@ -62,7 +67,6 @@
           "name": "a",
           "spec": "1.1",
           "to": "node_modules/a",
-          "error": "INVALID",
         },
         "c" => EdgeOut {
           "type": "prod",
@@ -95,29 +99,9 @@
               "type": "prod",
               "name": "a",
               "spec": "1.1.1",
-              "to": "node_modules/b/c/node_modules/a",
+              "to": "node_modules/a",
             },
           },
-          "children": Map {
-            "a" => ArboristNode {
-              "name": "a",
-              "version": "1.1.1",
-              "location": "node_modules/b/c/node_modules/a",
-              "path": "/some/path/node_modules/b/c/node_modules/a",
-              "extraneous": true,
-              "dev": true,
-              "optional": true,
-              "peer": true,
-              "edgesIn": Set {
-                EdgeIn {
-                  "type": "prod",
-                  "name": "a",
-                  "spec": "1.1.1",
-                  "from": "node_modules/b/c",
-                },
-              },
-            },
-          },
         },
       },
     },

`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/x" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "y@1.2.2",
    "edge": "{ node_modules/x prod y@1.2 }",
    "placed": "node_modules/y",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > placements 2`] = `
Array [
  Object {
    "canPlace": Symbol(REPLACE),
    "canPlaceSelf": Symbol(REPLACE),
    "checks": Map {
      "node_modules/b" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(REPLACE),
        Symbol(REPLACE),
      ],
    },
    "dep": "a@1.1.1",
    "edge": "{ node_modules/b prod a@1.1 }",
    "placed": "node_modules/a",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests replace higher up, and dedupe descendants > warnings 2`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests skip over peer dependents in the ancestry walkup > changes to tree 1`] = `
--- expected
+++ actual
@@ -68,8 +68,7 @@
           "type": "peer",
           "name": "v",
           "spec": "*",
-          "to": null,
-          "error": "MISSING",
+          "to": "node_modules/v",
         },
       },
       "edgesIn": Set {
@@ -95,8 +94,7 @@
               "type": "prod",
               "name": "v",
               "spec": "1",
-              "to": null,
-              "error": "MISSING",
+              "to": "node_modules/v",
             },
           },
           "edgesIn": Set {
@@ -128,5 +126,29 @@
         },
       },
     },
+    "v" => ArboristNode {
+      "name": "v",
+      "version": "1.0.0",
+      "location": "node_modules/v",
+      "path": "/some/path/node_modules/v",
+      "extraneous": true,
+      "dev": true,
+      "optional": true,
+      "peer": true,
+      "edgesIn": Set {
+        EdgeIn {
+          "type": "peer",
+          "name": "v",
+          "spec": "*",
+          "from": "node_modules/b",
+        },
+        EdgeIn {
+          "type": "prod",
+          "name": "v",
+          "spec": "1",
+          "from": "node_modules/b/node_modules/c",
+        },
+      },
+    },
   },
 }

`

exports[`test/place-dep.js TAP basic placement tests skip over peer dependents in the ancestry walkup > placements 1`] = `
Array [
  Object {
    "canPlace": Symbol(OK),
    "canPlaceSelf": Symbol(OK),
    "checks": Map {
      "node_modules/b/node_modules/c" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
      "" => Array [
        Symbol(OK),
        Symbol(OK),
      ],
    },
    "dep": "v@1.0.0",
    "edge": "{ node_modules/b/node_modules/c prod v@1 }",
    "placed": "node_modules/v",
  },
]
`

exports[`test/place-dep.js TAP basic placement tests skip over peer dependents in the ancestry walkup > warnings 1`] = `
Array []
`

exports[`test/place-dep.js TAP basic placement tests upgrade a transitive dependency > changes to tree 1`] = `
--- expected
+++ actual

`

exports[`test/place-dep.js TAP basic placement tests upgrade a transitive dependency > placements 1`] = `
Array [
  Object {
    "canPlace": null,
    "canPlaceSelf": undefined,
    "checks": Map {},
    "dep": "bar@1.0.1",
    "edge": "{ node_modules/foo prod bar@1 }",
    "placed": null,
  },
]
`

exports[`test/place-dep.js TAP basic placement tests upgrade a transitive dependency > warnings 1`] = `
Array []
`
