// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import moveFieldState from './moveFieldState'
import { escapeRegexTokens } from './utils'

const TMP: string = 'tmp'

const duplicate: Mutator<any> = (
  [name, index]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const a = copy[index]
    copy.splice(index+1, 0, a) //insert directly after the copied element
    return copy
  })

  const backup = { ...state.fields }

  // now we have increment any higher indexes
  const pattern = new RegExp(`^${escapeRegexTokens(name)}\\[(\\d+)\\](.*)`)

  // we need to increment high indices first so
  // lower indices won't overlap
  Object.keys(state.fields)
    .sort()
    .reverse()
    .forEach(key => {
      const tokens = pattern.exec(key)
      if (tokens) {
        const fieldIndex = Number(tokens[1])
        if (fieldIndex >= index) {
          // inc index one higher
          const incrementedKey = `${name}[${fieldIndex + 1}]${tokens[2]}`
          moveFieldState(state, backup[key], incrementedKey)
        }
      }
    })
}

export default duplicate
