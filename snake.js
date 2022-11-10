
function create_result_move_list(board_rows, board_columns) {
    
    // dont use the border
    var length_of_board_x = board_rows - 1;
    var length_of_board_y = board_columns - 1;
    var result_move_list = [];
    
    for (let i = 0; i < length_of_board_x; i++) {
        
        for (let j = 0; j < length_of_board_y; j++) {
            if(i%2 == 0){
                // geh nach unten
                if(j != 0){
                    result_move_list.push({"row":i + 1, "column":j + 1});
                }

            }else{
                // geh nach oben (aber nur bis zum vorletzten)
                if(length_of_board_y - 1 - j != 0){
                    result_move_list.push({"row":i + 1, "column":length_of_board_y - j});
                }
                
                
            }
        }
        if(i == length_of_board_x - 1){
            // geh nach links
            // unterster punkt = i
            // oberster punkt = 0
            for(let k = i; k >= 0; k--){
                result_move_list.push({"row":k + 1, "column":1});
            }
        }
        
    }
    console.log(result_move_list);
    return result_move_list
}




function init(params) {
    var board = []
    var board_size = 5;
    var board_x = board_size;
    var board_y = board_size;

    var result_move_list = create_result_move_list(board_x, board_y);

    
    for (let i = 0; i <= board_size; i++) {
        board.push([]);
        for (let j = 0; j <= board_size; j++) {
            var is_border = false;

            if(j == board_size  | i == board_size ){
                is_border = true
            }
            if(j == 0 | i == 0 ){
                is_border = true
            }
            
            board[i].push(is_border);
            draw_cube(i,j, is_border,"black");
        }
    }

    apple_location = create_apple(board);
    var snake = [{"row":1,"column":1}]
    return {"snake":snake, "board":board, "apple_location": apple_location, "result_move_list": result_move_list}
}

function delete_last(snake, board) {
    var end_of_snake = snake[0];
    snake.shift();
    board[end_of_snake["row"]][end_of_snake["column"]] = false;
    draw_cube(end_of_snake["row"],end_of_snake["column"],false);
    // console.log(snake);
    return snake;
}

function add_direction(new_snake,dir, board) {
    var apple_eaten = false;
    var dirs = {
        "w": {"row":0,"column":-1}, 
        "s": {"row":0,"column":1},
        "a": {"row":-1,"column":0},
        "d": {"row":1,"column":0}
    }
    // console.log(new_snake);
    if(typeof dir == 'string'){
        var newx = new_snake[new_snake.length - 1]["row"] + dirs[dir]["row"];
        var newy = new_snake[new_snake.length - 1]["column"] + dirs[dir]["column"];
        // console.log(newx+"   "+ newy);    
    }else{
        var newx = new_snake[new_snake.length - 1]["row"] + dir["row"];
        var newy = new_snake[new_snake.length - 1]["column"] + dir["column"];
    }
    if(apple_location["row"] == newx  && apple_location["column"] == newy){
        apple_eaten = true;
    }else{
        new_snake = delete_last(new_snake, board);
    }

    if(board[newx][newy]){
        console.log( "game_over" );
        is_game_over = true
        
    }
    new_snake.push({"row":newx, "column":newy});

    // apply it on the board
    board[newx][newy] = true;
    draw_cube(newx,newy,true);

    if(apple_eaten){
       apple_location = create_apple(board);
       console.log(apple_location);

    }

    return {"new_snake": new_snake, "apple_location": apple_location}
}
function move(snake, dirrection, board, apple_location, result_move_list) {
    // console.log(snake);

    // apply_shortcut only works if we play automated!!!
    var new_info = apply_shortcuts(snake,board,dirrection, apple_location, result_move_list)
    
    snake_and_apple = add_direction(snake,new_info["dir"], board, apple_location)

    // snake_head = snake[snake.length - 1]

    // snake = delete_last(snake, board)
    
    return {"snake":snake_and_apple["new_snake"], "board":board, "apple_location": snake_and_apple["apple_location"], "result_move_list": result_move_list, "new_index": new_info["new_index"]}
}


var is_game_over = false;
var init_things = init();

addEventListener('keypress', (event) => {
    // console.log(event.key);
    // console.log(init_things["snake"]);
    init_things = move(init_things["snake"],event.key, init_things["board"],init_things["apple_location"], init_things['result_move_list'])
    if(is_game_over){
        init_things = init();
        is_game_over=false;
    }

});


function draw_cube(x,y, is_border, color = "black", text="") {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(33*x, 33*y, 30, 30);
    if(is_border){
        ctx.fillStyle = color;

    } else{
        ctx.fillStyle = "white";
    }
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.fillText(text, (x*33)+15,(y*33)+15);
    
};

function create_apple(board) {
    // check if every cell is blocked
    var is_blocked = true;

    var block_arry = [];
    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        
        block_arry.push(element.some(element => element == false));
         

    }
    is_blocked = block_arry.some(element => element == true);
    while (is_blocked) {
        var random_x = Math.floor(Math.random() * board[0].length);
        var random_y = Math.floor(Math.random() * board.length);
        is_blocked = board[random_x][random_y];
    }
    draw_cube(random_x,random_y,true,"red");
    return {"row": random_x, "column":random_y}
    
}

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

async function load(result_move_list) { // We need to wrap the loop into an async function for this to work

    var game_is_alive = true;
    while (game_is_alive) {
        
    
    var last_pos = {"row":1, "column":1}
    for (var i = 0; i < result_move_list.length; i++) {
        const element = result_move_list[i];
        var move_x = element["row"] - last_pos["row"];
        var move_y = element["column"] - last_pos["column"];

        // console.log(move_x+"   "+move_y);
        init_things = move(init_things["snake"],{"row":move_x, "column":move_y}, init_things["board"],init_things["apple_location"], init_things['result_move_list'])
        if(init_things["new_index"] != 0){
            var s_snake = init_things["snake"][init_things["snake"].length - 1];
            i = result_move_list.findIndex(e =>
                e["row"] == s_snake["row"] &&
                e["column"] == s_snake["column"]);
            console.log(result_move_list.findIndex(e =>
                    e["row"] == s_snake["row"] &&
                    e["column"] == s_snake["column"]));
        }
        
        if(init_things["snake"].length == result_move_list.length){
            game_is_alive = false;
            console.log("you won!");
        }
        if(is_game_over){
            init_things = init();
            is_game_over=false;
        }


        last_pos = element;       
        if(i%1 == 0){
            await timer(500); // then the created Promise can be awaited
        }
        }
    }
    
  
}

function can_move_there(point_one, point_two, board, result_move_list) {
    
    var cur_index = result_move_list.indexOf(result_move_list.filter(e => e["row"] == point_one["row"] && e["column"] == point_one["column"])[0]);
    var future_index = result_move_list.indexOf(result_move_list.filter(e => e["row"] == point_two["row"] && e["column"] == point_two["column"])[0]);

    var cur_x_to_future_x = result_move_list.slice(cur_index + 1, future_index + 1);
    var moves_on_board = []
    for (let i = 0; i < cur_x_to_future_x.length; i++) {
        const element = cur_x_to_future_x[i];
        var temp_move = board[element["row"]][element["column"]]
        moves_on_board.push(temp_move)
        
    }
    if(moves_on_board.every(e => !e) && moves_on_board.length != 0){
        // allowed to move
        return {"can_move": true, "new_index": future_index - 1}
    }
    return {"can_move": false, "new_index": 0}
    // get all true false values of the     
        
}


function is_distance_bigger(apple_location, snake, dir) {
    if(apple_location == snake[snake.length - 1]){
        return false;
    }

    var distance_to_apple_x = apple_location["row"] - snake[snake.length - 1]["row"];
    var future_dis_to_apple_x = apple_location["row"] - (snake[snake.length - 1]["row"] +dir["row"]);


    var distance_to_apple_y = apple_location["column"] - snake[snake.length - 1]["column"];
    var future_dis_to_apple_y = apple_location["column"] - (snake[snake.length - 1]["column"] +dir["column"]);


    // console.log(Math.abs(distance_to_apple_x) +  "  " + Math.abs(future_dis_to_apple_x));
    // console.log(Math.abs(distance_to_apple_y) + "   "+ Math.abs(future_dis_to_apple_y));
    // if new x has more dis to apple than old x
    if(Math.abs(distance_to_apple_x) < Math.abs(future_dis_to_apple_x)
        || Math.abs(distance_to_apple_y) < Math.abs(future_dis_to_apple_y)){
            // the new point is worse than the old point of dis
            return true

    }else{
        return false
    }
}

function apply_shortcuts(snake, board, dir, apple_location, result_move_list) {
    // dont do it today
    // you are allowed to skip if
    // - the skip dosent cost you youre life (no more blocks to move)
    // - its faster than the regular

    
        // if youre moving away from apple
        // which move brings you towards the apple
        // check if there is smth between the curr point and the new point 
        // test for the other three moves 
        var dirs_temp = [
            {"row":0,"column":-1}, 
            {"row":0,"column":1},
            {"row":-1,"column":0},
            {"row":1,"column":0}
        ]
        for (let i = 0; i < dirs_temp.length; i++) {

            var could_move_list = [];
            if(!is_distance_bigger(apple_location, snake, dirs_temp[i])){
                // check if you can move there

                const element = dirs_temp[i];
                var snake_head = snake[snake.length - 1];
                var move_to_test = {
                    "row": snake_head["row"] + element["row"],
                    "column": snake_head["column"] + element["column"]
                }
                var test = can_move_there(snake_head, move_to_test, board, result_move_list);
                if(test["can_move"]){
                    // we have to set a new index

                    could_move_list.push(test)
                    return {"dir": dirs_temp[i], "new_index":test["new_index"]}
                }
            }

        }
        return {"dir": dir, "new_index":0}

    }



load(init_things['result_move_list']);