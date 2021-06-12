<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";

    let po = false;

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 400),

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

    $: console.log(local_store_game.turn)
    $: console.log(local_store_game.turn === 1)
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
                    in:receive={{ key: "todo.id" }}
                    out:send={{ key: "todo.id" }}
                />
            {/if}
            <p>player &nbsp;1&nbsp; (white)</p>
            <p>x pawns</p>
        </div>
        <div class="player-infos">
            {#if local_store_game.turn === 2}
                <div
                    in:receive={{ key: "todo.id" }}
                    out:send={{ key: "todo.id" }}
                />
            {/if}
            <p>player &nbsp;2&nbsp; (black)</p>
            <p>x pawns</p>
        </div>
    </div>
    <Board />
</main>
<footer class="center">
    <p class="nimp">test</p>
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
