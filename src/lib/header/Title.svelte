<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script context="module">
    let module_title_returned = false;
    let module_title_never_clicked = true;
    let module_title_never_shaked = true;
</script>

<script>
    let title_never_clicked = true;
    let block_animation = false;
    let title_shaking = false;
    let title_returned = module_title_returned;
    let title_returned_wait_block_animation = title_returned;
    $: module_title_returned = title_returned;

    function titleRotationHandler() {
        title_never_clicked = false;
        module_title_never_clicked = false;
        title_returned = !title_returned;
        block_animation = true;
        setTimeout((_) => {
            block_animation = false;
            setTimeout((_) => {
                title_returned_wait_block_animation = title_returned;
            }, 100);
        }, null);
    }

    setTimeout((_) => {
        if (module_title_never_shaked) {
            title_shaking = true;
            module_title_never_shaked = false;
        };
    }, 5000 + Math.random() * 10000);
</script>

<!-- ************************************** CONTENT -->
<div
    id="title-container"
    class:animation-shaking={title_shaking}
    class:returned={title_returned_wait_block_animation}
    class:animation-to-returned={title_returned &&
        !block_animation &&
        !title_never_clicked}
    class:animation-to-not-returned={!title_returned &&
        !block_animation &&
        !title_never_clicked}
    on:click={titleRotationHandler}
>
    <h1>Volte Face</h1>
</div>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #title-container {
        padding: 10px 30px;
        color: black;
        background-color: white;
        display: inline-block;
        border: 4px solid black;
    }

    #title-container.returned {
        color: white;
        background-color: black;
    }

    #title-container.animation-shaking {
        animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    }

    #title-container.animation-to-not-returned {
        animation: rotation 300ms linear 0s 1 normal none;
    }

    #title-container.animation-to-returned {
        animation: rotation 300ms linear 0s 1 reverse none;
    }

    h1 {
        display: inline-block;
        font-size: 50px;
        margin: 0;

        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    @keyframes rotation {
        from {
            color: white;
            background-color: black;
            transform: matrix(1, 0, 0, 1, 0, 0);
        }
        49.9% {
            color: white;
            background-color: black;
        }
        50% {
            color: black;
            background-color: white;
            transform: matrix(1, 0, 0, 0.01, 0, 0);
        }
        to {
            color: black;
            background-color: white;
            transform: matrix(1, 0, 0, 1, 0, 0);
        }
    }
</style>
