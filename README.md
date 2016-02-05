`steps` - manage a set of async function calls
================================================================================

`steps` is a library providing some structural constructs around running
coordinating the running of multiple async functions.


examples
================================================================================

Below is a sample showing running two async functions:

```js
const steps = require('steps')

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
```

Here's the example output:

  {} { n: 'p', x: 107, y: 108 }
  {} { n: 's', x: 106, y: 212 }

Here's what's going on:

* thing
* another thing

Another sample, using the function/data from above:

```js
steps.series({n: 's'})
  .add(a)
  .add(stop)
  .add(b)
  .run(obj => console.log(this, obj))

steps.parallel({n: 'p'}, [a])
  .add(b)
  .run(obj => console.log(this, obj))

function stop (sc) {
  sc.stop()
}
```

Here's the example output:

  {} { n: 's', x: 104 }
  {} { n: 'p', x: 105, y: 105 }

  * thing
  * another thing


API
================================================================================

This packageexports the following functions:

**`series()`**

**`parallel()`**


installation
================================================================================

clone git repo for now


contributing
================================================================================

This project is hosted at GitHub: <https://github.com/pmuellr/steps>
To submit a bug report, please create an [issue][].

[issue]: https://github.com/pmuellr/steps/issues

If you'd like to contribute code to this project, please read the
[CONTRIBUTING.md][CONTRIBUTING.md] document.


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
See the included [LICENSE.md][LICENSE.md] file for more details.
