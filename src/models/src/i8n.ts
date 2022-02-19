export const g = {
  actionPrompt: 'What you you like to do?',
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

