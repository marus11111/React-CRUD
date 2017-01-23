//sets errors to be displayed by User component

export default (error) => {
  return {
    type: 'VARIOUS_ERRORS',
    error
  }
}
