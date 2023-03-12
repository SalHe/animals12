<script setup lang="ts">
import { chessName } from '@/chess';
import { playerLetty, playerSalHe, useRestartableBoard } from '@/compose/game';
import { ref } from 'vue';
import BoardCell from './BoardCell.vue';

const colors: any = {
    [playerSalHe]: "#3498db",
    [playerLetty]: "#e74c3c"
};
const gameOver = ref(false);
const gameWinner = ref<string | undefined>(undefined);
const [cells, turn, clickCell, restart] = useRestartableBoard((winner) => {
    gameOver.value = true;
    gameWinner.value = winner;
});

const restartGame = () => {
    gameOver.value = false;
    gameWinner.value = undefined;
    restart();
};
</script>

<template>
    <div class="board">
        <template v-for="c in cells" :key="c">
            <BoardCell :cell="c" :player-colors="colors" :chess-name="chessName" @click-cell="clickCell" />
        </template>
    </div>
    <div v-if="!gameOver">
        轮到：<span :style="{ color: turn ? colors[turn]:'inherit' }">{{ !turn ? "<请翻棋起手>" : turn }}</span>
    </div>
    <div v-else-if="gameWinner">
        赢家：<span :style="{ color: colors[gameWinner] }">{{ gameWinner }}</span>
    </div>
    <div v-else>
        平局
    </div>
    <a @click="restartGame">Restart</a>
</template>

<style scoped>
.board {
    display: grid;
    height: 560px;
    width: 400px;
    grid-template-rows: repeat(7, 14.2%);
    grid-template-columns: repeat(4, 25%);
}
</style>