<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy } from "svelte";
    import { store_game } from "../stores/store.game";

    import Header from "../lib/header/Header.svelte";
    import Board from "../lib/gameboard/Board.svelte";

    let local_store_game;


    $: turn_color = local_store_game.turn === 1 ? "white" : "black";

    const unsubscribe_store_game = store_game.subscribe((value) => {
        local_store_game = value;
    });

    onDestroy(unsubscribe_store_game);
</script>

<!-- ************************************** CONTENT -->
<header class="center">
    <Header />
</header>
<main class="center">
    <!-- <div>
        <div>
            <p>player &nbsp;1&nbsp; (white)</p>
        </div>
    </div> -->
    <p>turn: &nbsp;&nbsp; player {local_store_game.turn} &nbsp;&nbsp; ({turn_color})</p>
    <Board/>
</main>
<footer class="center">
    <p>ceci est le footer</p>
</footer>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->