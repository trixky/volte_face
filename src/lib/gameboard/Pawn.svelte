<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->

<script>
    import { fade } from 'svelte/transition';
    
    export let value = 1;
    export let rotation = false;
    let color = value;

    $: if (value != color) setTimeout( _ => color = value, 100 )
</script>

<!-- ************************************** CONTENT -->

<div
    class="pawn"
    class:pawn_rotation_to_white={rotation && value === 1}
    class:pawn_rotation_to_black={rotation && value === 2}
    class:pawn_white={color === 1}
    class:pawn_black={color === 2}
    transition:fade="{{duration: 100}}"/>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->

<style>
    .pawn {
        display: block;
        position: absolute;
        margin: 3px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: solid;
        border-width: 4px;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    .pawn_rotation_to_white {
        animation-name: rotation, to_white;
        animation-duration: 0.5s;
        animation-iteration-count: running;
        animation-timing-function: linear;
    }

    .pawn_rotation_to_black {
        animation-name: rotation, to_black;
        animation-duration: 0.5s;
        animation-iteration-count: running;
        animation-timing-function: linear;
    }

    .pawn_white {
        background-color: #fff;
        border-color: #ccc;
    }

    .pawn_black {
        background-color: #444;
        border-color: #333;
    }

    @keyframes rotation {
        0% {
            transform: scale(1);
            top: 0px; 
            height: 44px;
        }
        20% {
            transform: scale(1.1);
            top: 0px; 
            height: 44px;
        }
        50%  { 
            top: 22px; 
            height: 0px;
        }
        80% {
            transform: scale(1.1);
            top: 0px; 
            height: 44px;
        }
    }

    @keyframes to_black {
        from { 
            background-color: #fff;
            border-color: #ccc;
        }
        48%  { 
            background-color: #fff;
            border-color: #ccc;
        }
        52%   { 
            background-color: #444;
            border-color: #333;
        }
    }

    @keyframes to_white {
        from { 
            background-color: #444;
            border-color: #333;
        }
        48%  { 
            background-color: #444;
            border-color: #333;
        }
        52%   { 
            background-color: #fff;
            border-color: #ccc;
        }
    }
</style>