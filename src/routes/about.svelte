<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import Header from "../lib/header/Header.svelte";
</script>

<!-- ************************************** CONTENT -->
<header class="center">
    <Header />
</header>
<main class="center">
    <ul class="reference-container">
        <li>
            <p>built with</p>
            <a href="https://svelte.dev/" target="_blank"
                ><img
                    src="/static/svelte.png"
                    alt="svelte logo"
                    width="200px"
                /></a
            >
        </li>
        <li>
            <p>hosted from</p>
            <a href="https://svelte.dev/" target="_blank"
                ><img
                    src="/static/svelte.png"
                    alt="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx logo"
                    width="200px"
                /></a
            >
        </li>
        <li>
            <p>uploaded on</p>
            <a href="https://github.com/trixky/volte_face" target="_blank"
                ><img
                    src="/static/github.png"
                    alt="github logo"
                    width="200px"
                /></a
            >
        </li>
    </ul>
</main>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    .reference-container {
        margin: 0 auto;
        border: solid 4px black;
        padding: 20px 0;
        width: 380px;
    }

    .reference-container {
        list-style-type: none;
    }

    .reference-container > li > a > img {
        margin: 10px 0;
        transition: transform .2s;
    }

    .reference-container > li > a:hover > img {
        transform: scale(1.1);
    }
</style>
