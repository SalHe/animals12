import { type Chess, type Cell, canAttack, canGoto, Leopard, Dragon } from '@/chess'
import { ref, watchEffect, type Ref } from 'vue'

export const rows = 7
export const cols = 4
export const playerSalHe = 'SalHe'
export const playerLetty = 'Letty'

function initCells(): [Ref<Cell[]>, Cell[], Cell[]] {
  // 打乱棋子
  const initChesses = Array.from({ length: 24 })
    .map(
      (_, i): Chess => ({
        id: i % 12,
        player: i >= 12 ? playerLetty : playerSalHe
      })
    )
    .sort(() => Math.random() * 10 - 5)

  // 初始化格子并发放棋子
  const cells = ref(
    Array.from({ length: cols * rows }).map((_, i): Cell => {
      const y = Math.floor(i / cols)
      const x = i % cols
      const getChess = () => initChesses.splice(0, 1)[0]
      const chess = y != 3 ? getChess() : undefined
      const cell: Cell = {
        x,
        y,
        opened: y === 3,
        selected: false,
        chess,
        cellType: 'normal'
      }
      if (y == 3) {
        cell.cellType = x == 0 || x == 3 ? 'bank' : 'river'
      }
      return cell
    })
  )
  const banks = [cells.value[3 * cols + 0], cells.value[3 * cols + 3]]
  const rivers = [cells.value[3 * cols + 1], cells.value[3 * cols + 2]]
  return [cells, banks, rivers]
}

export function useGame(
  gameOver: (winner?: string) => void
): [Cell[], Ref<string | undefined>, (cell: Cell) => void] {
  const [cells, banks, rivers] = initCells()

  let selectedCell: Cell | undefined = undefined
  const turn = ref<string | undefined>(undefined)
  const nextTurn = () => {
    const chesses = {
      [playerLetty]: 0,
      [playerSalHe]: 0
    }
    cells.value.forEach((c) => {
      if (c.chess) {
        ;(chesses as any)[c.chess.player]++
      }
    })
    if (!chesses[playerLetty] || !chesses[playerSalHe]) {
      if (!chesses[playerLetty] && !chesses[playerSalHe]) gameOver(undefined)
      else if (!chesses[playerSalHe]) gameOver(playerLetty)
      else gameOver(playerSalHe)
    }

    if (turn.value === playerLetty) {
      turn.value = playerSalHe
    } else {
      turn.value = playerLetty
    }
  }

  const selectCell = (cell: Cell): void => {
    if (selectedCell) {
      selectedCell.selected = false
    }
    selectedCell = cell
    cell.selected = true
  }

  const unselectCell = (): void => {
    if (selectedCell) {
      selectedCell.selected = false
      selectedCell = undefined
    }
  }

  const openCell = (cell: Cell): boolean => {
    if (cell.cellType === 'normal' && !cell.opened) {
      cell.opened = true
      if (!turn.value) {
        turn.value = cell.chess!.player
      }
      nextTurn()
      unselectCell()
      return true
    }
    return false
  }

  const cellGoto = (cell: Cell) => {
    if (!selectedCell) return false
    const occupier = getBankOccupier()
    if (canGoto(selectedCell, cell, occupier)) {
      if (occupier && selectedCell.chess?.id === Leopard && cell.cellType === 'river') {
        // 六豹🐆炸岸
        cells.value.forEach((c) => {
          if (rivers.find((r) => Math.abs(r.y - c.y) <= 1) !== undefined) {
            c.chess = undefined
          }
        })
      } else if (cell.cellType === 'bank' && selectedCell.chess?.id === Dragon) {
        selectedCell.chess = undefined
      } else {
        if (selectedCell.chess && selectedCell.chess.id === cell.chess?.id) {
          selectedCell.chess = undefined
        }
        cell.chess = selectedCell.chess
        selectedCell.chess = undefined
      }
      unselectCell()
      nextTurn()
      return true
    }
    return false
  }

  const getBankOccupier = (): string | undefined => {
    const player = banks[0].chess?.player
    if (!player) {
      return undefined
    }
    for (const cell of banks) {
      if (cell.chess?.player !== player) {
        return undefined
      }
    }
    return player
  }

  const clickCell = (cell: Cell): void => {
    if (openCell(cell)) {
      return
    }

    // 未选中棋子
    if (!selectedCell) {
      if (cell.chess?.player === turn.value) {
        selectCell(cell)
        return
      }
      return
    }

    if (!selectedCell.chess) {
      // 实际上到这里，这一种情况不会发生，只是为了过静态语法检查，懒得写 !.
      return
    }

    // 目标处没有子，说明是想走过去
    if (!cell.chess) {
      cellGoto(cell)
      return
    }

    // 取消选中/选中另一个棋子 可以自残
    if (
      selectedCell === cell ||
      (cell.chess.player === turn.value &&
        (!canAttack(selectedCell.chess.id, cell.chess.id) || !canGoto(selectedCell, cell)))
    ) {
      if (cell !== selectedCell) {
        selectCell(cell)
      } else {
        unselectCell()
      }
      return
    }

    // 吃子
    if (!canGoto(selectedCell, cell, getBankOccupier())) return
    if (selectedCell.chess.id === cell.chess.id) {
      const original = selectedCell
      cellGoto(cell)
      original.chess = undefined
    } else if (canAttack(selectedCell.chess.id, cell.chess.id)) {
      cellGoto(cell)
    }
  }

  return [cells.value, turn, clickCell]
}

export function useRestartableGame(
  gameOver: (winner?: string) => void
): [Ref<Cell[]>, Ref<string | undefined>, (cell: Cell) => void, () => void] {
  const [cells, turn, clickCell] = useGame(gameOver)
  const cellsRef = ref(cells)
  const turnRef = ref<string | undefined>(turn.value)
  let stop = watchEffect(() => (turnRef.value = turn.value))
  let click = clickCell

  const restart = () => {
    const r = useGame(gameOver)
    cellsRef.value = r[0]
    stop()
    stop = watchEffect(() => (turnRef.value = r[1].value))
    click = r[2]
  }
  const newClickCell = (cell: Cell) => click(cell)
  return [cellsRef, turnRef, newClickCell, restart]
}
