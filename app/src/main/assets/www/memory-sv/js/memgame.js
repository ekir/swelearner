(function () {

	var cwidth = 450;
	var cheight = 550;
	var ctx, canvas;
	var firstpick = true;
	var firstcard = -1;
	var secondcard;
	var deck = [ ];
	var firstsx = 20;
	var firstsy = 20;
	var margin = 30;
	var cardwidth = 100;
	var cardheight = 100;
	var matched = false;
	var starttime = 0; //to start counting time, !make as logical value for future!
	var count = 0; //counting scores
	var timeoutflipback;
	var timeoutprogress = null;
	var progress = null;

    //I want randomly chane in background every time
    /*document.body.style.backgroundImage = 'url(' + [
        'bg.jpg',
        'bg2.jpg'
    ][Math.floor(Math.random() * 2)] + ')';*/

	var pairs = [
			
				["img/apple.png","img/apple-txt.png"],
				["img/cherry.png","img/cherry-txt.png"],
				["img/pear.png","img/pear-txt.png"],
				["img/orange.png","img/orange-txt.png"],
				["img/strawberry.png","img/strawberry-txt.png"],
				["img/grapes.png","img/grapes-txt.png"]
		];

    var aud =["audio/apple.mp3","audio/cherry.mp3","audio/pear.mp3","audio/apelsin.mp3","audio/jordgubbe.mp3","audio/vindruva.mp3"];
	/*
	deck holds info on the cards: the location and dimensions, the src for the picture
		and identifying info
		the info is set using the array of arrays in the makedeck function
	*/
	
	function Card(sx, sy, swidth, sheight, img, info) {
		this.sx = sx;
		this.sy = sy;
		this.swidth = swidth;
		this.sheight = sheight;
		this.info = info;
		this.img = img;
		this.draw = drawback;
	}

	//generate deck of cards 6 pairs
	function makedeck() {
	
		var i;
		var acard;
		var bcard;
		var dcard;
		var pica;
		var picb;
		var cx = firstsx;
		var cy = firstsy;
	
			for ( i = 0; i < pairs.length; i++ ) {
				
				if (cx > 350) {
				  cx = 20;
				  cy = cy + 2*cardheight + 2*margin;
				}

				pica = new Image();
				pica.src = pairs[i][0];
				acard = new Card(cx, cy, cardwidth, cardheight, pica, i);
				deck.push(acard);


				picb = new Image();
				picb.src = pairs[i][1];
				bcard = new Card(cx, cy + margin + cardheight, cardwidth, cardheight, picb, i);
				deck.push(bcard);

				cx = cx + cardwidth + margin;

				bcard.draw();
				acard.draw();
			}
	}

	function shuffle() {
	//coded to resemble how I shuffled cards when playing concentration
	//swaps the changing information: the img and the info indicating the matching
	
		var i, k;
		var holderinfo;
		var holderimg;
		var dl = deck.length;
		var nt;

			for (nt = 0; nt < dl * 3 ; nt++)
			{  
				//do the swap 3 times deck.length times
				i = Math.floor(Math.random()*dl);
				k = Math.floor(Math.random()*dl);

				holderinfo = deck[i].info;
				holderimg = deck[i].img;

				deck[i].info = deck[k].info;
				deck[i].img = deck[k].img;

				deck[k].info = holderinfo;
				deck[k].img = holderimg;
			
			}
	}

	function drawback() {
	
		if (starttime === 1) {
		   ctx.clearRect(this.sx,this.sy,this.swidth,this.sheight);
		}
		
		var backcardimg = new Image();
		backcardimg.src = "img/Sweden-Flag.png";
		ctx.drawImage(backcardimg,this.sx,this.sy,this.swidth,this.sheight); 
	}

	function choose(ev) {

		//after first click time starts
		if (starttime === 0) { 
			startProgress();
		} 

		var out;
		var mx;
		var my;

		if (ev.layerX ||  ev.layerX == 0) { // Firefox
				mx= ev.layerX;
				my = ev.layerY;
		} 
	
		else if (ev.offsetX || ev.offsetX == 0) { // Opera
				mx = ev.offsetX;
				my = ev.offsetY;
		}

		var i,
			card;

		for (i=0; i<deck.length; i++)
		{
			card = deck[i];
				if (card.sx >= 0)  //this is the way to avoid checking for clicking on this space

				if ((mx>card.sx)&&(mx<card.sx+card.swidth)&&(my>card.sy)&&(my<card.sy+card.sheight)) {
					//check that this isn't clicking on first card
					if ((firstpick) || (i!=firstcard)) {
						break;
					}
				}
		}

		if (i<deck.length) {  //clicked on a card

			if (firstpick) {
				firstcard = i;
				firstpick = false;
				ctx.clearRect(card.sx,card.sy,card.swidth,card.sheight);
				ctx.drawImage(card.img,card.sx,card.sy,card.swidth,card.sheight); 
				starttime = 1;
				console.log(firstcard+"info");
			}

			else {
				secondcard = i;
				console.log(i+"info2");
				ctx.clearRect(card.sx,card.sy,card.swidth,card.sheight);
				ctx.drawImage(card.img,card.sx,card.sy,card.swidth,card.sheight); 
				if ( card.info == deck[firstcard].info ) {


                    var audio = new Audio();
                    audio.src=aud[card.info];
                    audio.play();
                    matched = true;
                    count++;
					document.tablescore.score.value = count;



                }

				else {
					matched = false;
				}
			
				firstpick = true;
				timeoutflipback = setTimeout(flipback,300);
			}
		}

	}

  /*  function telling(){
        if(matched){

        }

    }*/

	function flipback() {
		var card;

		if (!matched) {

			deck[firstcard].draw();
			deck[secondcard].draw();

		}

		else {
            //??????????????????????????

			ctx.clearRect(deck[secondcard].sx,deck[secondcard].sy,deck[secondcard].swidth,deck[secondcard].sheight);
			ctx.clearRect(deck[firstcard].sx,deck[firstcard].sy,deck[firstcard].swidth,deck[firstcard].sheight);
			deck[secondcard].sx = -1;
			deck[firstcard].sx = -1;

		}
		
		if (count === 6) {
			canvas.removeEventListener('click',choose,false);  
			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
			wonGame();
			clearProgress();
		}
	}
	
	$(function createProgress() {
		$("#progressbar").progressbar({ value: 0 });

    });
    
	function startProgress() {
		setTimeout(updateProgress, 1000);
	}

    function updateProgress() {
	
			progress = $("#progressbar").progressbar("option","value");
				if (progress < 100) {
					$("#progressbar").progressbar("option", "value", progress + 10);
					timeoutprogress = setTimeout(updateProgress, 3500);
				}

				if (progress == 100 ) {
					canvas.removeEventListener('click',choose,false);  
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
					lostGame();
				}

	}

	function clearProgress() {
		clearTimeout(timeoutprogress);
		starttime = 0;
		progress = 0;
		count = 0;
		firstpick = true;
		firstcard = -1;
		deck = [ ];
		matched = false;

		$("#progressbar").progressbar({ value: 0 });
	}



	function wonGame() {
		$("#msg").html('<span>Bra jobbat!</span>').fadeIn(1000);
        var audio = new Audio();
        audio.src='audio/applause-2.mp3';
        audio.play();
	}	 

	function lostGame() {
		$("#msg").html('<span>Ooops! Du har förlorat matchen!</span>').fadeIn(1000);

	}

	function init() {
		
		ctx = document.getElementById('canvas').getContext('2d'); 
		canvas = document.getElementById('canvas');
		canvas.addEventListener('click',choose,false);
		$("#msg").empty();
			makedeck();
			shuffle();	
    }
	
	$('#tablescore input[type="button"]').click(function () {
		this.form.reset();
		clearProgress();
		init();

	});

}());
