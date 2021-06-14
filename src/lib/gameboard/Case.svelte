<script>
    import Pawn from "./Pawn.svelte";
    import { store_settings } from "../../stores/store.settings";
    import { const_game } from "../../constants/const.game";

    export let value;
    export let clickTrigger;
    export let borders = [false, false, false, false];

    let local_value = value;
    let rotation = false;

    $: if (value != local_value) {
        if (value != 0) {
            if (local_value) {
                rotation = false;
                setTimeout(() => (rotation = true), null);
            }
        } else {
            rotation = false;
        }
        local_value = value;
    }
</script>

<div
    class="board-case green-theme"
    class:theme-blue={$store_settings.theme === const_game.themes.blue}
    class:theme-green={$store_settings.theme === const_game.themes.green}
    class:theme-red={$store_settings.theme === const_game.themes.red}
    class:board-case-border-top={borders[0]}
    class:board-case-border-right={borders[1]}
    class:board-case-border-bottom={borders[2]}
    class:board-case-border-left={borders[3]}
    on:click={clickTrigger}
>
    {#if local_value}
        <Pawn value={local_value} {rotation} />
    {/if}
    &nbsp;
</div>

<style>
    .board-case {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;

        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    .board-case.theme-blue {
        background-color: rgb(181, 244, 255);
        border-color: rgb(0, 140, 255);
    }
    .board-case.theme-green {
        background-color: rgb(203, 255, 210);
        border-color: rgb(52, 194, 33);
    }
    .board-case.theme-red {
        background-color: rgb(255, 202, 202);
        border-color: rgb(255, 85, 85);
    }

    .board-case-border-top {
        border-top: 2.5px solid;
    }

    .board-case-border-right {
        border-right: 2.5px solid;
    }

    .board-case-border-bottom {
        border-bottom: 2.5px solid;
    }

    .board-case-border-left {
        border-left: 2.5px solid;
    }
</style>
