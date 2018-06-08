// TODO: would prefer using inline snapshots for those, but this feature is not yet released
import Stylis from 'stylis'

import extraScopePlugin from '../src'

test('simple input', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    background-color: rebeccapurple;
  `,
  )

  expect(actual).toMatchSnapshot()
})

test('empty stylis scope', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '',
    `
    div {
      background-color: rebeccapurple;
    }
  `,
  )

  expect(actual).toMatchSnapshot()
})

test('nested input', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
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

  expect(actual).toMatchSnapshot()
})

test('trims padded extra scope', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('  #my-scope  '))

  const actual = stylis(
    '.some-class',
    `
    background-color: rebeccapurple;
  `,
  )

  expect(actual).toMatchSnapshot()
})

test('complex-ish extra scope', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope .other-class div'))

  const actual = stylis(
    '.some-class',
    `
    background-color: rebeccapurple;
  `,
  )

  expect(actual).toMatchSnapshot()
})
