// @flow
import type { MutableState, Mutator, Tools } from 'final-form'

const duplicate: Mutator<any> = (
  [name, index]: any[],
  state: MutableState<any>,
  { changeValue }: Tools<any>
) => {
  changeValue(state, name, (array: ?(any[])): any[] => {
    const copy = [...(array || [])]
    const a = copy[index]
    return array ? [...array, a] : [a]
  })
}

export default duplicate
