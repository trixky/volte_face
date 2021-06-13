<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";
    import { get_score } from "../logic/score"

    let po = false;

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 1000),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 1000,
                easing: quintOut,
                css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
            };
        },
    });

    import { onDestroy } from "svelte";
    import { store_game } from "../stores/store.game";

    import Header from "../lib/header/Header.svelte";
    import Board from "../lib/gameboard/Board.svelte";

    let local_store_game;

    const unsubscribe_store_game = store_game.subscribe((value) => {
        local_store_game = value;
    });

    onDestroy(unsubscribe_store_game);

    $: [first_player_score, second_player_score] = get_score(local_store_game.pawns)
    $: local_store_game.turn === 0 && console.log("c'eeeest morrrrt")
</script>

<!-- ************************************** CONTENT -->
<header class="center">
    <Header />
</header>

<main class="center">
    <div id="player-infos-container">
        <div class="player-infos">
            {#if local_store_game.turn === 1}
                <div
                    in:receive|local={{ key: "todo.id" }}
                    out:send|local={{ key: "todo.id" }}
                />
            {/if}
            <p>player &nbsp;1&nbsp; (white)</p>
            <p>{first_player_score} &nbsp;pawns</p>
        </div>
        <div class="player-infos">
            {#if local_store_game.turn === 2}
                <div
                    in:receive|local={{ key: "todo.id" }}
                    out:send|local={{ key: "todo.id" }}
                />
            {/if}
            <p>player &nbsp;2&nbsp; (black)</p>
            <p>{second_player_score} &nbsp;pawns</p>
        </div>
    </div>
    <Board />
</main>
<footer class="center">
    <p>ceci est le footer</p>
</footer>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #player-infos-container {
        margin-bottom: 20px;
    }

    .player-infos {
        position: relative;
        display: inline-block;
        text-align: center;
    }

    .player-infos > p {
        text-align: center;
        margin: 3px 0;
    }

    .player-infos:first-child {
        margin-right: 25px;
    }

    .player-infos:last-child {
        margin-left: 25px;
    }

    .player-infos > div {
        position: absolute;
        top: -8px;
        left: -10px;
        height: calc(100% + 12px);
        width: calc(100% + 20px);
        z-index: -1;
        background-color: #eee;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
</style>
