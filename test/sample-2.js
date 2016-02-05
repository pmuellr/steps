'use strict'

const steps = require('..')

let dateStart = Date.now()

// same as the series example above, but adding the steps with the `add()`
// method, and adding a new step which will call the `stop()` function of the
// step context.  b() will not be invoked.
steps.series({n: 's2'})
  .add(a)
  .add(stop)
  .add(b)
  .run(obj => console.log(this, obj))

// same as the parallel sample above, but adding the step b with the `add()`
// method
steps.parallel({n: 'p2'}, [a])
  .add(b)
  .run(obj => console.log(this, obj))

// This new step function will call `stop()` function on the step context,
// which will stop further steps from running.
function stop (sc) {
  sc.stop()
}

function a (sc) {
  onTimeout(100, function () {
    sc.data.x = elapsed()
    sc.done()
  })
}

function b (sc) {
  onTimeout(100, _ => {
    this.y = elapsed()
    sc.done()
  })
}

function onTimeout (ms, fn) { setTimeout(fn, ms) }

function elapsed () { return Date.now() - dateStart }
