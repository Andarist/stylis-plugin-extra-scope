export default function extraScopePlugin(extra) {
  const scope = `${extra.trim()} `

  return (context, content, selectors, parents, line, column, length, type) => {
    if (context !== 2 || type === 107) return

    for (let i = 0; i < selectors.length; i++) {
      selectors[i] = `${scope}${selectors[i]}`
    }
  }
}
