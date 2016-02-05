'use strict'

const steps = require('..')

class Tx {
  constructor (n) {
    this.n = n
  }

  a (sc) {
    onTimeout(100, _ => this.cbTimeout(sc, 'x'))
  }

  b (sc) {
    onTimeout(100, _ => this.cbTimeout(sc, 'y'))
  }

  cbTimeout (sc, prop) {
    this[prop] = elapsed()
    sc.done()
  }
}

let tx1 = new Tx('s3')
steps.series(tx1, [tx1.a, tx1.b])
  .run(obj => console.log(this, obj))

let tx2 = new Tx('p3')
steps.parallel(tx2, [tx2.a, tx2.b])
  .run(obj => console.log(this, obj))

function onTimeout (ms, fn) { setTimeout(fn, ms) }

let dateStart = Date.now()

function elapsed () { return Date.now() - dateStart }
