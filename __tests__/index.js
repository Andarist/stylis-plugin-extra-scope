import prettier from 'prettier'
import { compile, serialize, middleware, stringify } from 'stylis'

import extraScopePlugin from '../src'

const formatCss = css => prettier.format(css, { parser: 'css' })

test('simple input', () => {
  const actual = serialize(
    compile(
      `.some-class {
        background-color: rebeccapurple;
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
})

test('nested input', () => {
  const actual = serialize(
    compile(
      `.some-class {
        div {
          span {
            font-size: 14px;
          }
          background-color: rebeccapurple;
        }

        .other-class {
          margin: 20px;
        }
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
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
  const actual = serialize(
    compile(
      `.some-class {
        background-color: rebeccapurple;
      }`,
    ),
    middleware([extraScopePlugin('  #my-scope  '), stringify]),
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
})

test('complex-ish extra scope', () => {
  const actual = serialize(
    compile(
      `.some-class {
        background-color: rebeccapurple;
      }`,
    ),
    middleware([extraScopePlugin('#my-scope .other-class div'), stringify]),
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .other-class div .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
})

test('handles @at-rules correctly', () => {
  const actual = serialize(
    compile(
      `.some-class {
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

        @keyframes {
          0%: {
            color: red;
          }
        }
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
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
    @keyframes {
      0%: {
        color: red;
      }
    }
    "
  `)
})

test('handles @at-rules correctly 2', () => {
  const actual = serialize(
    compile(
      `.some-class {
        div {
          background-color: rebeccapurple;
        }

        @media {
          .other-class {
            margin: 20px;
          }
        }

        @keyframes {
          0%: {
            color: red;
          }
        }
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
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
    @keyframes {
      0%: {
        color: red;
      }
    }
    "
  `)
})

test('comma-separated selectors', () => {
  const actual = serialize(
    compile(
      `.some-class {
        div, h1 {
          span {
            font-size: 14px;
          }
          background-color: rebeccapurple;
        }
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
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
  const actual = serialize(
    compile(
      `.some-class {
        min-width: 12rem;

        @media (min-width: 768px) {
          margin: 0 20px 0 0;
        }
      }`,
    ),
    middleware([extraScopePlugin('#my-scope'), stringify]),
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
  const actual = serialize(
    compile(
      `.some-class {
        background-color: rebeccapurple;
      }`,
    ),
    middleware([extraScopePlugin('#my-scope', '#my-second-scope'), stringify]),
  )

  expect(formatCss(actual)).toMatchInlineSnapshot(`
    "#my-scope .some-class,
    #my-second-scope .some-class {
      background-color: rebeccapurple;
    }
    "
  `)
})
