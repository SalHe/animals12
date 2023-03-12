<script setup lang="ts">
import type { Cell } from '@/chess';

defineProps<{
    cell: Cell,
    chessName: ReadonlyMap<number, string>,
    playerColors: { [key in string]: string },
}>();

const emit = defineEmits<{
    (e: "clickCell", cell: Cell): void
}>();

</script>

<template>
    <div class="cell" :class="{
        'cell-river': cell.cellType === 'river' && !cell.selected,
        'cell-selected': cell.selected,
    }" @click="emit('clickCell', cell)">
        <div v-if="cell.chess">
            <div v-if="cell.opened" :style="{ color: playerColors[cell.chess.player] }">
                {{ chessName.get(cell.chess.id) }}
            </div>
            <div v-else>？</div>
        </div>
        <div v-else-if="cell.cellType === 'bank'" class="cell-bank">
            岸
        </div>
    </div>
</template>

<style scoped>
.cell {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed cyan;
    border-radius: 10px;
    margin: 5px;
}

.cell:hover {
    cursor: pointer;
}

.cell-selected {
    background-color: rgba(236, 240, 241, 0.2);
}

.cell-bank {}

.cell-river {
    background-color: rgba(52, 152, 219, 0.1);
}
</style>