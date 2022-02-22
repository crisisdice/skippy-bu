export type Token = {
  key: string
  iat: number,
  exp: number,
  iss: string
}

export type Credentials = {
  email: string
  password: string
  nickname: string
}

