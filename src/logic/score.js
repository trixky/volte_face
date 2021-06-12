export function get_score(board) {
    let first_player_score = 0;
    let second_player_score = 0;

    for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++) {
            board[y][x] &&
                (board[y][x] === 1 ?
                first_player_score++ :
                second_player_score++)
        }

    return [first_player_score, second_player_score]
}