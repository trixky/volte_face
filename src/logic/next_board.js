export function next_board(board, player, x, y) {
    let new_player = player;

    const new_board = [...board];

    if (!board[y][x])
        for (let x_direction = -1; x_direction < 2; x_direction++)
            for (let y_direction = -1; y_direction < 2; y_direction++) {
                if (
                    (x_direction || y_direction) &&
                    check_line(player, x, y, x_direction, y_direction, new_board))
                    new_player = player === 1 ? 2 : 1;
            }

    return [new_board, new_player]
}

function check_line(player, x_pos, y_pos, x_direction, y_direction, board) {

    const to_change = [];
    let next = false;

    const initial_x_pos = x_pos;
    const initial_y_pos = y_pos;

    const x_limit_checker = x_direction ? x_direction > 0 ? x => x < 8 : x => x > -1 : _ => true;
    const y_limit_checker = y_direction ? y_direction > 0 ? y => y < 8 : y => y > -1 : _ => true;

    while (
        y_limit_checker((y_pos += y_direction)) &&
        x_limit_checker((x_pos += x_direction)) &&
        board[y_pos][x_pos] != player &&
        board[y_pos][x_pos]
    ) {
        to_change.push([x_pos, y_pos]);
    }

    if (
        y_limit_checker(y_pos) &&
        x_limit_checker(x_pos) &&
        board[y_pos][x_pos] === player && to_change.length
    ) {
        next = true;
        board[initial_y_pos][initial_x_pos] = player
        to_change.forEach(case_to_change => board[case_to_change[1]][case_to_change[0]] = player)
    }

    return next;
}