<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import Board from '../lib/gameboard/Board.svelte'
    
    let turn = 1;
</script>

<!-- ************************************** CONTENT -->

<h1>Volte Face</h1>

<p>turn: player {turn}</p>

<div>
    <Board bind:turn={turn}/>
</div>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->