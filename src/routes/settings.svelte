<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy } from "svelte";
    import Header from "../lib/header/Header.svelte";
    import { store_settings } from "../stores/store.settings";
    import { const_game } from "../constants/const.game";
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
                store_settings.update_first_player(
                    const_game.players.first_player
                )}
            class:option-selected={$store_settings.first_player_to_play ===
                const_game.players.first_player}><p>white</p></button
        >
        <button
            on:click={() =>
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
                store_settings.update_theme(const_game.themes.green)}
            id="option-green"
            class:option-selected={$store_settings.theme ===
                const_game.themes.green}><p>green</p></button
        >
        <button
            on:click={() => store_settings.update_theme(const_game.themes.blue)}
            id="option-blue"
            class:option-selected={$store_settings.theme ===
                const_game.themes.blue}><p>blue</p></button
        >
        <button
            on:click={() => store_settings.update_theme(const_game.themes.red)}
            id="option-red"
            class:option-selected={$store_settings.theme ===
                const_game.themes.red}><p>red</p></button
        >
    </div>
    <p>sounds</p>
    <div class="options-line">
        <button
            on:click={() => store_settings.update_sounds(const_game.sounds.on)}
            class:option-selected={$store_settings.sounds ===
                const_game.sounds.on}><p>on</p></button
        >
        <button
            on:click={() => store_settings.update_sounds(const_game.sounds.off)}
            class:option-selected={$store_settings.sounds ===
                const_game.sounds.off}><p>off</p></button
        >
    </div>
    <p>bot difficulty</p>
    <div class="options-line">
        <button
            on:click={() =>
                store_settings.update_bot_difficulty(
                    const_game.bot_difficulty.easy
                )}
            class:option-selected={$store_settings.bot_difficulty ===
                const_game.bot_difficulty.easy}><p>easy</p></button
        >
        <button
            on:click={() =>
                store_settings.update_bot_difficulty(
                    const_game.bot_difficulty.medium
                )}
            class:option-selected={$store_settings.bot_difficulty ===
                const_game.bot_difficulty.medium}><p>medium</p></button>
        <button
        on:click={() =>
            store_settings.update_bot_difficulty(
                const_game.bot_difficulty.hard
            )}
        class:option-selected={$store_settings.bot_difficulty ===
            const_game.bot_difficulty.hard}><p>hard</p></button>
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
        background-color: #eee;
        transition: opacity .2s;
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
</style>
