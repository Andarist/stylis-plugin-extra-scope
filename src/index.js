export default function createExtraScopePlugin(...scopes) {
  scopes = scopes.map(scope => `${scope.trim()} `)

  return element => {
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
      element.props = element.props.flatMap(prop =>
        scopes.map(scope => scope + prop),
      )
    }
  }
}
