export default function createExtraScopePlugin(...extra) {
  const scopes = extra.map(scope => `${scope.trim()} `)
  const seen = new WeakSet()

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
    if (
      context !== 2 ||
      type === 107 ||
      seen.has(selectors) ||
      seen.has(parents)
    )
      return

    seen.add(selectors)

    for (let i = 0; i < selectors.length; i++) {
      selectors[i] = scopes.map(scope => `${scope}${selectors[i]}`).join(',')
    }
  }

  return extraScopePlugin
}
