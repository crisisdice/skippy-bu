import {
  textQuestion,
  listQuestion,
  resetTitle,
  spinner,
} from '../elements'

import {
  t,
} from '../i8n'

import {
  Login,
  Register
} from '../types'

import {
  Action
} from './actions'

function authFail(isLogin: boolean, spinner: any) {
  resetTitle()
  spinner.error({ text:
    `${
      isLogin
        ? t.loggingIn
        : t.registration 
    }${
      t.failPrompt
    }`
  })
}

async function credentialPrompts(isLogin: boolean) {
  const email = await textQuestion(t.emailPrompt)
  const password = await textQuestion(t.passwordPrompt)
  const nickname = isLogin
    ? undefined
    : (
      await textQuestion(t.nicknamePrompt)
    )
  return { email, password, nickname }
}

export async function authorization(login: Login, register: Register) {
  await resetTitle()
  while(true) {
    const isLogin = (
      await listQuestion(t.loginPrompt, [
        { name: t.login, value: Action.LOGIN },
        { name: t.register, value: Action.REGISTER},
      ])
    ) === Action.LOGIN
    const credentials = await credentialPrompts(isLogin)
    const spin = spinner()
    const token = await (
      isLogin 
        ? login(credentials)
        : register(credentials)
    )
    if (!token) {
      authFail(isLogin, spin)
      continue
    }
    spin.success({ text: t.welcome })
    await textQuestion(t.youSay)
    return token
  }
}

