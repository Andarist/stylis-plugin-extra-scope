/**
 * @jest-environment jsdom
 */

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { render } from '@testing-library/react'
import prettier from 'prettier'
import React, { useState } from 'react'
import stylisExtraScope from '..'

const formatCss = (css) => prettier.format(css, { parser: 'css' })
const getAllEmotionStyles = () =>
  formatCss(
    [].slice
      .call(document.querySelectorAll('[data-emotion]'))
      .map((style) => style.textContent)
      .join('\n'),
  )

const TestCacheProvider = ({ children }) => {
  const [emotionCache] = useState(() => {
    return createCache({
      key: 'extra-scope',
      stylisPlugins: [stylisExtraScope('#extraScopeContainer.extraScope')],
    })
  })

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>
}

describe('StylisExtraScope with Emotion', () => {
  beforeEach(() => {
    document.querySelector('head').innerHTML = ''
    document.querySelector('body').innerHTML = ''
  })

  it('should handle simple input', () => {
    const Comp1 = styled.div({ fontSize: '10px' })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-9c7r58 {
        font-size: 10px;
      }
      "
    `)
  })

  it('should handle nested input', () => {
    const Comp1 = styled.div({ color: 'red' })
    const Comp2 = styled.div({ color: 'blue' })

    render(
      <TestCacheProvider>
        <Comp1>
          <Comp2 />
        </Comp1>
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-tokvmb {
        color: red;
      }
      #extraScopeContainer.extraScope .extra-scope-14ksm7b {
        color: blue;
      }
      "
    `)
  })

  it('should handle @at-rules correctly', () => {
    const Comp1 = styled.div({
      color: 'blue',
      '@media': { fontSize: '1rem' },
      '@media (min-width: 768px)': { fontSize: '2rem' },
      '@keyframes': {
        '0%': {
          color: 'red',
        },
      },
    })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-2zs2u8 {
        color: blue;
      }
      @media {
        #extraScopeContainer.extraScope .extra-scope-2zs2u8 {
          font-size: 1rem;
        }
      }
      @media (min-width: 768px) {
        #extraScopeContainer.extraScope .extra-scope-2zs2u8 {
          font-size: 2rem;
        }
      }
      @keyframes {
        0% {
          color: red;
        }
      }
      "
    `)
  })

  it('should handle comma-separated selectors', () => {
    const Comp1 = styled.div({ color: 'blue', 'div, h1': { fontSize: '2rem' } })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-11ysuls {
        color: blue;
      }
      #extraScopeContainer.extraScope .extra-scope-11ysuls div,
      #extraScopeContainer.extraScope .extra-scope-11ysuls h1 {
        font-size: 2rem;
      }
      "
    `)
  })

  it('should handle parent selectors', () => {
    const Comp1 = styled.div({ color: 'red' })
    const Comp2 = styled.div({ '&&': { color: 'blue' } })

    render(
      <TestCacheProvider>
        <Comp1>
          <Comp2 />
        </Comp1>
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-tokvmb {
        color: red;
      }
      #extraScopeContainer.extraScope .extra-scope-rngag0 {
      }
      #extraScopeContainer.extraScope .extra-scope-rngag0.extra-scope-rngag0 {
        color: blue;
      }
      "
    `)
  })

  it('should handle sibling selectors', () => {
    const Comp1 = styled.div({
      'div ~ div': { ':focus': { color: 'blue' } },
      '& ~ div': { fontSize: '1rem' },
      'div + div': { margin: '10px' },
      '& + div': { ':after': { color: 'red' } },
    })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-1jdbxgg {
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg div ~ div {
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg div ~ div:focus {
        color: blue;
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg ~ div {
        font-size: 1rem;
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg div + div {
        margin: 10px;
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg + div {
      }
      #extraScopeContainer.extraScope .extra-scope-1jdbxgg + div:after {
        color: red;
      }
      "
    `)
  })

  it('should handle child selectors', () => {
    const Comp1 = styled.div({
      '> .some-child-class': { ':focus': { color: 'blue' } },
      '& > .some-child-class': { fontSize: '1rem' },
      'div > .some-other-class': { margin: '10px' },
      '.some-parent-class > &': { ':after': { color: 'red' } },
    })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-1tlzw6p {
      }
      #extraScopeContainer.extraScope .extra-scope-1tlzw6p > .some-child-class {
      }
      #extraScopeContainer.extraScope .extra-scope-1tlzw6p > .some-child-class:focus {
        color: blue;
      }
      #extraScopeContainer.extraScope .extra-scope-1tlzw6p > .some-child-class {
        font-size: 1rem;
      }
      #extraScopeContainer.extraScope .extra-scope-1tlzw6p div > .some-other-class {
        margin: 10px;
      }
      #extraScopeContainer.extraScope .some-parent-class > .extra-scope-1tlzw6p {
      }
      #extraScopeContainer.extraScope
        .some-parent-class
        > .extra-scope-1tlzw6p:after {
        color: red;
      }
      "
    `)
  })

  it('should handle complicated child selectors', () => {
    const Comp1 = styled.div({
      '.class-one:focus ~ &, .class-two:focus > &': { outlineColor: 'red' },
    })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-r30tj0 {
      }
      #extraScopeContainer.extraScope .class-one:focus ~ .extra-scope-r30tj0,
      #extraScopeContainer.extraScope .class-two:focus > .extra-scope-r30tj0 {
        outline-color: red;
      }
      "
    `)
  })

  it('should add single extra scope correctly for a rule declared after at rule', () => {
    const Comp1 = styled.div({
      '@media': { fontSize: '1rem' },
      color: 'blue',
    })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(getAllEmotionStyles()).toMatchInlineSnapshot(`
      "#extraScopeContainer.extraScope .extra-scope-t26pys {
        color: blue;
      }
      @media {
        #extraScopeContainer.extraScope .extra-scope-t26pys {
          font-size: 1rem;
        }
      }
      "
    `)
  })
})
