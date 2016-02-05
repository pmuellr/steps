'use strict'

const steps = require('..')

let dateStart = Date.now()

steps.series({n: 's'}, [a, b])
  .run(obj => console.log(this, obj))

steps.parallel({n: 'p'}, [a, b])
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

function onTimeout (ms, fn) { setTimeout(fn, ms) }

function elapsed () { return Date.now() - dateStart }
