<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script context="module">
    let title_returned = false;
</script>

<script>
    let title_never_clicked = false;
    let block_animation = false;
    let local_title_return = title_returned;
    let local_title_return_wait_block_animation = local_title_return
    $: title_returned = local_title_return

    function titleRotationHandler() {
        title_never_clicked = true;
        local_title_return = !local_title_return
        block_animation = true
        setTimeout(_ => {
                block_animation = false
                setTimeout(_ => {
                    local_title_return_wait_block_animation = local_title_return;

                }, 100)
        }, null)
    }
</script>

<!-- ************************************** CONTENT -->
<div
    id="title-container"
    class:returned={local_title_return_wait_block_animation}
    class:animation-to-returned={local_title_return && !block_animation && title_never_clicked}
    class:animation-to-not-returned={!local_title_return && !block_animation && title_never_clicked}
    on:click={titleRotationHandler}>
    <h1>Volte Face</h1>
</div>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #title-container {
        padding: 10px 30px;
        color: black;
        background-color: white;
        display: inline-block;
        border: 3px solid black;
    }

    #title-container.returned {
        color: white;
        background-color: black;
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
