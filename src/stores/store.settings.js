import { writable } from "svelte/store";
import { const_game } from "../constants/const.game";

function get_initial_value() {
    return {
        first_player_to_play: const_game.players.first_player,
        theme: const_game.themes.blue,
        theme_border: const_game.themes_border.with_border,
        sounds: const_game.sounds.on,
        volume: const_game.volume.default,
        mode: const_game.mode.bot,
        bot_difficulty: const_game.bot_difficulty.medium,
    }
}

function createGameStore() {
    const { subscribe, set, update } = writable(get_initial_value());

    return {
        subscribe,
        update,
        update_first_player: (v) => update(s => ({...s, first_player_to_play: v})),
        update_theme: (v) => update(s => ({...s, theme: v})),
        update_theme_border: (v) => update(s => ({...s, theme_border: v})),
        update_sounds: (v) => update(s => ({...s, sounds: v})),
        update_volume: (v) => update(s => ({...s, volume: v})),
        update_mode: (v) => update(s => ({...s, mode: v})),
        update_bot_difficulty: (v) => update(s => ({...s, bot_difficulty: v})),
        reset: () => set(get_initial_value()),
        set,
    };
}

export const store_settings = createGameStore();