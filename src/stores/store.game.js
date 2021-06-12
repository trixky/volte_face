import { writable } from 'svelte/store';
import { next_board } from '../logic/next_board'

function createGameStore() {
    // const { subscribe, set, update } = writable({
    const store_game = writable({
        turn: 1,
        pawns: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
    });

    // return {
    // 	subscribe,
    // 	playPawn: (x, y) => update(next_board(x, y)),
    // 	reset: () => set(0)
    // };
    return store_game;
}

export const store_game = createGameStore();