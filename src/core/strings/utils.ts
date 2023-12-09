export const getInitials = (fullName: string, initial: boolean) => {
  const allNames = fullName.trim().split(" ")
  const initials = allNames.reduce((acc, curr, index) => {
    const addInitial = initial ? acc.length < 2 : index === 0 || index === allNames.length - 1

    if (addInitial) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`
    }
    return acc
  }, "")
  return initials
}
