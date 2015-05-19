// script.js
$(document).ready(function() {
  
  var deck = new Array();
  var currcard = null;
  
  Init();
  Draw();

  // EVENT HANDLER
  $("#clickme").click(function() {
    
    var useranswer = $("#answer").val();
    $("#status").html(useranswer);
    
    if (currcard.answertext == useranswer) {
		
	$(function() {
		$('<div>¨Great!</div>')
		.insertAfter('#clickme')
		.delay(2000)
		.fadeOut(function() {
			$(this).remove(); 
		});
	});
     
      ClearText();
      Draw(); // GET the next card
    }
    else {
      $(function() {
		$('<div>¨Try again!</div>')
		.insertAfter('#clickme')
		.delay(3000)
		.fadeOut(function() {
				$(this).remove(); 
			});
		});
      ClearText();
    }    
  });
  
  function ClearText() {
    $("#answer").val("");
    $("#status").html("X");
  }
  
  
  function Init() {
    
    var card1 = {
      card: 1,
      picture : "bugsbunny.jpg",
      answertext : "Bugs Bunny"
    };
    
    var card2 = {
      card: 2,
      picture : "bart.jpg",
      answertext : "Bart"
    };
    
    deck.push(card1);
    deck.push(card2);
    
  }
  
  function Draw() {
    currcard  =  deck.shift();
    $("#a").attr("src", currcard.picture);
  }
  
  
  
});