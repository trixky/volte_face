import { writable, get } from "svelte/store";
import { const_game } from "../constants/const.game";
import { store_settings } from "./store.settings"

function get_initial_value() {
    return {
        mode: const_game.mode.human,
        turn: get(store_settings).first_player_to_play,
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