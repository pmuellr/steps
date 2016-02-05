'use strict'

const steps = require('..')

// Create a series of steps to run - functions a() and then b() - passing
// {n: 's'} as the data object all step functions have access to.
// The run() method starts the series running, and is passed a callback
// which takes the data object as an argument.  The callback is invoked when
// b() has completed.
steps.series({n: 's1'}, [a, b])
  .run(obj => console.log(this, obj))

// Same as above, but run a() and b() in parallel instead of serially.  The
// callback is invoked when both a() and b() have completed.
steps.parallel({n: 'p1'}, [a, b])
  .run(obj => console.log(this, obj))

// The a() function updates the data object - `sc.data` - with a `x` property
// whose value is the time since we started the sample.  `sc` is the step
// context object.  Calling `sc.done()` indicates the step function has
// completed.
function a (sc) {
  onTimeout(100, function () {
    sc.data.x = elapsed()
    sc.done()
  })
}

// Same as a(), but accesses the data object via `this` instead of `sc.data`,
// and updates the `y` property instead of the `x` property.
function b (sc) {
  onTimeout(100, _ => {
    this.y = elapsed()
    sc.done()
  })
}

// setTimeout() with args reversed
function onTimeout (ms, fn) { setTimeout(fn, ms) }

// base time to use to calculate elapsed time, below
let dateStart = Date.now()

// time since base time
function elapsed () { return Date.now() - dateStart }
