/**
 * Created by lagerhult on 2015-04-23.
 */
var IMAGE_WIDTH = 49, IMAGE_HEIGHT = 55, IMAGES_PER_ROW = 6;
var WORDLIST = ["tråkig", "hoppa", "leka", "promenad"];
var word = "";
var LETTERS_LEFT = 0;

function Start_new_game(){
    //select a word
    var rand = Math.floor(Math.random() * (WORDLIST.length));
    word = WORDLIST[rand];

    //replace å,ä,ö with 1,2,3
    word = word.replace("å", "1");
    word = word.replace("ä", "2");
    word = word.replace("ö", "3");

    LETTERS_LEFT = word.length;

    //initialize everything
    Populate_letter_container();
    Create_answer_field(word.length);

    //restore water level
    $('#water').height("100%");

    //set fish position
    var margin_top = ($('#water').height() / 2) - 30;
    $('.fish').css("margin-top", margin_top);
    $('.fish').css('-webkit-animation-play-state',  'running');
    $(".fish").animate({opacity: 1}, "fast");

    //remove game over letters
    $('.game_over_letter').remove();

    $('body').off('click', '.individual_letter_container', Letter_click);
    $('body').on('click', '.individual_letter_container', Letter_click);

};

//Initializes all the letters
function Populate_letter_container(){
    //remove old letters
    $('.individual_letter_container').remove();
    $('.answer_letter').remove();

    //create new letters
    for(var i=0; i<9; i++){
        var letter = String.fromCharCode(i + 97);
        $('#letters_row1').append('<div class="individual_letter_container" id="'+ letter + '"></div>');
        $('#' + letter).css("background", "url('pictures/" + letter + ".png')");
        $('#' + letter).css("left", i * 60);
    }
    for(var i=9; i<20; i++){
        var letter = String.fromCharCode(i + 97);
        $('#letters_row2').append('<div class="individual_letter_container" id="'+ letter + '"></div>');
        $('#' + letter).css("background", "url('pictures/" + letter + ".png')");
        $('#' + letter).css("left", (i - 9) * 60);
    }
    for(var i=20; i<29; i++){
        var letter;
        if (i == 26)
            letter = '1';
        else  if (i == 27)
            letter = '2';
        else if (i == 28)
            letter = '3';
        else
            letter = String.fromCharCode(i + 97);
        $('#letters_row3').append('<div class="individual_letter_container" id="'+ letter + '"></div>');
        $('#' + letter).css("background", "url('pictures/" + letter + ".png')");
        $('#' + letter).css("left", (i - 20) * 60);
    }

    $(".individual_letter_container").width(IMAGE_WIDTH);
    $(".individual_letter_container").height(IMAGE_HEIGHT);
};

//Initializes the answer container
function Create_answer_field(word_length){
    //remove old answer letters
    $('.answer_letter_container').remove();

    //set length/width of field
    $('#answer_container').width(word_length*(IMAGE_WIDTH + 5/*margin-left*/));
    $('#answer_container').height(IMAGE_HEIGHT + 10/*width or border times 2*/);

    //create letter containers
    for (var i  = 0; i < word_length; i++){
        var elem = '<div class="answer_letter_container" id="answer_nr_' + i + '"></div>';
       // $("#answer_nr_" + i + "").css('position', "relative");
        $("#answer_container").append($(elem));
    }

    //set length/width of each letter container
    $('.answer_letter_container').width(IMAGE_WIDTH);
    $('.answer_letter_container').height(IMAGE_HEIGHT);

};

function Decrease_life(){
    var max_height = $('#image_container').height();
    var current_height = $('#water').height();
    var new_height = current_height - max_height / 10;

    //if we lost
    if (new_height / max_height < 0.2){
        Display_game_over();
    }
     else{
        //set fish position
        $('.fish').animate({ marginTop: (new_height / 2) - 35});

        //update water
        $('#water').animate({ height: new_height});
    }
};

//Show winning screen
function Display_win(){
    $('body').off('click', '.individual_letter_container', Letter_click);
    Display_drop_down_text("Congrats");
};

//Show winning screen
function Display_game_over(){
    $('body').off('click', '.individual_letter_container', Letter_click);

    //kill fish
    $('.fish').css('-webkit-animation-play-state',  'paused');
    $(".fish").animate({opacity: 0}, "slow");

    //update water
    $('#water').delay(500).animate({ height: 0}, "medium");

    Display_drop_down_text("gameover");

    //Show answer
    for (var i  = 0; i < word.length; i++){
        if ($('#answer_nr_' + i).children().length == 0){
            //add black & white version of the letter
            var $elem = $('#a').clone();
            $elem.attr('class', 'answer_letter');
            $elem.css("background", "url('pictures/" + word[i] + "_bw.png')");
            $('#answer_nr_' + i).append($elem);
        }
    }


};

function Display_drop_down_text(text){
    //remove game over letters
    $('.game_over_letter').remove();

    //create game over screen
    for (var i  = 0; i < text.length; i++){
        var id = "game_over" + i;
        $('#game_over').append('<div class="game_over_letter" id="' + id + '"></div>');
        $('#' + id).css("background", "url('pictures/" + text[i] + ".png')");
        $('#' + id).css("left", i * 60);
        //$('#' + id).css("top", - IMAGE_HEIGHT);
    }

    $('.game_over_letter').width(IMAGE_WIDTH);
    $('.game_over_letter').height(IMAGE_HEIGHT);
    $('#game_over').width(IMAGE_HEIGHT * text.length);
    $('#game_over').height(IMAGE_HEIGHT);

    //start animation
    var image_height = $('#image_container').height();
    for (var i  = 0; i < text.length; i++){
        var id = "game_over" + i;
        $('#' + id).delay(i*200).animate({top:image_height/2 - IMAGE_HEIGHT/2}, 1000);
    }
};

function Letter_click(){
    //if letter is clicked
        //restore opacity again
        $( this ).css("opacity",  "1");


        var clicked_letter = $(this).attr('id');

        //if letter is a part of the word, add it to answer, then remove it
        //find all positions of the letter
        var position = -1;
        position = word.indexOf(clicked_letter)

        if (position == -1)
            Decrease_life();

        while (position != -1){
            //clone element and add to answer
            var $elem = $(this).clone();
            $elem.attr('class', 'answer_letter');
            $('#answer_nr_' + position).append($elem);

            //decrease letters left
            LETTERS_LEFT--;

            //search next
            position = word.indexOf(clicked_letter, position + 1);
        }
        //remove from letter
        $(this).remove();

        //if no more letters left
        if (LETTERS_LEFT == 0)
            Display_win();
};
$(document).ready(function(){
    //start new game as soon as water is ready in order to get its height
    $('#water').ready(Start_new_game());


    $(document).on("mouseover", ".individual_letter_container", function() {
        $( this ).css({opacity: 0.5}, "fast");
       /* var $elem = $(this);
        $elem.css("background", "url('pictures/" + $elem.attr("id") + "_bw.png')");*/
    });

    $(document).on("mouseleave", ".individual_letter_container", function() {
        $( this ).css({opacity: 1}, "fast");
        /*var $elem = $(this);
        $elem.css("background", "url('pictures/" + $elem.attr("id") + ".png')");*/
    });


    //new game click
    $('#new_game_button').click(function(){
        Start_new_game();
    });


});
