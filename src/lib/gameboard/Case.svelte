

<script>
    import Pawn from './Pawn.svelte'

    export let value;
    export let clickTrigger;

    let local_value = value;
    export let borders = [false, false, false, false];
    let rotation = false;

    $: if (value != local_value) {
        if (local_value) {
            rotation = false;
            
            setTimeout(_ => {
                rotation = true;
            }, null)
        }
        local_value = value 
    }
</script>

<div 
    class="board-case"
    class:board-case-border-top={borders[0]}
    class:board-case-border-right={borders[1]}
    class:board-case-border-bottom={borders[2]}
    class:board-case-border-left={borders[3]}
    on:click={clickTrigger}>
    {#if local_value}
        <Pawn value={local_value} {rotation}/>
    {/if}
    &nbsp;
</div>

<style>
    .board-case {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;
        background-color: rgb(150, 247, 250);


        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }
    
    .board-case-border-top {
        border-top: 2.5px solid rgb(0, 140, 233);
    }
    
    .board-case-border-right {
        border-right: 2.5px solid rgb(0, 140, 233);
    }
    
    .board-case-border-bottom {
        border-bottom: 2.5px solid rgb(0, 140, 233);
    }
    
    .board-case-border-left {
        border-left: 2.5px solid rgb(0, 140, 233);
    }
</style>