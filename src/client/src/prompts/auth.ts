import {
  LoginClient
} from '../clients'

import {
  textQuestion,
  listQuestion,
  resetTitle,
  spinner,
} from '../elements'

import {
  t,
} from '../i8n'


// TODO client validation
// TODO standardize actions
const Action = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER'
}

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

export async function authorization(client: LoginClient) {
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
        ? client.login(credentials)
        : client.register(credentials)
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

