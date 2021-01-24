export default function createExtraScopePlugin(...extra) {
  const scopes = extra.map(scope => scope.trim())

  const extraScopePlugin = (
    context,
    content,
    selectors,
    parents,
    line,
    column,
    length,
    type,
  ) => {
    if (context !== -1) {
      return
    }

    const selector = selectors[0]
    selectors[0] = `${scopes[0]} ${selector}`

    for (let i = 1; i < scopes.length; i++) {
      selectors.push(`${scopes[i]} ${selector}`)
    }
  }

  return extraScopePlugin
}
