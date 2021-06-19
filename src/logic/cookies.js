import { const_game } from "../constants/const.game";
import { store_settings } from "../stores/store.settings"

let local_value;

store_settings.subscribe(value => {
    local_value = value;
});

export function set_cookie(name, value) {
    document.cookie = name + "=" + value + ";path=/;";
    return true;
}

export function get_cookie(name) {
    return (
        decodeURIComponent(
            document.cookie.replace(
                new RegExp(
                    "(?:(?:^|.*;)\\s*" +
                    encodeURIComponent(name).replace(
                        /[\-\.\+\*]/g,
                        "\\$&"
                    ) +
                    "\\s*\\=\\s*([^;]*).*$)|^.*$"
                ),
                "$1"
            )
        ) || null
    );
}

export function import_cookies() {
    const cookie_first_player_to_play = get_cookie("first_player_to_play");
    const cookie_theme = get_cookie("theme");
    const cookie_theme_border = get_cookie("theme_border");
    const cookie_sounds = get_cookie("sounds");
    const cookie_volume = get_cookie("volume");
    const cookie_mode = get_cookie("mode");
    const cookie_bot_difficulty = get_cookie("bot_difficulty");

    if (cookie_first_player_to_play)
        store_settings.update_first_player(parseInt(cookie_first_player_to_play))
    if (cookie_theme)
        store_settings.update_theme(parseInt(cookie_theme))
    if (cookie_theme_border === String(const_game.themes_border.with_border))
        store_settings.update_theme_border(const_game.themes_border.with_border)
    else if (cookie_theme_border === String(const_game.themes_border.without_border))
        store_settings.update_theme_border(const_game.themes_border.without_border)
    if (cookie_sounds === String(const_game.sounds.on))
        store_settings.update_sounds(const_game.sounds.on)
    else if (cookie_sounds === String(const_game.sounds.off))
        store_settings.update_sounds(const_game.sounds.off)
    if (cookie_volume)
        store_settings.update_volume(parseInt(cookie_volume))
    if (cookie_mode)
        store_settings.update_mode(parseInt(cookie_mode))
    if (cookie_bot_difficulty)
        store_settings.update_bot_difficulty(parseInt(cookie_bot_difficulty))
}