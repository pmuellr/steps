'use strict'

exports.series = series
exports.parallel = parallel

function series (data, steps) {
  return new Series(data, steps)
}

function parallel (data, steps) {
  return new Parallel(data, steps)
}

class Evaluator {
  constructor (data, steps) {
    this._self = data
    this._data = data
    this._steps = (steps || []).slice()
    this._running = false
  }

  add (step) {
    ensureNotRunning(this)
    this._steps.push(step)

    return this
  }

  series (steps) {
    ensureNotRunning(this)
    throw new Error('TBD')
  }

  parallel (steps) {
    ensureNotRunning(this)
    throw new Error('TBD')
  }

  bind (self) {
    ensureNotRunning(this)

    this._self = self

    return this
  }

  run (cb) {
    ensureNotRunning(this)

    this._running = true
    this._cb = cb

    this._basicRun()
  }

  _callStep (stepFn, stepContext) {
    stepContext.data = this._data
    stepContext.done = ensureCalledOnce(stepContext.done)
    stepContext.stop = ensureCalledOnce(stepContext.stop)

    stepFn.call(this._self, stepContext)
  }

  _finish () {
    process.nextTick(cbWrapper, this._cb, this._self, this._data)

    this._cb = null
    this._self = null
    this._data = null
    this._steps = null

    function cbWrapper (cb, self, data) {
      cb.call(self, data)
    }
  }
}

function ensureNotRunning (steps) {
  if (steps._running) throw new Error('cannot call while running')
}

function ensureCalledOnce (fn) {
  let called = false

  return function () {
    if (called) throw new Error('already called once')

    called = true
    return fn.apply(this, [].slice.call(arguments))
  }
}

class Series extends Evaluator {

  _basicRun () {
    // finished?
    if (this._steps.length === 0) return this._finish()

    // get next stepFn, build stepContext
    const stepFn = this._steps.shift()
    const stepContext = {
      done: _ => this._basicRun(),
      stop: _ => this._finish()
    }

    // call step
    this._callStep(stepFn, stepContext)
  }

}

class Parallel extends Evaluator {

  _basicRun () {
    // finished?
    if (this._steps.length === 0) return this._finish()

    let length = this._steps.length

    for (let stepFn of this._steps) {
      const stepContext = {
        done: _ => { length--; if (length === 0) this._finish() },
        stop: stopFn
      }

      this._callStep(stepFn, stepContext)
    }

    function stopFn () {
      throw new Error('stop() not available in parallel')
    }
  }

}

try {
  const pkg = require('./package.json')
  exports.version = pkg.version
} catch (e) {
  exports.version = null
}
