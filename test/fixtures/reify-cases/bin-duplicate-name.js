// generated from test/fixtures/bin-duplicate-name
module.exports = t => {
  const path = t.testdir({
  "package-lock.json": JSON.stringify({
    "name": "@isaacs/bin-duplicate-name",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "name": "@isaacs/bin-duplicate-name",
        "version": "1.0.0",
        "dependencies": {
          "@financial-times/sass": "^1.32.4",
          "semver": "^7.3.5"
        }
      },
      "node_modules/@financial-times/sass": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass/-/sass-1.32.4.tgz",
        "integrity": "sha512-sFnpSLnhGk0uS6Q/vK5qHNU7ejtQqsDb5qbRzYEtfMieNNo0ICzWLSwfQa/x2a9to0hgI8E2WJP/rUBHjGkJUQ==",
        "hasInstallScript": true,
        "license": "MIT",
        "bin": {
          "sass": "sass.bat"
        },
        "optionalDependencies": {
          "@financial-times/sass-linux-ia32": "^1.32.4",
          "@financial-times/sass-linux-x64": "^1.32.4",
          "@financial-times/sass-macos-x64": "^1.32.4",
          "@financial-times/sass-windows-ia32": "^1.32.4",
          "@financial-times/sass-windows-x64": "^1.32.4"
        }
      },
      "node_modules/@financial-times/sass-linux-ia32": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-linux-ia32/-/sass-linux-ia32-1.32.4.tgz",
        "integrity": "sha512-Oxhk/X2YZaiyBz/xLf8T5O6bYaXGjLvypdpksI0wpseeKGnGSwIcK9Wl4PqNTjBReH8QuQ3kBaFL0V0jatmFzQ==",
        "cpu": [
          "ia32"
        ],
        "hasInstallScript": true,
        "optional": true,
        "os": [
          "linux"
        ],
        "bin": {
          "sass": "dart-sass/sass"
        }
      },
      "node_modules/@financial-times/sass-linux-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-linux-x64/-/sass-linux-x64-1.32.4.tgz",
        "integrity": "sha512-3x6f5D2f7eqCpEOUtqxhAH1uVH+Ev0zzR1+fgTsoB1wtZAluMkEDd4vKOEsZs5FazaNPH/XI/bGtubhKosJSIQ==",
        "cpu": [
          "x64"
        ],
        "hasInstallScript": true,
        "optional": true,
        "os": [
          "linux"
        ],
        "bin": {
          "sass": "dart-sass/sass"
        }
      },
      "node_modules/@financial-times/sass-macos-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-macos-x64/-/sass-macos-x64-1.32.4.tgz",
        "integrity": "sha512-P1ZtIxvxX3Auu42WCAXPThobuSW2yhoSvwoK4NdYy7mfNMgmvcqlsqUqJ23cuitX55eIV/unioH7SwwrDRk/wg==",
        "hasInstallScript": true,
        "optional": true,
        "os": [
          "darwin"
        ],
        "bin": {
          "sass": "dart-sass/sass"
        }
      },
      "node_modules/@financial-times/sass-windows-ia32": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-windows-ia32/-/sass-windows-ia32-1.32.4.tgz",
        "integrity": "sha512-+KI8zZAKX8OUE93Z5K3lkZp7bsbZ9lbulfCm6S8xybvjL56nyiD7Cs178lQrQKsntaGZyt6D3tCTWb5kOjWNWg==",
        "cpu": [
          "ia32"
        ],
        "hasInstallScript": true,
        "optional": true,
        "os": [
          "win32"
        ],
        "bin": {
          "sass": "dart-sass/sass.bat"
        }
      },
      "node_modules/@financial-times/sass-windows-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-windows-x64/-/sass-windows-x64-1.32.4.tgz",
        "integrity": "sha512-rIWMwFtGYgi0dQc0/BKoHERs/qlCJWI7/jmQ25QGRA2g2oeiIsMLDytvmbLaJ5VgvR4JFhr33sj6cK9KSqq43A==",
        "cpu": [
          "x64"
        ],
        "hasInstallScript": true,
        "optional": true,
        "os": [
          "win32"
        ],
        "bin": {
          "sass": "dart-sass/sass.bat"
        }
      },
      "node_modules/lru-cache": {
        "version": "6.0.0",
        "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
        "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
        "dependencies": {
          "yallist": "^4.0.0"
        },
        "engines": {
          "node": ">=10"
        }
      },
      "node_modules/semver": {
        "version": "7.3.5",
        "resolved": "https://registry.npmjs.org/semver/-/semver-7.3.5.tgz",
        "integrity": "sha512-PoeGJYh8HK4BTO/a9Tf6ZG3veo/A7ZVsYrSA6J8ny9nb3B1VrpkuN+z9OE5wfE5p6H4LchYZsegiQgbJD94ZFQ==",
        "dependencies": {
          "lru-cache": "^6.0.0"
        },
        "bin": {
          "semver": "bin/semver.js"
        },
        "engines": {
          "node": ">=10"
        }
      },
      "node_modules/yallist": {
        "version": "4.0.0",
        "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
        "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
      }
    },
    "dependencies": {
      "@financial-times/sass": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass/-/sass-1.32.4.tgz",
        "integrity": "sha512-sFnpSLnhGk0uS6Q/vK5qHNU7ejtQqsDb5qbRzYEtfMieNNo0ICzWLSwfQa/x2a9to0hgI8E2WJP/rUBHjGkJUQ==",
        "requires": {
          "@financial-times/sass-linux-ia32": "^1.32.4",
          "@financial-times/sass-linux-x64": "^1.32.4",
          "@financial-times/sass-macos-x64": "^1.32.4",
          "@financial-times/sass-windows-ia32": "^1.32.4",
          "@financial-times/sass-windows-x64": "^1.32.4"
        }
      },
      "@financial-times/sass-linux-ia32": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-linux-ia32/-/sass-linux-ia32-1.32.4.tgz",
        "integrity": "sha512-Oxhk/X2YZaiyBz/xLf8T5O6bYaXGjLvypdpksI0wpseeKGnGSwIcK9Wl4PqNTjBReH8QuQ3kBaFL0V0jatmFzQ==",
        "optional": true
      },
      "@financial-times/sass-linux-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-linux-x64/-/sass-linux-x64-1.32.4.tgz",
        "integrity": "sha512-3x6f5D2f7eqCpEOUtqxhAH1uVH+Ev0zzR1+fgTsoB1wtZAluMkEDd4vKOEsZs5FazaNPH/XI/bGtubhKosJSIQ==",
        "optional": true
      },
      "@financial-times/sass-macos-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-macos-x64/-/sass-macos-x64-1.32.4.tgz",
        "integrity": "sha512-P1ZtIxvxX3Auu42WCAXPThobuSW2yhoSvwoK4NdYy7mfNMgmvcqlsqUqJ23cuitX55eIV/unioH7SwwrDRk/wg==",
        "optional": true
      },
      "@financial-times/sass-windows-ia32": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-windows-ia32/-/sass-windows-ia32-1.32.4.tgz",
        "integrity": "sha512-+KI8zZAKX8OUE93Z5K3lkZp7bsbZ9lbulfCm6S8xybvjL56nyiD7Cs178lQrQKsntaGZyt6D3tCTWb5kOjWNWg==",
        "optional": true
      },
      "@financial-times/sass-windows-x64": {
        "version": "1.32.4",
        "resolved": "https://registry.npmjs.org/@financial-times/sass-windows-x64/-/sass-windows-x64-1.32.4.tgz",
        "integrity": "sha512-rIWMwFtGYgi0dQc0/BKoHERs/qlCJWI7/jmQ25QGRA2g2oeiIsMLDytvmbLaJ5VgvR4JFhr33sj6cK9KSqq43A==",
        "optional": true
      },
      "lru-cache": {
        "version": "6.0.0",
        "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
        "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
        "requires": {
          "yallist": "^4.0.0"
        }
      },
      "semver": {
        "version": "7.3.5",
        "resolved": "https://registry.npmjs.org/semver/-/semver-7.3.5.tgz",
        "integrity": "sha512-PoeGJYh8HK4BTO/a9Tf6ZG3veo/A7ZVsYrSA6J8ny9nb3B1VrpkuN+z9OE5wfE5p6H4LchYZsegiQgbJD94ZFQ==",
        "requires": {
          "lru-cache": "^6.0.0"
        }
      },
      "yallist": {
        "version": "4.0.0",
        "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
        "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "@isaacs/bin-duplicate-name",
    "version": "1.0.0",
    "dependencies": {
      "@financial-times/sass": "^1.32.4",
      "semver": "^7.3.5"
    }
  })
})
  return path
}
