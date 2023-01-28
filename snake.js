class my_helper_class{
    my_timer;

    constructor(){
        this.my_timer = ms => new Promise(res => setTimeout(res, ms))
    }
    
    draw_cube(x,y, is_border, color = "#D5F5E3", text="") {
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
    
        ctx.fillStyle = "#D5F5E3";
    
        ctx.fillText(text, (x*33)+15,(y*33)+15);
        
    }
    // real
    async start_game_real() {
    
    var my_class = new my_helper_class()

    var act_snake_game = new snake_game(true, this);

    while (!act_snake_game.is_game_over) {
        // if(i%1 == 0){
        await this.my_timer(500);
        
        act_snake_game.sequence_move();
        
    }    

}

    async start_game_computer() {
    
    var my_class = new my_helper_class()
    
    var act_snake_game = new snake_game(true, this);
    var my_computer_class = new shortcut_finder(act_snake_game)
    var i = 0;
    while (!act_snake_game.is_game_over) {
        if(i%3 == 0){
            await this.my_timer(1);
        }
        
        my_computer_class.computer_move()        
        i++;
        if(i%1000 == 0){
            i = 0;
        }
    }    

}

async start_game_compute_until_apple() {
    // cool idea would be to compute until apple is found
    // then the player can click on a empty field to create the next apple
    // then the computer can compute again

    var my_class = new my_helper_class()
    
    var act_snake_game = new snake_game(true, this);
    var my_computer_class = new shortcut_finder(act_snake_game)
    var i = 0;

    
    while (!act_snake_game.is_game_over) {
   
        
        my_computer_class.computer_move()        
        await this.my_timer(10);
        if(act_snake_game.apple_eaten) {
            
            while(!act_snake_game.user_has_clicked) {
                await this.my_timer(50);
                console.log("waiting for user to click");
            }
            act_snake_game.user_has_clicked = false;
            // await this.my_timer(500);
            // find method a user can create a new apple
            // if the users clicks at this moment the apple is on a new position
            
        }     
        
        if(i%1000 == 0){
            this.response_timeout = true;
            i = 0;
        }
    }    

}

}

class snake_game{

    
    snake = []
    board = []
    apple_location = {}
    apple_eaten = false
    is_game_over = false
    direction = {}
    start_position = {"row":1,"column":1}
    board_size = 15

    user_has_clicked = false

    dirs_map_input = {
        "w": {"row":0,"column":-1}, 
        "s": {"row":0,"column":1},
        "a": {"row":-1,"column":0},
        "d": {"row":1,"column":0}
    }
    

    constructor(is_controlled_by_human, my_helper_class){
        document.getElementById("myCanvas").addEventListener( "click", this.create_apple_through_click );
        this.is_controlled_by_human = is_controlled_by_human;
        this.my_helper_class = my_helper_class;
        this.init();
    }

    create_apple_through_click = e => {
        var x = e.pageX - e.target.offsetLeft;
        var y = e.pageY - e.target.offsetTop;
        var row = Math.floor(x/33);
        var column = Math.floor(y/33);
        console.log(row, column);
        
        if(this.apple_eaten && !this.board[row][column]){
            this.create_apple({"row": row,"column": column});
            this.user_has_clicked = true;
        }
        // this.create_apple(row, column);
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
                this.my_helper_class.draw_cube(i,j, is_border,"#70C1B3");
            }
        }
        this.snake.length = 0;

        this.snake = [this.start_position]
        this.my_helper_class.draw_cube(1,1,true)
        this.board = board;
        this.direction = this.dirs_map_input["s"];
        this.create_apple();
        

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

        // this is infornt because its an interation where the apple isnt set and i can interact with this
        // no big deal for the user
        // no big deal for the computer

        if(this.apple_eaten){
            this.create_apple();
         }


        var curx = this.snake[this.snake.length - 1]["row"]
        var cury = this.snake[this.snake.length - 1]["column"]
        // console.log(this.snake);
        var newx = this.snake[this.snake.length - 1]["row"] + this.direction["row"];
        var newy = this.snake[this.snake.length - 1]["column"] + this.direction["column"];
        // console.log(newx+"   "+ newy);    
        

        
        // hmmm
        if(this.apple_location["row"] == newx  && this.apple_location["column"] == newy){
            this.apple_eaten = true;
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
        if(this.snake.length > 1){
        this.my_helper_class.draw_cube(newx, newy, true, "#2E4053");
        this.my_helper_class.draw_cube(curx, cury, true, "#70C1B3");
    }
        else{
            this.my_helper_class.draw_cube(newx, newy, true, "#2E4053");
        }
        
        // var snake_head = this.snake[this.snake.length - 1];
        // var snake_second = this.snake[this.snake.length - 2];

        // this.my_helper_class.draw_cube(snake_head["row"],snake_head["column"],true,"green");
        // this.my_helper_class.draw_cube(snake_second["row"],snake_second["column"],true,"#D5F5E3");
        // }else{
        //     var snake_head = this.snake[this.snake.length - 1];
        //     this.my_helper_class.draw_cube(snake_head["row"],snake_head["column"],true,"green");
        // }
    }

    create_apple(new_location = {"row":0, "column":0}) {
        // set timeout for 1 second and then create apple

        

        if(new_location["row"] != 0 && new_location["column"] != 0){
            this.create_apple_with_location(new_location);
            this.apple_eaten = false;
            return ""
        }
        this.create_apple_random();  
        this.apple_eaten = false; 
            return ""    
    
        

    }
    create_apple_with_location(new_location) {


        this.my_helper_class.draw_cube(new_location["row"],new_location["column"],true,"#F9A825");
        
        this.apple_location = new_location
    }
    create_apple_random() {
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
        this.my_helper_class.draw_cube(random_x,random_y,true,"#F9A825");
        
        this.apple_location = {"row": random_x, "column":random_y}
    
    }

    startGame() {
        this.init();
        this.is_game_over = false;
        this.my_helper_class.start_game_real();
    }
    pauseGame(){
        
    }
    // resumeGame()
    // restartGame()

}






// switch bewtwen real and computer
var my_class = new my_helper_class()
my_class.start_game_compute_until_apple();
