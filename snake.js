class my_helper_class{
    draw_cube(x,y, is_border, color = "black", text="") {
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
        
    }

}


class snake_game{

    
    snake = []
    board = []
    apple_location = {}
    is_game_over = false
    direction = {}
    start_position = {"row":1,"column":1}
    board_size = 5

    dirs_map_input = {
        "w": {"row":0,"column":-1}, 
        "s": {"row":0,"column":1},
        "a": {"row":-1,"column":0},
        "d": {"row":1,"column":0}
    }
    

    constructor(is_controlled_by_human, my_helper_class){
        this.is_controlled_by_human = is_controlled_by_human;
        this.my_helper_class = my_helper_class;
        this.init();
    }

    init() {
        var board = []
    
        // this.result_move_list = create_result_move_list(board_x, board_y);
    
        
        for (let i = 0; i <= this.board_size; i++) {
            board.push([]);
            for (let j = 0; j <= this.board_size; j++) {
                var is_border = false;
    
                if(j == this.board_size  | i == this.board_size ){
                    is_border = true
                }
                if(j == 0 | i == 0 ){
                    is_border = true
                }
                
                board[i].push(is_border);
                this.my_helper_class.draw_cube(i,j, is_border,"black");
            }
        }
        this.snake.length = 0;

        this.snake = [this.start_position]
        this.my_helper_class.draw_cube(1,1,true)
        this.board = board;
        this.direction = this.dirs_map_input["s"];
        this.create_apple(board);
        

        addEventListener('keypress', (event) => {
            // console.log(event.key);
            // console.log(init_things["snake"]);
            if(this.dirs_map_input[event.key]){
                this.direction = this.dirs_map_input[event.key]
            }
            
            
            // event.key
        
        });
    }    
    delete_last() {
        var end_of_snake = this.snake[0];
        this.snake.shift();
        this.board[end_of_snake["row"]][end_of_snake["column"]] = false;
        this.my_helper_class.draw_cube(end_of_snake["row"],end_of_snake["column"],false);
        // console.log(snake);
    }

    sequence_move() {
        var apple_eaten = false;

        // console.log(this.snake);
        var newx = this.snake[this.snake.length - 1]["row"] + this.direction["row"];
        var newy = this.snake[this.snake.length - 1]["column"] + this.direction["column"];
        // console.log(newx+"   "+ newy);    
        

        
        // hmmm
        if(this.apple_location["row"] == newx  && this.apple_location["column"] == newy){
            apple_eaten = true;
        }else{
            this.delete_last();
        }
        

        if(this.board[newx][newy]){
            console.log( "game_over" );
            this.init();
            
            return ""
        }

        this.snake.push({"row":newx, "column":newy});
    
        // apply it on the board
        this.board[newx][newy] = true;
        this.my_helper_class.draw_cube(newx,newy,true);
    
        if(apple_eaten){
           this.create_apple();
    
        }
    }
    check_game_state() {
        
    }

    create_apple() {
        // check if every cell is blocked
        var is_blocked = true;
    
        var block_arry = [];
        for (let i = 0; i < this.board.length; i++) {
            const element = this.board[i];
            
            block_arry.push(element.some(element => element == false));
             
    
        }
        is_blocked = block_arry.some(element => element == true);
        while (is_blocked) {
            var random_x = Math.floor(Math.random() * this.board[0].length);
            var random_y = Math.floor(Math.random() * this.board.length);
            is_blocked = this.board[random_x][random_y];
        }
        this.my_helper_class.draw_cube(random_x,random_y,true,"red");
        
        this.apple_location = {"row": random_x, "column":random_y}
        console.log(this.apple_location);
        
    }

}




my_timer = ms => new Promise(res => setTimeout(res, ms))
async function start_game(my_timer) {
    
    var my_class = new my_helper_class()

    var act_snake_game = new snake_game(true, my_class);

    while (!act_snake_game.is_game_over) {
        // if(i%1 == 0){
        await my_timer(500);
        
        act_snake_game.sequence_move();
        
    }    

}
start_game(my_timer)