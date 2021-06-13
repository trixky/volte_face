import { writable } from 'svelte/store';
import { const_game } from '../constants/const.game';

function get_initial_value() {
    return {
        mode: const_game.mode.human,
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
    }
}


function createGameStore() {
    const { subscribe, set, update } = writable(get_initial_value());

    return {
		subscribe,
		update,
		restart: () => set(get_initial_value())
	};
}

export const store_game = createGameStore();