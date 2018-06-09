// TODO: would prefer using inline snapshots for those, but this feature is not yet released
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
})

test('handles @at-rules correctly', () => {
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

  expect(formatCss(actual)).toMatchSnapshot()
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

  expect(formatCss(actual)).toMatchSnapshot()
})
