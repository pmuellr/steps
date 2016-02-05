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
    this.self = data
    this.data = data
    this.steps = (steps || []).slice()
    this.running = false
  }

  add (step) {
    if (this.running) throw new Error('invalid when running')
    this.steps.push(step)

    return this
  }

  bind (self) {
    if (this.running) throw new Error('invalid when running')

    this.self = self

    return this
  }

  run (cb) {
    if (this.running) throw new Error('invalid when running')

    this.running = true
    this.cb = cb

    this.basicRun()
  }

  callStep (stepFn, stepContext) {
    stepContext.data = this.data
    stepContext.done = this.ensureOnce(stepContext.done)
    stepContext.stop = this.ensureOnce(stepContext.stop)

    stepFn.call(this.self, stepContext)
  }

  ensureOnce (fn) {
    let called = false
    return function () {
      if (called) throw new Error('already called once')

      called = true
      fn.apply(this, [].slice.call(arguments))
    }
  }

  finish () {
    process.nextTick(cbWrapper, this.cb, this.data)

    this.cb = null
    this.data = null
    this.steps = null

    function cbWrapper (cb, data) {
      cb.call(data, data)
    }
  }

}

class Series extends Evaluator {

  basicRun () {
    // finished?
    if (this.steps.length === 0) return this.finish()

    // get next stepFn, build stepContext
    const stepFn = this.steps.shift()
    const stepContext = {
      done: _ => this.basicRun(),
      stop: _ => this.finish()
    }

    // call step
    this.callStep(stepFn, stepContext)
  }

}

class Parallel extends Evaluator {

  basicRun () {
    // finished?
    if (this.steps.length === 0) return this.finish()

    let length = this.steps.length

    for (let stepFn of this.steps) {
      const stepContext = {
        done: _ => { length--; if (length === 0) this.finish() },
        stop: stopFn
      }

      this.callStep(stepFn, stepContext)
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
