<script setup lang="ts">
import { chessName } from '@/chess'
import { playerLetty, playerSalHe, useRestartableGame } from '@/compose/game'
import { ref } from 'vue'
import BoardCell from './BoardCell.vue'
import GameIntroduction from './GameIntroduction.vue';

const colors: any = {
  [playerSalHe]: '#3498db',
  [playerLetty]: '#e74c3c'
}
const gameOver = ref(false)
const gameWinner = ref<string | undefined>(undefined)
const [cells, turn, clickCell, restart] = useRestartableGame((winner) => {
  gameOver.value = true
  gameWinner.value = winner
})

const restartGame = () => {
  gameOver.value = false
  gameWinner.value = undefined
  restart()
}
</script>

<template>
  <div class="board-container">
    <div class="board">
      <template v-for="c in cells" :key="c">
        <BoardCell :cell="c" :player-colors="colors" :chess-name="chessName" @click-cell="clickCell" />
      </template>
    </div>

    <div style="align-self: center">
      <div v-if="!gameOver">
        轮到：<span :style="{ color: turn ? colors[turn] : 'inherit' }">{{
          !turn ? '<请翻棋起手>' : turn
        }}</span>
      </div>
      <div v-else-if="gameWinner">
        赢家：<span :style="{ color: colors[gameWinner] }">{{ gameWinner }}</span>
      </div>
      <div v-else>平局</div>
      <a @click="restartGame">Restart</a>
    </div>

    <GameIntroduction />
  </div>
</template>

<style scoped>
.board-container {
  display: flex;
  flex-direction: column;
  padding: 30px 10px;
}

.board {
  align-self: center;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 420px;
  max-width: 400px;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(4, 1fr);
}
</style>
