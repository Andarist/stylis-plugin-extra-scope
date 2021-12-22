/**
 * @jest-environment jsdom
 */

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { render } from '@testing-library/react'
import React, { useState } from 'react'
import stylisExtraScope from '..'

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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
  })

  it('should handle comma-separated selectors', () => {
    const Comp1 = styled.div({ color: 'blue', 'div, h1': { fontSize: '2rem' } })

    render(
      <TestCacheProvider>
        <Comp1 />
      </TestCacheProvider>,
    )

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
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

    expect(document.documentElement).toMatchSnapshot()
  })
})
