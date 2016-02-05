'use strict'

const path = require('path')

const tape = require('tape')

exports.runTests = runTests

function runTests (fileName, testsObject) {
  fileName = path.basename(fileName)
  const fnNames = Object.getOwnPropertyNames(Object.getPrototypeOf(testsObject))
  const className = testsObject.constructor.name || 'Anonymous Class!?'

  if (typeof testsObject.setup === 'function') {
    tape(`${fileName}: ${className}::setup`, t =>
      testsObject.setup(t)
    )
  }

  for (let fnName of fnNames) {
    if (fnName === 'constructor') continue
    if (fnName === 'setup') continue
    if (fnName === 'teardown') continue
    if (fnName[0] === '_') continue

    const fn = testsObject[fnName]
    if (typeof fn !== 'function') continue

    tape(`${fileName}: ${className}::${fnName}`, t =>
      testsObject[fnName](t)
    )
  }

  if (typeof testsObject.teardown === 'function') {
    tape(`${fileName}: ${className}::teardown`, t =>
      testsObject.teardown(t)
    )
  }
}
