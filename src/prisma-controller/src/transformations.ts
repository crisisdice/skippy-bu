
export const transformNumbers = <T extends { id?: any }>(arg: T, keys: (keyof T)[]): T => {
  return {
    ...arg,
    id: arg.id ? parseInt(arg.id) : undefined
  }
}