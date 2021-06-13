<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import Case from "./Case.svelte";
    import { next_board } from "../../logic/next_board";
    import { store_game } from "../../stores/store.game";
    import { bind } from "svelte/internal";

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

    onDestroy(unsubscribe_store_game);
</script>

<!-- ************************************** CONTENT -->
<div id="board-container">
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
    #board {
        display: inline-block;
        margin: 15px auto;

        border: solid;
        border-width: 10px;
        border-color: rgb(150, 247, 250);
        background-color: black;
        transition: opacity .3s 0.4s;
    }

    .board-disabled {
        opacity: 0.4;
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
