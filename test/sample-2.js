'use strict'

const steps = require('..')

let dateStart = Date.now()

steps.series({n: 's'})
  .add(a)
  .add(stop)
  .add(b)
  .run(obj => console.log(this, obj))

steps.parallel({n: 'p'}, [a])
  .add(b)
  .run(obj => console.log(this, obj))

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

function stop (sc) {
  sc.stop()
}

function onTimeout (ms, fn) { setTimeout(fn, ms) }

function elapsed () { return Date.now() - dateStart }
