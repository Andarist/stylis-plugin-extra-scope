export default function createExtraScopePlugin(...scopes) {
  scopes = scopes.map(scope => `${scope.trim()} `)

  return element => {
    if (element.type !== 'rule') {
      return
    }

    if (element.root?.type === '@keyframes') {
      return
    }

    element.props = element.props.flatMap(prop =>
      scopes.map(scope => `${scope} ${prop}`),
    )
  }
}
