<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->
<script>
    import { onMount } from "svelte";
    import { store_settings } from "../../stores/store.settings";

    let sound_menu_selection = null;

    onMount(() => {
        sound_menu_selection = new Audio("/menu_selection.mp3");
    });

    function play_menu_selection_sound(force_to_play = null) {
        if (
            ($store_settings.sounds || force_to_play === true) &&
            force_to_play != false
        ) {
            const new_sound = sound_menu_selection.cloneNode(true);
            new_sound.volume = $store_settings.volume / 100;
            new_sound.play();
        }
        return true;
    }
</script>

<!-- ************************************** CONTENT -->
<nav id="menu">
    <ul>
        <li><a on:click={play_menu_selection_sound} href="/">Home</a></li>
        <li><a on:click={play_menu_selection_sound} href="/settings">Settings</a></li>
        <li><a on:click={play_menu_selection_sound} href="/about">About</a></li>
    </ul>
</nav>

<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->
<style>
    #menu {
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    ul {
        padding: 0;
        list-style-type: none;
    }

    li {
        display: inline-block;
        padding: 5px 15px;
        margin: 0 5px;
        text-decoration: none;
    }

    li:hover {
        text-decoration: underline;
    }

    a {
        transform: scale(1.5);
        color: inherit;
        text-decoration: inherit;
    }
</style>
