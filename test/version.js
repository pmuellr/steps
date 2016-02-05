'use strict'

const _util = require('./_util')

const steps = require('..')

const pkg = require('../package.json')

class VersionTests {
  checkVersion (t) {
    t.equal(steps.version, pkg.version, 'lib is expected version')
    t.end()
  }
}

_util.runTests(__filename, new VersionTests())
