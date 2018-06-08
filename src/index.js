const MIDDLE_STRING_RIGHT_CURLY_BRACE = /\}(?=.)/g

export default function extraScopePlugin(extra) {
  const scope = `${extra.trim()} `

  return (context, content) => {
    if (context !== -2) return
    return scope + content.replace(MIDDLE_STRING_RIGHT_CURLY_BRACE, `}${scope}`)
  }
}
