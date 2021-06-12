<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import Case from "./Case.svelte";
    import { next_board } from "../../logic/next_board";

    export let turn = 1;

    let pawns = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    function test(x, y) {
        [pawns, turn] = next_board(pawns, turn, x, y);
    }
</script>

<!-- ************************************** CONTENT -->

<div id="board">
    {#each pawns as line, y}
        <div class="board-line">
            {#each line as position, x}
                <Case
                    clickTrigger={(_) => test(x, y)}
                    bind:value={position}
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
