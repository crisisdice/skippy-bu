
export const line = '  +----------------------------------------------------------------+\n'
export const name = '  |                       1      2      3      4        stock      |\n'
export const bars = '  |                                                                |\n'
export const leftPileMargin = '  |                    '
export const rightPileMargin = '    |\n'
export const emptyTop = (withStock: boolean) =>

`+------+------+------+------+${withStock ? '   +------+' : '           '}${
  rightPileMargin}${
  leftPileMargin}|      |      |      |      |${withStock ? '   |      |': '           '}${
  rightPileMargin
}`

export const emptyBottom = (withStock: boolean) => `${
  leftPileMargin}|      |      |      |      |${withStock ? '   |      |': '           '}${
  rightPileMargin}${
  leftPileMargin}+------+------+------+------+${withStock ? '   +------+' : '           '}${
  rightPileMargin
}`
export const leftHandMargin = '  |               '
export const empty = '       ' 
export const yourHand = '  |  Your hand:   '

