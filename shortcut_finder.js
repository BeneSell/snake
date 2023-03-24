

class shortcut_finder{
    
    result_move_list = []
    last_pos = {}
    poss_direction = [
        {"row":0,"column":-1}, 
        {"row":0,"column":1},
        {"row":-1,"column":0},
        {"row":1,"column":0}
    ]

    constructor(act_snake_game){
        this.act_snake_game = act_snake_game
        this.create_result_move_list();
        this.last_pos = this.act_snake_game.start_position;

    }



    create_result_move_list() {
    
        // dont use the border
        var length_of_board_x = this.act_snake_game.board_size - 1;
        var length_of_board_y = this.act_snake_game.board_size - 1;
        var result_move_list = [];
        // result_move_list.push(this.act_snake_game.start_position);
        
        for (let i = 0; i < length_of_board_x; i++) {
            
            for (let j = 0; j < length_of_board_y; j++) {
                if(i%2 == 0){
                    // move down
                    if(j != 0){
                        result_move_list.push({"row":i + 1, "column":j + 1});
                    }
    
                }else{
                    // move to the point before the last point
                    // because last point is the wall
                    if(length_of_board_y - 1 - j != 0){
                        result_move_list.push({"row":i + 1, "column":length_of_board_y - j});
                    }
                    
                    
                }
            }
            if(i == length_of_board_x - 1){
                // go left
                // lowest point = i
                // highest point = 0
                for(let k = i; k >= 0; k--){
                    result_move_list.push({"row":k + 1, "column":1});
                }
            }
            
        }
        console.log(result_move_list);
        this.result_move_list = result_move_list
        
        // double the list for easier looping 
        this.result_list_move_two_times = [];
        this.result_list_move_two_times.push(... result_move_list);
        this.result_list_move_two_times.push(... result_move_list);

    }

    set_new_index(){
        
        // set new index
        var snake_head = this.act_snake_game.snake[this.act_snake_game.snake.length - 1];
        i = result_move_list.findIndex(e =>
            e["row"] == snake_head["row"] &&
            e["column"] == snake_head["column"]);
        // console.log(result_move_list.findIndex(e =>
        //         e["row"] == snake_head["row"] &&
        //         e["column"] == snake_head["column"]));
    
    }

    check_if_won(){
        if(this.act_snake_game.snake.length == this.result_move_list.length){
            console.log("you won!");
            this.act_snake_game.is_game_over = true;
        }
    }

    computer_move() { // We need to wrap the loop into an async function for this to work
        var next_defined_move = {}

        var cur_index = this.result_move_list.findIndex(e => 
            e["row"] == this.last_pos["row"] && 
            e["column"] == this.last_pos["column"])
        

        // if we are at the end of the list, go to the start
        if(this.result_move_list.length - 1 != cur_index){
            next_defined_move = this.result_move_list[cur_index + 1];
        }else{
            next_defined_move = this.result_move_list[0];   
        }

        
        var move_x = (this.last_pos["row"]- next_defined_move["row"])* -1;
        var move_y = (this.last_pos["column"]- next_defined_move["column"]) * -1;
        
        var next_move = this.decide_next_move();
        if(next_move){
            move_x = next_move["row"];
            move_y = next_move["column"];
                }
        else{
                }

        this.act_snake_game.direction = {"row": move_x, "column": move_y}
        


        // this.decide_next_move()
        this.act_snake_game.sequence_move();


        
                
        // set_new_index if we move out of the normal result move list!
        // this.set_new_index();
        this.check_if_won();


        this.last_pos = next_defined_move;       
        
        }   
    
    can_move_there(point_one, point_two) {

            
            var cur_index = this.result_move_list.findIndex(e => 
                e["row"] == point_one["row"] && 
                e["column"] == point_one["column"]);
    
            var future_index = this.result_move_list.findIndex(e => 
                e["row"] == point_two["row"] && 
                e["column"] == point_two["column"]);
            
            var apple_index = this.result_move_list.findIndex(e => 
                    e["row"] == this.act_snake_game.apple_location["row"] && 
                    e["column"] == this.act_snake_game.apple_location["column"]);
            
            // theres a wall
            if(future_index == -1){
                return false
            }        
                        
            // get the moves from the current index to the future index  
            var cur_x_to_future_x = [];
            
            if(future_index < cur_index){
                cur_x_to_future_x = this.result_list_move_two_times.slice(cur_index, future_index + this.result_move_list.length);
                
            }else{
                cur_x_to_future_x = this.result_move_list.slice(cur_index, future_index);
            }

            var moves_on_board = []

            // one to ignore the first
            // this is to scyn the result move list with the board
            for (let i = 0; i < cur_x_to_future_x.length; i++) {
                const element = cur_x_to_future_x[i];

                // check if the move is on the snake
                if(element["row"] == point_one["row"] && element["column"] == point_one["column"]){
                }else{
                    var temp_move = this.act_snake_game.board[element["row"]][element["column"]]
                    moves_on_board.push(temp_move)
                }
            }
            if(moves_on_board.length == 0){
                console.log("cant move there!");
            }
            // if there is between point A and point B a used block you cant move there!
            if(moves_on_board.every(e => !e)){
                // allowed to move
                return true
            }

            return false
            // get all true false values of the     
                
        }
        calc_dist(apple_index, move_to_test_index){
            // if(point_one["row"] == point_two["row"] && point_one["column"] == point_two["column"]){
            //     return 0;
            // }
            // var a = point_one["row"] - point_two["row"];
            // var b = point_one["column"] - point_two["column"];

            // var c = Math.sqrt( a*a + b*b );
            // return c;

            // moves until apple is reached
            if(apple_index < move_to_test_index){
                return apple_index + this.result_move_list.length - move_to_test_index;
            } else{
                return apple_index - move_to_test_index;
            }
        }

        decide_next_move() {
            

            // snake, board, dir, apple_location, result_move_list
            
                // if youre moving away from apple
                // which move brings you towards the apple
                // check if there is smth between the curr point and the new point 
                // test for the other three moves 
                var snake_head = this.act_snake_game.snake[this.act_snake_game.snake.length - 1];
                
                var could_move_list = [];

                for (let i = 0; i < this.poss_direction.length; i++) {
                    
                    const element = this.poss_direction[i];
                    var move_to_test = {
                        "row": snake_head["row"] + element["row"],
                        "column": snake_head["column"] + element["column"]
                    }
                    // could_move_list.push({"move": element, "distance": this.calc_dist(move_to_test,this.act_snake_game.apple_location)})

                    if(this.can_move_there(snake_head, move_to_test)) {

                        var future_index = this.result_move_list.findIndex(e => 
                            e["row"] == move_to_test["row"] && 
                            e["column"] == move_to_test["column"]);
                        
                        var apple_index = this.result_move_list.findIndex(e => 
                                e["row"] == this.act_snake_game.apple_location["row"] && 
                                e["column"] == this.act_snake_game.apple_location["column"]);

                        could_move_list.push({"move": element, "distance": this.calc_dist(apple_index, future_index)})
                    }                   
                    
                    
                }                
                if(could_move_list.length == 0){
                    console.log("should never happen");
                    return false
                    
                }
                
                var min = Math.min(... could_move_list.map(item => item["distance"]));

                return could_move_list.filter(e => e["distance"] == min)[0]["move"];

                
                
        
            }
        
      
    }







