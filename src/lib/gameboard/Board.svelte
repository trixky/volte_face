<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Case from "./Case.svelte";
    import { next_board } from "../../logic/next_board";
    import { store_game } from "../../stores/store.game";
    import { get_score } from "../../logic/score";
    import { store_settings } from "../../stores/store.settings";
    import { const_game } from "../../constants/const.game";

    let sound_move = null;
    let sound_menu_selection = null;

    onMount(() => {
        sound_move = new Audio("/move.mp3");
        sound_menu_selection = new Audio("/menu_selection.mp3");
    });

    function play_move_sound() {
        if ($store_settings.sounds) {
            setTimeout(() => {
                const new_sound = sound_move.cloneNode(true);
                new_sound.volume = $store_settings.volume / 100;
                new_sound.play();
            }, Math.random() * 50);
        }
        return true;
    }

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



    let local_store_game;

    let button_description = "";

    function handleClickTrigger(x, y) {
        if (local_store_game.turn) {
            const [new_pawns, new_turn, board_changed] = next_board(
                local_store_game.pawns,
                local_store_game.turn,
                x,
                y
            );
            store_game.update((n) => ({ ...n, pawns: new_pawns }));
            store_game.update((n) => ({ ...n, turn: new_turn }));

            if (board_changed) {
                play_move_sound();
            }
        }
    }

    const unsubscribe_store_game = store_game.subscribe((value) => {
        local_store_game = value;
    });

    $: [first_player_score, second_player_score] = get_score(
        local_store_game.pawns
    );
    $: gamer_over_title =
        first_player_score === second_player_score
            ? `equality !<br/>${first_player_score} - ${second_player_score}`
            : first_player_score > second_player_score
            ? `player &nbsp;1&nbsp; (white)<br />win !<br /><br />${first_player_score} - ${second_player_score}`
            : `player &nbsp;2&nbsp; (black)<br />win !<br /><br />${second_player_score} - ${first_player_score}`;

    onDestroy(unsubscribe_store_game);
</script>

<!-- ************************************** CONTENT -->
<div id="board-container">
    {#if !local_store_game.turn}
        <h2
            id="gamer-over-title"
            class:gamer-over-title-white={first_player_score >
                second_player_score}
            class:gamer-over-title-black={first_player_score >
                second_player_score}
            transition:fade|local={{ duration: 500 }}
        >
            {@html gamer_over_title}
        </h2>
    {/if}
    <div
        id="board"
        class:board-disabled={!local_store_game.turn}
        class:theme-blue={$store_settings.theme === const_game.themes.blue}
        class:theme-green={$store_settings.theme === const_game.themes.green}
        class:theme-red={$store_settings.theme === const_game.themes.red}
    >
        {#each local_store_game.pawns as line, y}
            <div class="board-line">
                {#each line as value, x}
                    <Case
                        {value}
                        clickTrigger={(_) => handleClickTrigger(x, y)}
                        borders={[y != 0, x != 7, y != 7, x != 0]}
                    />
                {/each}
            </div>
        {/each}
    </div>
    <div id="board-buttons-container">
        <button
            on:click={() => play_menu_selection_sound() && store_game.restart()}
            on:mouseenter={() => (button_description = "restart the game")}
            on:mouseleave={() => (button_description = "")}
        >
            <img
                id="refresh-icon"
                src="/regresh.svg"
                alt="refresh icon"
                width="37px"
            />
        </button>
        {#if local_store_game.mode != 1}
            <button
                on:click={play_menu_selection_sound}
                on:mouseenter={() =>
                    (button_description = "human &nbsp;vs&nbsp; human")}
                on:mouseleave={() => (button_description = "")}
            >
                <img
                    id="multiplayer-icon"
                    src="/two_players.png"
                    alt="multiplayer icon"
                    width="37px"
                />
            </button>
        {:else}
            <button
                on:click={play_menu_selection_sound}
                on:mouseenter={() =>
                    (button_description = "human &nbsp;vs&nbsp; bot")}
                on:mouseleave={() => (button_description = "")}
            >
                <img id="bot-icon" src="/cpu.png" alt="bot icon" width="30px" />
            </button>
        {/if}
        {#if button_description}
            <p transition:fade|local={{ duration: 300 }}>
                {@html button_description}
            </p>
        {/if}
    </div>
</div>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #board-container {
        position: relative;
    }

    #board {
        position: relative;
        display: inline-block;
        margin: 15px 0;
        transition: opacity 2s;

        border: solid;
        border-width: 10px;
    }

    #board.theme-blue {
        border-color: rgb(181, 244, 255);
    }

    #board.theme-green {
        border-color: rgb(203, 255, 210);
    }

    #board.theme-red {
        border-color: rgb(255, 202, 202);
    }

    .board-disabled {
        opacity: 0.05;
    }

    #gamer-over-title {
        z-index: 10;
        position: absolute;
        top: 100px;
        left: 0;
        right: 0;
    }

    .gamer-over-title-white {
        color: white;
        font-size: 30px;
        -webkit-text-stroke: 1px black;
    }

    .board-line {
        display: block;
        padding: 0;
        margin: 0;
    }

    #board-buttons-container {
        height: 100px;
    }

    #board-buttons-container > button {
        margin: 3px 10px;
    }

    #board-buttons-container > button {
        background-color: #e9e9e9;
        border: none;
        width: 55px;
        height: 55px;
        transition: transform 0.2s;
    }

    #board-buttons-container > button:active {
        background-color: #ccc;
    }

    #board-buttons-container > button > img {
        transition: transform 0.4s;
    }

    #board-buttons-container > button:first-child:hover > img {
        transform: rotate(180deg);
    }

    #board-buttons-container > button:nth-child(2):hover > img {
        transform: matrix(-1, 0, 0, 1, 0, 0);
    }

    img {
        vertical-align: middle;
    }
</style>
