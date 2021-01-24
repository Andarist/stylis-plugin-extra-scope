import Stylis from 'stylis'
import prettier from 'prettier'

import extraScopePlugin from '../src'

const formatCss = css => prettier.format(css, { parser: 'css' })

test('simple input', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    background-color: rebeccapurple;
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
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

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope div {
      background-color: rebeccapurple;
    }
    "
  `)
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

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class div {
      background-color: rebeccapurple;
    }
    #my-scope .some-class div span {
      font-size: 14px;
    }
    #my-scope .some-class .other-class {
      margin: 20px;
    }
    "
  `)
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

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
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

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .other-class div .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
})

test('handles @at-rules correctly', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    div, h1 {
      span {
        font-size: 14px;
      }
      background-color: rebeccapurple;
    }

    @media {
      .other-class {
        margin: 20px;
      }
    }

    @keyframe {
      0%: {
        color: red;
      }
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class div,
    #my-scope .some-class h1 {
      background-color: rebeccapurple;
    }
    #my-scope .some-class div span,
    #my-scope .some-class h1 span {
      font-size: 14px;
    }
    @media {
      #my-scope .some-class .other-class {
        margin: 20px;
      }
    }
    @-webkit-keyframe -some-class {
      0%: {
        color: red;
      }
    }
    @keyframe -some-class {
      0%: {
        color: red;
      }
    }
    "
  `)
})

test('handles @at-rules correctly 2', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    div {
      background-color: rebeccapurple;
    }

    @media {
      .other-class {
        margin: 20px;
      }
    }

    @keyframe {
      0%: {
        color: red;
      }
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class div {
      background-color: rebeccapurple;
    }
    @media {
      #my-scope .some-class .other-class {
        margin: 20px;
      }
    }
    @-webkit-keyframe -some-class {
      0%: {
        color: red;
      }
    }
    @keyframe -some-class {
      0%: {
        color: red;
      }
    }
    "
  `)
})

test('comma-separated selectors', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    div, h1 {
      span {
        font-size: 14px;
      }
      background-color: rebeccapurple;
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class div,
    #my-scope .some-class h1 {
      background-color: rebeccapurple;
    }
    #my-scope .some-class div span,
    #my-scope .some-class h1 span {
      font-size: 14px;
    }
    "
  `)
})

test('should add single extra scope correctly for same-level rules', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    min-width: 12rem;

    @media (min-width: 768px) {
      margin: 0 20px 0 0;
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      min-width: 12rem;
    }
    @media (min-width: 768px) {
      #my-scope .some-class {
        margin: 0 20px 0 0;
      }
    }
    "
  `)
})

test('multiple extra scopes', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope', '#my-second-scope'))

  const actual = stylis(
    '.some-class',
    `
    background-color: rebeccapurple;

    div {
      color: hotpink;
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class,
    #my-second-scope .some-class {
      background-color: rebeccapurple;
    }
    #my-scope .some-class div,
    #my-second-scope .some-class div {
      color: hotpink;
    }
    "
  `)
})

test('should add single extra scope correctly for a rule declared after at rule', () => {
  const stylis = new Stylis()
  stylis.use(extraScopePlugin('#my-scope'))

  const actual = stylis(
    '.some-class',
    `
    min-width: 12rem;

    @media (min-width: 768px) {
      margin: 0 20px 0 0;
    }

    div {
      background-color: rebeccapurple;

      &:focus {
        border: 1px solid blue;
      }
    }
  `,
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      min-width: 12rem;
    }
    @media (min-width: 768px) {
      #my-scope .some-class {
        margin: 0 20px 0 0;
      }
    }
    #my-scope .some-class div {
      background-color: rebeccapurple;
    }
    #my-scope .some-class div:focus {
      border: 1px solid blue;
    }
    "
  `)
})
