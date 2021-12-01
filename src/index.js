export default function createExtraScopePlugin(...extra) {
  const scopes = extra.map((scope) => `${scope.trim()} `)

  return (element) => {
    if (element.type !== 'rule') {
      return
    }

    if (element.root?.type === '@keyframes') {
      return
    }

    if (
      !element.parent ||
      (element.props.length === 1 && element.value.charCodeAt(0) !== 58) ||
      !element.length
    ) {
      element.props = element.props
        .map((prop) => scopes.map((scope) => scope + prop))
        .reduce((scopesArray, scope) => scopesArray.concat(scope), [])
    }
  }
}
