<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import Case from "./Case.svelte";
    import { next_board } from "../../logic/next_board";
    import { store_game } from "../../stores/store.game";
    import { bind } from "svelte/internal";
    import { get_score } from "../../logic/score";

    let local_store_game;
    let new_pawns;
    let new_turn;

    let button_description = "";

    $: console.log(button_description);

    function handleClickTrigger(x, y) {
        if (local_store_game.turn) {
            [new_pawns, new_turn] = next_board(
                local_store_game.pawns,
                local_store_game.turn,
                x,
                y
            );
            store_game.update((n) => ({ ...n, pawns: new_pawns }));
            store_game.update((n) => ({ ...n, turn: new_turn }));
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
            transition:fade={{ duration: 500 }}
        >
            {@html gamer_over_title}
        </h2>
    {/if}
    <div id="board" class:board-disabled={!local_store_game.turn}>
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
            on:click={store_game.restart}
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
                on:mouseenter={() =>
                    (button_description = "human &nbsp;vs&nbsp; bot")}
                on:mouseleave={() => (button_description = "")}
            >
                <img id="bot-icon" src="/cpu.png" alt="bot icon" width="30px" />
            </button>
        {/if}
        {#if button_description}
            <p transition:fade={{ duration: 300 }}>
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

        border: solid;
        border-width: 10px;
        border-color: rgb(150, 247, 250);
        transition: opacity 2s;
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
        background-color: #eee;
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
