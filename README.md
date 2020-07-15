# stylis-plugin-extra-scope

[Stylis](https://github.com/thysultan/stylis.js) plugin which adds extra scope to each produced CSS rule.

## Example

```js
import Stylis from 'stylis'
import extraScopePlugin from 'stylis-plugin-extra-scope'

const stylis = new Stylis()
stylis.use(extraScopePlugin('#my-scope'))

const rules = stylis(
  '.some-class',
  `
  div {
    span {
      font-size: 14px;
    }
    background-color: rebeccapurple;
  }

  .other-class {
    margin: 20px;
  }
`,
)

console.log(rules) // "#my-scope .some-class div{background-color:rebeccapurple;}#my-scope .some-class div span{font-size:14px;}#my-scope .some-class .other-class{margin:20px;}"
```

## Environment Requirements

This plugin depends on the [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) collection type for performance reasons. If you support older environments that may not provide this natively (e.g. IE11), consider including a global polyfill in your application, such as [core-js](https://github.com/zloirock/core-js).

For example, a polyfill may be added to the above example's imports like so:
```js
import 'core-js/features/weak-set'
import Stylis from 'stylis'
import extraScopePlugin from 'stylis-plugin-extra-scope'
```
