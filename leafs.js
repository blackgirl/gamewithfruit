// Object Settings contains:
// imgArray — array of all available images
// positionX / positionY — arrays of top / left positions for each img
// speed — speed of motion of every fruit
// mainSpeed — main speed of motion (speed of repeating method fall)
// amount — how many images can be on the page at the same time
// gameTime — how long can you play (10s)
var Settings = {
	imgArray : [
		{ class : "apple", src : "http://www.coppschool.lancsngfl.ac.uk/Classwork/Classwork/Class3/Backgrounds/apple.gif" },
		{ class : "banana", src : "http://www.i2clipart.com/cliparts/b/9/2/b/clipart-bananas-b92b.png" },
		{ class : "pear", src : "http://www.i2clipart.com/cliparts/a/2/a/0/clipart-simple-fruit-pear-a2a0.png" },
		{ class : "", src : "http://www.i2clipart.com/cliparts/a/7/2/b/clipart-pineapple-a72b.png" },
		{ class : "", src : "http://www.i2clipart.com/cliparts/5/2/8/8/clipart-simple-fruit-orange-5288.png" }
	],
	changeImg : 'http://web-bertram.ru/images/icons/4551369402471628.png',
	changeImgX : 'http://openclipart.org/image/800px/svg_to_png/171390/checkErro.png',
	imgWidth : 100,
	gameTime : 10,
	mainSpeed : 50,
	speedStep : 3,
	amount : 7,
	positionY : [],
	positionX : [],
	speed : [],
	bounce : 0,
	bounceWrong : 0,
	juice : '',
	area : document.getElementById( 'fallArea' ),
	getJuice : function() {
		var selectJuice = document.getElementsByTagName( 'input' );
		this.juice = '';

		for ( var i = 0; i < selectJuice.length; i++ ) {
			if ( selectJuice[ i ].type == 'radio' && selectJuice[ i ].checked ) {
					this.juice = selectJuice[ i ].value;
					document.querySelector( '.choice' ).innerHTML = this.juice;
			}
		}
	},
	getRandomImage : function() {
		var n = Math.floor( Math.random() * this.imgArray.length );
		randomImage = this.imgArray[ n ];
		return randomImage;
	},
	setClickFunc : function() {
		var imgs = this.area.getElementsByTagName( 'img' );
		var len = imgs.length;
	    for( var i = 0; i < len; i++ ) {
	    	imgs[ i ].onclick = '';
            if ( imgs[ i ].className == this.juice ) {
				imgs[ i ].onclick = function() {
			            	this.src = Settings.changeImg;
			                Settings.bounce++;
			            };
			} else {
				imgs[ i ].onclick = function() {
			            	this.src = Settings.changeImgX;
			            	Settings.bounceWrong++;
			            }
			}
		}
	},
	writeImages : function() {
		this.area.innerHTML = '';
		for( var i = 0; i < this.amount; i++ ) {
			imageSrc = this.getRandomImage();
			this.area.innerHTML += '<img id="fruit'+ i +'" class="'+ imageSrc.class +'" src="'+ imageSrc.src +'" style="width:'+this.imgWidth+'px">';
		}
		this.setClickFunc();
    }
};

// Object Coords contains methods:
// getFallAreaHeight/Width — defines window height / width;
// getRandomXPos/Speed — generates random falling speed and always new X-position
var Coords = {
	getFallAreaHeight : function() {
	    var D = document.getElementById( 'fallArea' );
	    return Math.max(
	        D.scrollHeight, D.scrollHeight,
	        D.offsetHeight, D.offsetHeight,
	        D.clientHeight, D.clientHeight
	    );
	},
	getFallAreaWidth : function() {
	    var D = document.getElementById( 'fallArea' );
	    return Math.max(
	        D.scrollWidth, D.scrollWidth,
	        D.offsetWidth, D.offsetWidth,
	        D.clientWidth, D.clientWidth
	    ) - Settings.imgWidth;
	},
	getRandomXPos : function() {
		return Math.round( Math.random() * this.getFallAreaWidth());
	},
	getRandomSpeed : function( n ) {
		return Math.random() * n + n;
	}
};

// Object Fall ensures the falling of a fruit-objects
// Method init sets start-coordinates and speed of each fruit-object before they start falling
// Method fall sets:
// random offset for each fruit-object;
// if the fruit-object disappear from the area, shows the object above and changes his X-position and speed;
// set the style.left/top equal to positionX/Y accordingly;
// sets time interval for function's iterations
var Fall = {
	init : function() {
		this.countArea = document.getElementById( 'count' );
		this.getFallAreaHeight = Coords.getFallAreaHeight();
		this.repeatTime = Settings.gameTime;
		this.fallTimer = setInterval( 'Fall.fall()', Settings.mainSpeed );
		this.startPosition();
	},
	clear : function() {
		Fall.fallTimer = 'undefined';
		Fall.repeatTime = Settings.gameTime;
		this.countArea.innerHTML = 'Your score: '+ Settings.bounce*10;
		// 'You squashed '+ Settings.bounce +' fruits right and ' +Settings.bounceWrong+' wrong.';
		document.getElementById( 'right' ).innerHTML += Settings.bounce;
		document.getElementById( 'wrong' ).innerHTML += Settings.bounceWrong;
		document.querySelector('.gameover').style.display = 'block';
		document.querySelector('.wrap-modal').style.display = 'block';
		
		Settings.bounce = 0;
		Settings.bounceWrong = 0;
	},
	endOfGame : function() {

	},
	startPosition : function() {
		for( var i = 0; i < Settings.amount; i++ ) {
			Settings.positionY[ i ] = Math.round( Math.random() * this.getFallAreaHeight ) - this.getFallAreaHeight;
			Settings.speed[ i ] = Coords.getRandomSpeed( Settings.speedStep );
			Settings.positionX[ i ] = Coords.getRandomXPos();
		}
	},
	counter : function() {
		if( this.repeatTime != 0 ) {
			this.repeatTime -= 1;
			this.countArea.innerHTML = 'Time: '+ this.repeatTime;
			var gameTimer = window.setTimeout( 'Fall.counter()', 1000 );
		} else {
			window.clearTimeout( gameTimer );
			window.clearInterval( Fall.fallTimer );
			this.clear();
		}
	},
	fall : function() {
		for( var i = 0; i < Settings.amount; i++ ) {
			var offset = Settings.speed[ i ] * Math.sin( 90 * Math.PI / 180 );
			var fruit = document.getElementById( "fruit" + i );
			Settings.positionY[ i ] += offset;

			if( fruit ){
				if( Settings.positionY[ i ] > this.getFallAreaHeight ) {
					Settings.positionY[ i ] = 0 - 1.5*Settings.imgWidth;
					Settings.positionX[ i ] = Coords.getRandomXPos();
					Settings.speed[ i ] = Coords.getRandomSpeed( Settings.speedStep );
					var random = Settings.getRandomImage();
					fruit.src = random.src;
					fruit.className = random.class;
					Settings.setClickFunc();
				}
				fruit.style.left = Settings.positionX[ i ] + 'px';
				fruit.style.top = Settings.positionY[ i ] + 'px';
			}
		}
	},
	go : function() {
		Fall.init();
		document.getElementById( 'fallArea' ).innerHTML = '';
		Settings.writeImages();
		if( Fall.fallTimer == 'undefined' ) {
			setInterval( 'Fall.fall()', Settings.mainSpeed );
		};
		Fall.counter();
	}
};
document.querySelector( '.again' ).onclick = function() {
	document.querySelector('.gameover').style.display = 'none';
	document.querySelector( '.radio-toolbar' ).style.display = 'block';
};
document.querySelector( '.go' ).onclick = function() {
	Settings.getJuice();
	document.querySelector( '.radio-toolbar' ).style.display = 'none';
	document.querySelector('.modal').style.display = 'block';
};

document.querySelector( '.start' ).onclick = function() {
	document.querySelector( '.wrap-modal' ).style.display = 'none';
	Fall.go();
};