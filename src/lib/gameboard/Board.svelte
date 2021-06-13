<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onDestroy } from "svelte";
    import Case from "./Case.svelte";
    import { next_board } from "../../logic/next_board";
    import { store_game } from "../../stores/store.game";

    let local_store_game;
    let new_pawns;
    let new_turn;

    function handleClickTrigger(x, y) {
        [new_pawns, new_turn] = next_board(
            local_store_game.pawns,
            local_store_game.turn,
            x,
            y
            );
            store_game.update((n) => ({ ...n, pawns: new_pawns }));
            store_game.update((n) => ({ ...n, turn: new_turn }));
    }

    const unsubscribe_store_game = store_game.subscribe((value) => {
        local_store_game = value;
    });

    onDestroy(unsubscribe_store_game);
</script>

<!-- ************************************** CONTENT -->
<div id="board">
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

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #board {
        display: inline-block;
        margin: 15px auto;

        border: solid;
        border-width: 10px;
        border-color: rgb(150, 247, 250);
        background-color: black;
    }
    .board-line {
        display: block;
        padding: 0;
        margin: 0;
    }
</style>
