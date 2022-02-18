export const t = {
  oneMoment: 'One moment please...',
  actionPrompt: 'What you you like to do?',
  join: 'Join a game',
  create: 'Create a game',
  choose: 'Choose a game',
  loginPrompt: 'Login or Register',
  login: 'Login',
  loggingIn: 'Logging in',
  register: 'Register',
  registration: 'Registration',
  emailPrompt: 'What is your email?',
  passwordPrompt: 'What is your password?',
  nicknamePrompt: 'What is your nickname?',
  failPrompt: ' failed. Please try again.',
  welcome: 'Welcome!',
  youSay: 'You say:',
  noGameFound: 'No games found',
}

export const g = {
  hand: 'Hand',
  discard: 'Discard',
  stock: 'Stock',
  won: 'Congratulations!',
  lost: 'Better luck next time!',
  start: 'Start the game?',
  ok: 'OK',
  play: 'Play a card',
  discardAndEnd: 'Discard a card and end turn',
  choosePlay: '',
  chooseDiscard: 'Choose a card to discard',
  choosePile: 'Choose a pile',
  sharedPiles: 'Shared piles',
  yourPiles: 'Your piles',
  handCards: 'Hand cards',
}

export const greeting = (name: string, turn: boolean, started: boolean) => {
  return started
    ? `   Hello ${ name }, it is${ turn ? '' : ' not' } your turn.`
    : `Hello and welcome, ${ name }.`
}

