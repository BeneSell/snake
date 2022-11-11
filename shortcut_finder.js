

class shortcut_finder{
    
    result_move_list = []
    poss_direction = [
        {"row":0,"column":-1}, 
        {"row":0,"column":1},
        {"row":-1,"column":0},
        {"row":1,"column":0}
    ]

    constructor(act_snake_game){
        this.act_snake_game = act_snake_game
        create_result_move_list();
    }



    create_result_move_list() {
    
        // dont use the border
        var length_of_board_x = this.act_snake_game.board_size - 1;
        var length_of_board_y = this.act_snake_game.board_size - 1;
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
        this.result_move_list = result_move_list
    }

    set_new_index(){
        
        // set new index
        var snake_head = this.act_snake_game.snake[this.act_snake_game.snake.length - 1];
        i = result_move_list.findIndex(e =>
            e["row"] == snake_head["row"] &&
            e["column"] == snake_head["column"]);
        console.log(result_move_list.findIndex(e =>
                e["row"] == snake_head["row"] &&
                e["column"] == snake_head["column"]));
    
    }

    check_if_won(){
        if(this.act_snake_game.snake.length == this.result_move_list.length){
            game_is_alive = false;
            console.log("you won!");
        }
    }

    load() { // We need to wrap the loop into an async function for this to work

        var last_pos = this.act_snake_game.start_position;

        for (var i = 0; i < this.result_move_list.length; i++) {
            
            const element = this.result_move_list[i];
            var move_x = element["row"] - last_pos["row"];
            var move_y = element["column"] - last_pos["column"];
            // console.log(move_x+"   "+move_y);
            // this.act_snake_game.sequence_move();
            // set_new_index if we move out of the normal result move list!
            this.set_new_index();
            this.check_if_won();
            last_pos = element;       
            }
        }   
    
    can_move_there(point_one, point_two) {
    
            var cur_index = this.result_move_list.findIndex(e => 
                e["row"] == point_one["row"] && 
                e["column"] == point_one["column"]);
    
            var future_index = this.result_move_list.findIndex(e => 
                e["row"] == point_two["row"] && 
                e["column"] == point_two["column"]);
        
            var cur_x_to_future_x = this.result_move_list.slice(cur_index + 1, future_index + 1);
            var moves_on_board = []
            
            for (let i = 0; i < cur_x_to_future_x.length; i++) {
                const element = cur_x_to_future_x[i];

                var temp_move = this.act_snake_game.board[element["row"]][element["column"]]
                
                moves_on_board.push(temp_move)
                
            }
            
            // if there is between point A and point B a used block you cant move there!
            if(moves_on_board.every(e => !e) && moves_on_board.length != 0){
                // allowed to move
                return true
            }

            return false
            // get all true false values of the     
                
        }

        is_distance_bigger() {
            // apple , snake, dir
            var apple_location = this.act_snake_game.apple_location
            var snake_head = this.act_snake_game.snake[this.act_snake_game.snake - 1]
            var dir = this.act_snake_game.direction
            

            if(apple_location == snake_head){
                return false;
            }
        
            var distance_to_apple_x = apple_location["row"] - snake_head["row"];
            var future_dis_to_apple_x = apple_location["row"] - (snake_head["row"] + dir["row"]);
        
        
            var distance_to_apple_y = apple_location["column"] - snake_head["column"];
            var future_dis_to_apple_y = apple_location["column"] - (snake_head["column"] + dir["column"]);
        
        
            // console.log(Math.abs(distance_to_apple_x) +  "  " + Math.abs(future_dis_to_apple_x));
            // console.log(Math.abs(distance_to_apple_y) + "   "+ Math.abs(future_dis_to_apple_y));
            
            // this is still wrong
            
            if(Math.abs(distance_to_apple_x) < Math.abs(future_dis_to_apple_x)
                || Math.abs(distance_to_apple_y) < Math.abs(future_dis_to_apple_y)){
                    // the new point is worse than the old point of dis
                    return true
        
            }else{
                return false
            }
        }


        apply_shortcuts() {
            

            // snake, board, dir, apple_location, result_move_list
            
                // if youre moving away from apple
                // which move brings you towards the apple
                // check if there is smth between the curr point and the new point 
                // test for the other three moves 
                
                for (let i = 0; i < this.poss_direction.length; i++) {
        
                    var could_move_list = [];
                    if(!is_distance_bigger(this.poss_direction[i])){
                        // check if you can move there
        
                        const element = this.poss_direction[i];
                        var snake_head = this.act_snake_game.snake[this.act_snake_game.snake.length - 1];

                        var move_to_test = {
                            "row": snake_head["row"] + element["row"],
                            "column": snake_head["column"] + element["column"]
                        }

                        if(can_move_there(snake_head, move_to_test)){
                            // can move
                            could_move_list.push(move_to_test)
                        }
                    }
        
                }
                return could_move_list
        
            }
        
      
    }







