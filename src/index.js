export default function createExtraScopePlugin(extra) {
  const scope = `${extra.trim()} `
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
    if (context !== 2 || type === 107 || seen.has(selectors)) return

    seen.add(selectors)

    for (let i = 0; i < selectors.length; i++) {
      selectors[i] = `${scope}${selectors[i]}`
    }
  }

  // stable identifier that will not be dropped by minification
  Object.defineProperty(extraScopePlugin, 'name', { value: 'extraScopePlugin' })

  return extraScopePlugin
}
