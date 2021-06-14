<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onMount } from "svelte";
    import Header from "../lib/header/Header.svelte";
    import { store_settings } from "../stores/store.settings";
    import { const_game } from "../constants/const.game";

    let sound_menu_selection = null;

    onMount(() => {
        sound_menu_selection = new Audio("/menu_selection.mp3");
    });

    function play_menu_selection_sound(force_to_play = null) {
        if (
            ($store_settings.sounds || force_to_play === true) &&
            force_to_play != false
        ) {
            const new_sound = sound_menu_selection.cloneNode(true);
            new_sound.volume = $store_settings.volume / 100;
            new_sound.play();
        }
        return true;
    }
</script>

<!-- ************************************** CONTENT -->
<header class="center">
    <Header />
</header>
<main class="center">
    <p>first player to play</p>
    <div class="options-line">
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_first_player(
                    const_game.players.first_player
                )}
            class:option-selected={$store_settings.first_player_to_play ===
                const_game.players.first_player}><p>white</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_first_player(
                    const_game.players.second_player
                )}
            class:option-selected={$store_settings.first_player_to_play ===
                const_game.players.second_player}><p>black</p></button
        >
    </div>
    <p>theme</p>
    <div class="options-line">
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_theme(const_game.themes.green)}
            id="option-green"
            class:option-selected={$store_settings.theme ===
                const_game.themes.green}><p>green</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_theme(const_game.themes.blue)}
            id="option-blue"
            class:option-selected={$store_settings.theme ===
                const_game.themes.blue}><p>blue</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_theme(const_game.themes.red)}
            id="option-red"
            class:option-selected={$store_settings.theme ===
                const_game.themes.red}><p>red</p></button
        >
    </div>
    <p>sounds</p>
    <div class="options-line">
        <button
            on:click={() =>
                play_menu_selection_sound(true) &&
                store_settings.update_sounds(const_game.sounds.on)}
            class:option-selected={$store_settings.sounds ===
                const_game.sounds.on}><p>on</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound(false) &&
                store_settings.update_sounds(const_game.sounds.off)}
            class:option-selected={$store_settings.sounds ===
                const_game.sounds.off}><p>off</p></button
        >
    </div>
    <div class="options-line">
        <input
            on:click={play_menu_selection_sound}
            type="range"
            class="slider"
            min={const_game.volume.min}
            max={const_game.volume.max}
            bind:value={$store_settings.volume}
        />
    </div>
    <p>bot difficulty</p>
    <div class="options-line">
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_bot_difficulty(
                    const_game.bot_difficulty.easy
                )}
            class:option-selected={$store_settings.bot_difficulty ===
                const_game.bot_difficulty.easy}><p>easy</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_bot_difficulty(
                    const_game.bot_difficulty.medium
                )}
            class:option-selected={$store_settings.bot_difficulty ===
                const_game.bot_difficulty.medium}><p>medium</p></button
        >
        <button
            on:click={() =>
                play_menu_selection_sound() &&
                store_settings.update_bot_difficulty(
                    const_game.bot_difficulty.hard
                )}
            class:option-selected={$store_settings.bot_difficulty ===
                const_game.bot_difficulty.hard}><p>hard</p></button
        >
    </div>
</main>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    .options-line > button {
        display: inline-block;
        margin: 0 5px 10px 10px;
        padding: 0 15px;
        height: 55px;
        width: 90px;
        border: none;
        background-color: #e9e9e9;
        transition: opacity 0.2s;
    }

    #option-blue {
        background-color: rgb(179, 244, 255);
    }

    #option-green {
        background-color: rgb(179, 255, 189);
    }

    #option-red {
        background-color: rgb(255, 179, 179);
    }

    .options-line > button:not(.option-selected) {
        opacity: 0.4;
    }

    .slider {
        -webkit-appearance: none;
        width: 240px;
        height: 20px;
        /* background: #e9e9e9; */
        outline: none;
        border: solid 3px #e9e9e9;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 20px;
        background: #e9e9e9;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #e9e9e9;
        cursor: pointer;
    }
</style>
