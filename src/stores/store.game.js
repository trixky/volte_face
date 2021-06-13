import { writable } from 'svelte/store';
import { next_board } from '../logic/next_board'

function createGameStore() {
    return writable({
        turn: 1,
        pawns: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 2, 0, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0, 0],
            [0, 2, 1, 2, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]
    });
}

export const store_game = createGameStore();