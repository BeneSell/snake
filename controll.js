



// get data from form field
var my_form = document.getElementsByClassName("snake_settings")[0];
var settings = my_form.querySelectorAll(".settings")

console.log(settings);

for (var i = 0; i < settings.length; i++) {
    var temp_value = settings[i].value;
    console.log(temp_value);
}


// switch bewtwen real and computer
var my_class = new my_helper_class()
my_class.start_game_computer();