<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";
    import { get_score } from "../logic/score";
    import { store_game } from "../stores/store.game";
    import { store_settings } from "../stores/store.settings";
    import { const_game } from "../constants/const.game";

    import Header from "../lib/header/Header.svelte";
    import Board from "../lib/gameboard/Board.svelte";
    import { onMount } from "svelte";
    import { import_cookies } from "../logic/cookies";

    let settings_mounted = false;

    onMount(() => {
        import_cookies();
        settings_mounted = true;
    });

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

    $: [first_player_score, second_player_score] = get_score($store_game.pawns);
</script>

<!-- ************************************** CONTENT -->
<header class="center">
    <Header />
</header>

<main class="center">
    <div id="player-infos-container">
        <div class="player-infos">
            {#if $store_game.turn === 1}
                <div
                    in:receive|local={{ key: "todo.id" }}
                    out:send|local={{ key: "todo.id" }}
                />
            {/if}
            <p>
                player {@html $store_settings.mode === const_game.mode.human
                    ? "&nbsp;1"
                    : ""}&nbsp; (white)
            </p>
            <p>{first_player_score} &nbsp;pawns</p>
        </div>
        <div class="player-infos">
            {#if $store_game.turn === 2}
                <div
                    in:receive|local={{ key: "todo.id" }}
                    out:send|local={{ key: "todo.id" }}
                />
            {/if}
            <p>
                {@html $store_settings.mode === const_game.mode.human
                    ? "player &nbsp;2"
                    : "bot "} &nbsp; (black)
            </p>
            <p>{second_player_score} &nbsp;pawns</p>
        </div>
    </div>
    {#if settings_mounted}
        <Board />
    {/if}
</main>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #player-infos-container {
        margin-bottom: 20px;
    }

    .player-infos {
        position: relative;
        display: inline-block;
        text-align: center;
        width: 170px;
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
        background-color: #e9e9e9;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
</style>
