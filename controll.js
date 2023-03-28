var my_class = new my_helper_class();
var is_game_running = false;
var is_game_over_js_magic = null;

const spoilerBtn = document.querySelector('.spoiler_btn');
const spoilerContent = document.querySelector('.spoiler_content');

spoilerBtn.addEventListener('click', function() {
  if (spoilerContent.style.display === 'none') {
    spoilerContent.style.display = 'block';
    spoilerBtn.value = 'Hide Advanced Settings';
  } else {
    spoilerContent.style.display = 'none';
    spoilerBtn.value = 'Advanced Settings';
  }
});
spoilerBtn.click();


function startGame() {

    if(is_game_running == true){
        return;       
    } 
    is_game_running = true;

    
    // var my_class = new my_helper_class()
    var my_form = document.getElementsByClassName("snake_settings")[0];
    var settings = my_form.querySelectorAll(".settings")

    var game_size = parseInt(document.querySelector('#size').value || 11);
    var game_speed = parseInt(document.querySelector('#speed').value || 11);
    var game_skips = parseInt(document.querySelector('#skips').value || 1);
    
    // if game size is not odd, make it odd
    if(game_size % 2 == 0){
        game_size = game_size + 1;
    }

    // get value from radio buttons
    var game_type = document.querySelector('input[name="play"]:checked').value;
    console.log(game_type);
    var game_promise = null;
    switch (game_type) {
        case "1":
            // check if on a mobile device
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                // fokus on the tag with id=direction-input
                var inputElement = document.getElementById("direction-input");
                inputElement.style.visibility = 'visible'; // unhide the input
                inputElement.focus(); // focus on it so keyboard pops
                inputElement.style.visibility = 'hidden'; // hide it again
            }

            game_promise = my_class.start_game_real(game_size, game_speed, game_skips);      
        break;
        case "2":
            game_promise = my_class.start_game_compute_until_apple(game_size, game_speed, game_skips);
        break;
        case "3":
            game_promise = my_class.start_game_computer(game_size, game_speed, game_skips);
        break;
        default:    
        
        break;
    }
    
    game_promise.finally(function(){
        is_game_running = false;
    });
    
};
function stopGame() {
    my_class.act_snake_game.user_has_clicked = true;	
    //my_class.act_snake_game.create_apple()
    my_class.act_snake_game.is_game_over = true;
    
}
function pauseGame() {
    // toggle between true and false 
    my_class.act_snake_game.pause_game = !my_class.act_snake_game.pause_game;
    
}

// var my_class = new my_helper_class()
// my_class.start_game_computer(11,10,5);