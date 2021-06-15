import { const_game } from "../constants/const.game";

export function next_board(board, player, x, y) {
    let new_player = player;
    let board_changed = false;

    const new_board = [...board];

    if (!board[y][x])
        for (let x_direction = -1; x_direction < 2; x_direction++)
            for (let y_direction = -1; y_direction < 2; y_direction++) {
                if (
                    (x_direction || y_direction) &&
                    check_line(player, x, y, x_direction, y_direction, new_board, true)) {
                    new_player = player === 1 ? 2 : 1;
                    board_changed = true;
                }
            }

    let [first_player_is_blocked, second_player_is_blocked] = is_player_blocked(new_board)

    if (first_player_is_blocked && second_player_is_blocked)
        new_player = 0;
    else if (new_player === 1 && first_player_is_blocked)
        new_player = 2;
    else if (new_player === 2 && second_player_is_blocked)
        new_player = 1;

    return [new_board, new_player, board_changed]
}

export function find_next_bot_move(board, difficulty) {
    const moves = [];

    for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++)
            if (!board[y][x]) {
                let new_pawns = 1;
                for (let x_direction = -1; x_direction < 2; x_direction++)
                    for (let y_direction = -1; y_direction < 2; y_direction++) {
                        if (x_direction || y_direction) {
                            new_pawns += check_line(const_game.players.second_player, x, y, x_direction, y_direction, board, false);
                        }
                    }
                if (new_pawns > 1)
                    moves.push({ x, y, new_pawns })
            }

    const sorted_moves = moves.sort((a, b) => a.new_pawns > b.new_pawns);

    switch (difficulty) {
        case const_game.bot_difficulty.easy:
            return sorted_moves[Math.ceil(sorted_moves.length * (Math.random() * 0.3))] || sorted_moves[0]
        case const_game.bot_difficulty.medium:
            return sorted_moves[Math.round(sorted_moves.length * (Math.random() *  0.4 + 0.3))] || sorted_moves[0]
        case const_game.bot_difficulty.hard:
            return sorted_moves[Math.ceil(sorted_moves.length * (Math.random() *  0.3 + 0.7))] || sorted_moves[sorted_moves.length - 1]
    }
}

export function is_player_blocked(board) {
    let first_player_is_blocked = true;
    let second_player_is_blocked = true;

    for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++) {
            if (!board[y][x])
                for (let x_direction = -1; x_direction < 2; x_direction++)
                    for (let y_direction = -1; y_direction < 2; y_direction++) {
                        if (x_direction || y_direction) {
                            if (first_player_is_blocked)
                                first_player_is_blocked = !check_line(1, x, y, x_direction, y_direction, board, false)
                            if (second_player_is_blocked)
                                second_player_is_blocked = !check_line(2, x, y, x_direction, y_direction, board, false)
                        }
                    }
        }

    return [first_player_is_blocked, second_player_is_blocked]
}

function check_line(player, x_pos, y_pos, x_direction, y_direction, board, modification) {

    const to_change = [];
    let next = 0;

    const initial_x_pos = x_pos;
    const initial_y_pos = y_pos;

    const x_limit_checker = x_direction ? x_direction > 0 ? x => x < 8 : x => x > -1 : _ => true;
    const y_limit_checker = y_direction ? y_direction > 0 ? y => y < 8 : y => y > -1 : _ => true;

    while (
        y_limit_checker((y_pos += y_direction)) &&
        x_limit_checker((x_pos += x_direction)) &&
        board[y_pos][x_pos] != player &&
        board[y_pos][x_pos]
    )
        to_change.push([x_pos, y_pos]);

    if (
        y_limit_checker(y_pos) &&
        x_limit_checker(x_pos) &&
        board[y_pos][x_pos] === player && to_change.length
    ) {
        next += to_change.length;
        if (modification) {
            board[initial_y_pos][initial_x_pos] = player
            to_change.forEach(case_to_change => board[case_to_change[1]][case_to_change[0]] = player)
        }
    }

    return next;
}

