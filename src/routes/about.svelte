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
        <!-- src="/static/svelte.png" -->
        <li>
            <p>built on</p>
            <a href="https://svelte.dev/" target="_blank"
                ><img
                    src="https://blog.eleven-labs.com/assets/2021-02-22-a-la-decouverte-de-svelte/svelte-logo.png"
                    alt="svelte logo"
                    width="200px"
                /></a
            >
        </li>
        <!-- src="/static/vercel.png" -->
        <li>
            <p>hosted on</p>
            <a href="https://vercel.com/" target="_blank"
                ><img
                    src="https://ml.globenewswire.com/Resource/Download/3a54c241-a668-4c94-9747-3d3da9da3bf2?size=2"
                    alt="vercel logo"
                    width="200px"
                /></a
            >
        </li>
        <!-- src="/static/github.png" -->
        <li>
            <p>uploaded on</p>
            <a href="https://github.com/trixky/volte_face" target="_blank"
                ><img
                    src="data:image/png;base64,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"
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
        transition: transform 0.2s;
    }

    .reference-container > li > a:hover > img {
        transform: scale(1.1);
    }
</style>
