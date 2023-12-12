export default function createExtraScopePlugin(...extra) {
  const scopes = extra.map((scope) => `${scope.trim()} `)

  return (element) => {
    if (element.type !== 'rule') {
      return
    }

    if (element.root?.type === '@keyframes') {
      return
    }

    element.props = element.props
      .map((prop) => scopes.map((scope) => scope + prop))
      .reduce((scopesArray, scope) => scopesArray.concat(scope), [])
  }
}
