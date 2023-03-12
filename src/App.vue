<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <div class="game-container">
    <div class="game">
      <GameBoard />
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
}

.game {
  grid-column: 2 / span 22;
}
</style>
