export const Dragon = 0
export const Kirin = 1
export const Lion = 2
export const Elephant = 3
export const Tiger = 4
export const Leopard = 5
export const Wolf = 6
export const Dog = 7
export const Fox = 8
export const Cat = 9
export const Mouse = 10
export const Chicken = 11

export type CellType = 'normal' | 'bank' | 'river'

export interface Cell {
  x: number
  y: number
  opened: boolean
  selected: boolean
  cellType: CellType
  chess?: Chess
}

export interface Chess {
  id: number
  player: string
}

export const chessName: ReadonlyMap<number, string> = new Map([
  [Dragon, '一龙🐉'],
  [Kirin, '二麒麟🦄'], // emoji没有麒麟
  [Lion, '三狮🦁'],
  [Elephant, '四象🐘'],
  [Tiger, '五虎🐅'],
  [Leopard, '六豹🐆'],
  [Wolf, '七狼🐺'],
  [Dog, '八狗🐕'],
  [Fox, '九狸🦊'],
  [Cat, '十猫🐱'],
  [Mouse, '十一鼠🐀'],
  [Chicken, '十二金鸡🐔']
])

export function canAttack(a: number, b: number): boolean {
  if (a === Dragon && b === Chicken) {
    return false
  }
  return a < b || (a === Chicken && b === Dragon)
}

export function canGoto(cell1: Cell, cell2: Cell, bankOccupier?: string): boolean {
  if (
    false ||
    // 豹子仅在堵岸的情况可以下河（炸岸）
    (cell2.cellType === 'river' && cell1.chess?.id === Leopard && !bankOccupier) ||
    // 龙、象之外的动物不允许下河
    (cell2.cellType === 'river' &&
      cell1.chess?.id !== Dragon &&
      cell1.chess?.id !== Elephant &&
      cell1.chess?.id !== Leopard) ||
    // 河里不能游动
    (cell1.cellType === 'river' && cell2.cellType === 'river') ||
    // 如果对方已堵岸，则不能从河里上陆地
    (cell1.cellType === 'river' &&
      cell2.cellType === 'normal' &&
      bankOccupier &&
      cell1.chess?.player !== bankOccupier) ||

    // 不能吃河里的棋子
    (cell2.cellType === 'river' && cell2.chess && cell2.chess.player !== cell1.chess?.player)
  )
    return false

  if (
    // 金鸡逻辑
    cell1.chess?.id === Chicken &&
    // 金鸡可以任意飞，但是对方堵岸时只能在所在陆地区域飞行，不得飞向另一片陆地区域
    (!bankOccupier || cell1.chess.player === bankOccupier || cell1.y < 3 === cell2.y < 3)
  ) {
    return true
  }

  // 对方堵岸后，不得占领岸
  if (cell2.cellType === 'bank' && bankOccupier && cell1.chess?.player != bankOccupier) {
    return false
  }

  // 是否走相邻一个
  const dx = cell1.x - cell2.x
  const dy = cell1.y - cell2.y

  if (
    (cell2.cellType === 'river' || cell1.cellType === 'river') &&
    Math.abs(dy) === 1 &&
    (cell2.x === 1 || cell2.x === 2) &&
    (cell1.x === 1 || cell1.x === 2)
  )
    return true

  return Math.abs(dy) + Math.abs(dx) === 1
}
