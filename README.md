`steps` - manage a set of async function calls
================================================================================

`steps` is a library providing some structural constructs around running
coordinating the running of multiple async functions.


samples
================================================================================

Below is a sample showing running two async functions:

```js
const steps = require('steps')

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
```

Here's the sample output:

    {} { n: 'p1', x: 103, y: 104 }
    {} { n: 's1', x: 103, y: 208 }

Below is another sample, using function/data from above, but using some
different APIs:

```js
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
```

Here's the sample output:

    {} { n: 's2', x: 103 }
    {} { n: 'p2', x: 103, y: 103 }

Lastly, here's a sample which uses more of an OO flavor to do the same things:

```js
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
```

Here's the sample output:

    {} Tx { n: 'p3', x: 103, y: 103 }
    {} Tx { n: 's3', x: 103, y: 207 }

API
================================================================================

module exports
---------------------------------------

This package exports the following functions:

**`series (data, steps)`**

**`parallel (data, steps)`**

The `data` parameter is an object which will be made available to each step
function.  This object is referred to as the **root data object** below.

The `steps` parameter is an array of step functions to run.

The difference between the two functions is:

* `series()` will run the step functions as a series, not running the next step
  function till the previous one has completed.

* `parallel()` will run the step functions in parallel.

Both functions return a `steps` object, described below.


`steps` objects
---------------------------------------

All methods but `run()` return the `steps` object, for chaining.

**`add (step)`**

Adds an additional step function to the existing set of steps.

**`series (steps)`**

Add an array of steps to run as an atomic step, running those steps in series.

**`parallel (steps)`**

Add an array of steps to run as an atomic step, running those steps in parallel.

**`bind (self)`**

Set the object which is bound to the step functions, to the specified
object.  The default bound object is the root data object.

**`run (cb)`**

Starts running the steps.  After calling this method, no other methods can
be run.

The `cb` parameter will be passed the root data object, and `this` will be
set to the root data object, or the object passed to `bind()`, if it was called.


step function environment
---------------------------------------

When step functions are invoked, they are passed a `stepContext` object as the
only argument,  described below.  `this` will be set to either the root data
object, or if the object passed to `bind()`, if it was called.

A step function must eventually call the `done()` or `stop()` functions of the
`stepContext` argument, or the complete set of steps will never complete.


`stepContext` objects
---------------------------------------

These objects have the following shape:

**`data`** - the root data object

**`done()`** - a function to call when the step is complete

**`stop()`** - a function to call for a `series()` type of steps object, to
stop calling further steps


installation
================================================================================

clone git repo for now


contributing
================================================================================

This project is hosted at GitHub: <https://github.com/pmuellr/steps>

To submit a bug report, please create an [issue][].

[issue]: https://github.com/pmuellr/steps/issues

If you'd like to contribute code to this project, please read the
[CONTRIBUTING.md](CONTRIBUTING.md) document.


Authors and Contributors
================================================================================

<table><tbody>
  <tr>
    <th align="left">Patrick Mueller</th>
    <td><a href="https://github.com/pmuellr">GitHub/pmuellr</a></td>
    <td><a href="https://twitter.com/pmuellr">Twitter/@pmuellr</a></td>
  </tr>
</tbody></table>


License & Copyright
================================================================================

Copyright (c) 2016 Patrick Mueller and licensed under the MIT license.
See the included [LICENSE.md](LICENSE.md) file for more details.
