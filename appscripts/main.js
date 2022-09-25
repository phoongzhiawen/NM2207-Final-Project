// main.js

console.log(`yo`);

// Div where we will put our Raphael paper in the header and body
var header = document.getElementById("header")
var centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var headerpaper = new Raphael(header);
var paper = new Raphael(centerDiv);
paper.put=function(gobj){paper.canvas.appendChild(gobj.node)}

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

//---------------------------------------------------------------------------------------
//common variables
var numrow =10
var numcol =10
var pxWidth= 20	
var pxHeight = 20
var gametype
var x 
var y
var game
var togglevalue
var block =[]
var speed
var speedSlider = document.getElementById("speedSlider")
var speedvalue = document.getElementById("speedvalue")
var sizeSlider = document.getElementById("sizeSlider")
var sizevalue = document.getElementById("sizevalue")

//tetris variables
var blocktype = 4;
var rotation = 0;
var score = 0
var scoreText
var startButton

//mapping game variables
var loadTime
var loadTimeText
var timer
var numImageSq = 5 //number of squares to be mapped in the mapping game


//sounds
let sn_rowClear = new Audio("resources/sn_row_cleared.wav");
let sn_positioned = new Audio("resources/sn_positioned.mp3");
let sn_success = new Audio("resources/sn_success.wav");
let sn_fail = new Audio("resources/sn_fail.wav")
let sn_bgm = new Audio("resources/bgm.mp3")


//---------------------------------------------------------------------------------------
//styling the title
var title = headerpaper.text(headerpaper.width/2,-100,"GAME WITH ME!").attr({
	"font-family" : 'Luckiest Guy',
	"font-size" : 75
})
title.animate({"y": headerpaper.height/3},1000,"bounce")


//---------------------------------------------------------------------------------------
// styling the commentator at the bottom 
// a smiley face ripped from homework_05
var footer = document.getElementById("footer")
var footerPaper = new Raphael(footer)
var dimX = footerPaper.width;
var dimY = footerPaper.height;

var bg = footerPaper.rect(0, 0, dimX/2, dimY/2).attr({
	"stroke-width" : 0,
	"fill" : '#FFD166'
})

var mouth = footerPaper.path(`M 10,${2*dimY/3} Q 50,${4*dimY/5} 90,${2*dimY/3}`).attr({
	"stroke-width" :10,
	"stroke" : "red",
	"stroke-linecap" : "round"
})

var lefteye = footerPaper.ellipse(30, dimY/4, 10,20).attr({
	"fill" : "lightblue",
	"stroke" : "#000"
})
var righteye = footerPaper.ellipse(70, dimY/4, 10,20).attr({
	"fill" : "lightblue",
	"stroke" : "#000"
})
var textbox = footerPaper.text(150,70,"CHOOSE A GAME!").attr({
	"font-family" : 'Luckiest Guy',
	"font-size" : 30,
	"text-anchor" : "start"
})

//---------------------------------------------------------------------------------------INITIALISING THINGS-----------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//a mainmenu button that reinitialises the main menu with mainMenu()
var mainMenuButt = headerpaper.text(7*headerpaper.width/8,10,"MAINMENU").attr({
	"font-family" : 'Luckiest Guy',
	"font-size" :20
})	
mainMenuButt.node.addEventListener("mouseenter",function(ev){		//when mouse hovers over text, change color of text
	mainMenuButt.attr({"fill" : "#06D6A0"})
})
mainMenuButt.node.addEventListener("mouseleave",function(ev){
	mainMenuButt.attr({"fill" : "black"})
})
mainMenuButt.node.addEventListener("click",function(ev){
	mainMenu()
})


//---------------------------------------------------------------------------------------
//a pause button to stop and start the game midway,
var pause //image shown when paused
var pauseButton = function(ev){
	togglevalue = "stop"
	startButton = paper.text(50,50,`START`).attr({
		"font-family" : 'Luckiest Guy',
		"font-size" :25,
		"text-anchor" : "start"

	})

	startButton.node.addEventListener("click",function(ev){
		 if (togglevalue === "stop"){
	     	startButton.attr({"text" : "STOP"})
	     	togglevalue = "start"
	     	if (gametype==="mappinggame"){			//timer only necessary for mapping game
	     		loadTime=Date.now()
     			timer = setInterval(time,20)
	     	}
     		drop = setInterval(moveDown, speed)
     		pause.remove()
    	} else { 
        	startButton.attr({"text" : "START"})
       		togglevalue = "stop"
        	clearInterval(drop)
        	pause = paper.image("resources/waiting.gif", pWidth/2-300, 0,600,400).attr({"opacity": 0.95})
    	}
	})
	startButton.node.addEventListener("mouseenter",function(ev){
		startButton.attr({"fill" : "#06D6A0"})
	})
	startButton.node.addEventListener("mouseleave",function(ev){
		startButton.attr({"fill" : "black"})
	})
}

//---------------------------------------------------------------------------------------
//sound control buttons, tp start and pause bgm
var soundOn = false
var soundButton = headerpaper.text(7*headerpaper.width/8,30,"SOUND ON").attr({
	"font-family" : 'Luckiest Guy',
	"font-size" :20
})	
soundButton.node.addEventListener("mouseenter",function(ev){
	soundButton.attr({"fill" : "#06D6A0"})
})
soundButton.node.addEventListener("mouseleave",function(ev){
	soundButton.attr({"fill" : "black"})
})
soundButton.node.addEventListener("click",function(ev){
	if (soundOn === false){
		sn_bgm.play()
		soundButton.attr({"text" : "SOUND OFF"})
		sn_bgm.volume=0.5
		sn_bgm.loop=true
		soundOn = true
	} else {
		sn_bgm.pause()
		soundButton.attr({"text" : "SOUND ON"})
		soundOn = false
	}
})

//---------------------------------------------------------------------------------------
//main menu initialisation function, to put in game choices and the commentator asking you to choose your game
var mainMenu = function(){
	paper.clear()
	title.attr({
		"y" : -100
	})
	title.animate({"y": headerpaper.height/3},1000,"bounce")

	//players choice of game at the main menu page
	var tetrisChoice = paper.text(pWidth/5,350,"TETRIS").attr({
		"font-family" : 'Luckiest Guy',
		"font-size" : 50,
		"text-anchor" : "start"
	})
	paper.image("resources/tetris.gif", pWidth/5, 10,200,300);
	tetrisChoice.node.addEventListener("mouseenter",function(ev){		//hovering effect
		tetrisChoice.attr({"fill" : "#06D6A0"})
	})
	tetrisChoice.node.addEventListener("mouseleave",function(ev){
		tetrisChoice.attr({"fill" : "black"})
	})
	tetrisChoice.node.addEventListener("click", function(ev){
		tetrisRestart()
	})


	var mappingChoice = paper.text(3*pWidth/5,350,"MAPPING GAME").attr({
		"font-family" : 'Luckiest Guy',
		"font-size" : 50,
		"text-anchor" : "start"
	})
	paper.image("resources/mapping.gif",pWidth/2, 10,700,300);
	mappingChoice.node.addEventListener("mouseenter",function(ev){		//hovering effect
		mappingChoice.attr({"fill" : "#06D6A0"})
	})
	mappingChoice.node.addEventListener("mouseleave",function(ev){
		mappingChoice.attr({"fill" : "black"})
	})
	mappingChoice.node.addEventListener("click", function(ev){
		mappingGameRestart()
	})

	textbox.attr({
		"font-size" : 30,
		"text" : "CHOOSE A GAME!"
	})
}


//---------------------------------------------------------------------------------------
//a restart button function that draws a restart button when the game is over
var restartButton = function(ev){
	var restart = paper.text(pWidth/4,350,"RESTART").attr({
		"fill" : "#FFD166",
		"font-family" : 'Luckiest Guy',
		"font-size" : 50
	})
	restart.node.addEventListener("mouseenter",function(ev){		//hovering effect
		restart.attr({"fill" : "#06D6A0"})
	})
	restart.node.addEventListener("mouseleave",function(ev){
		restart.attr({"fill" : "#FFD166"})
	})
	restart.node.addEventListener("click", function(ev){
		if (gametype==="tetrisgame") {tetrisRestart()}
		if (gametype==="mappinggame") {mappingGameRestart()}
	})
}

//---------------------------------------------------------------------------------------
//create a function that draws a grid array, indexed by rows and columns, eg grid[3][0]
var baseGrid = function(xpos){
	var cnt = 0
	var cnt1 = 0
	var grid = []
	while (cnt<numrow){
		grid[cnt] = []
		while (cnt1<numcol){
			grid[cnt][cnt1] = paper.rect(xpos+cnt1*pxWidth , cnt*pxHeight,pxWidth,pxHeight).attr({ 	//create pixel bg
				"fill" : "#5c5c8a",
				"stroke" : "#33334d",
				"stroke-width" : 3
			})	
			grid[cnt][cnt1].ypos = cnt1
			grid[cnt][cnt1].xpos = cnt
			grid[cnt][cnt1].space = "empty" //set the state of the squares
			grid[cnt][cnt1].color = "#5c5c8a"
			cnt1++
		}
	cnt1=0
	cnt++
	}

	//create a border to set the state of these squares as occupied
	var i = 0 
	while (i<numrow){
		grid[i][0].attr({"fill":"black"})
		grid[i][0].space = "occupied"

		grid[i][numcol-1].attr({"fill":"black"})
		grid[i][numcol-1].space = "occupied"
		i++
	}

	i=0
	while (i<numcol){
		grid[numrow-1][i].attr({"fill":"black"})
		grid[numrow-1][i].space = "occupied"

		grid[0][i].attr({"fill":"black"})
		grid[0][i].space = "occupied"
		i++
	}

	return grid
}

//---------------------------------------------------------------------------------------
//function to initialise games, to set up the base grids and starting posis
var mappingGameInit = function(){
	x = 1
	y = Math.floor(numcol/2)
	numPlacedSq = 0
	pauseButton()
	loadTimeText = paper.text(50,100,`Time taken: 0`).attr({
		"font-family" : 'Luckiest Guy',
		"font-size" :20,
		"text-anchor" : "start"
	})
	
	obj = {
		grid : baseGrid(pWidth/2-(numcol*pxWidth)),
		grid2 : baseGrid(pWidth/2+pxWidth),
	}
	var randomX
	var randomY
	i = 0
	while (i<numImageSq){
		randomX = 3 + Math.floor((numrow-4)*Math.random())
		randomY = 1 + Math.floor((numcol-2)*Math.random())
		obj.grid2[randomX][randomY].attr({"fill":"black"})
		obj.grid2[randomX][randomY].space = "occupied"
		i++
	}
	gametype = "mappinggame"
	gameOver = "true"
	return obj
}

var tetrisInit = function(){
	numrow = 20
	numcol = 12
	x = 1
	y = Math.floor(numcol/2)
	blocktype = Math.floor(Math.random()*7);
	rotation = Math.floor(Math.random()*4);

	pauseButton()
	score=0
	scoreText = paper.text(50,100,`Score: ${score}`).attr({
		"font-family" : 'Luckiest Guy',
		"font-size" :20,
		"text-anchor" : "start"
	})
	

	obj = {
		grid : baseGrid((pWidth-(numcol*pxWidth))/2)	//centralise the grid
	}
	gametype = "tetrisgame"
	return obj
}

//for tetris game, to choose block type and rotation
var blockfunction = function(a){
	var i = 0 
	while (i<a.length){
		blockobj = [grid[a[0]][a[1]] , grid[a[2]][a[3]] , grid[a[4]][a[5]] , grid[a[6]][a[7]]] 	//the function calls the specific rotation of the tetris blocks by grid [blocktype [rotation] ]
		i++
	}
	return blockobj
}


//---------------------------------------------------------------------------------------ANIMATING THINGS-----------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//the game starts off with the mainmenu page
mainMenu()
var state = "move"

speedSlider.addEventListener("input",function(ev){
	speed = speedSlider.value
	speedvalue.innerHTML = 24-speed/50
})

sizeSlider.addEventListener("input",function(ev){
	numcol = sizeSlider.value
	numrow = sizeSlider.value
	numImageSq = sizeSlider.value-5
	sizevalue.innerHTML = numrow
})



//draw function to move the block	
//to draw means to change the color of the obj
var draw = function() {
	if (gametype==="mappinggame"){block=[grid[x][y]]}

	if (gametype==="tetrisgame"){		//store the rotated shape of each tetris block in an array
		var TBlock = [		
		[x, y, x, y+1, x, y+2, x+1, y+1],
		[x, y, x+1, y, x+2, y, x+1, y+1],
		[x+1, y, x+1, y+1, x+1, y+2, x, y+1],
		[x+2, y+1, x+1, y+1, x, y+1, x+1, y]
		]

		var L1Block = [
		[x+1, y, x+1, y+1, x+1, y+2, x, y+2],
		[x, y, x, y+1, x+1, y+1, x+2, y+1],
		[x, y, x+1, y, x, y+1, x, y+2],
		[x, y, x+1, y, x+2, y, x+2, y+1]
		]

		var L2Block = [
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+2, y, x, y+1],
		[x, y, x, y+1, x, y+2, x+1, y+2],
		[x, y+1, x+1, y+1, x+2, y+1, x+2, y]
		]

		var IBlock = [
		[x, y, x, y+1, x, y+2, x, y+3],
		[x, y, x+1, y, x+2, y, x+3, y],
		[x, y, x, y+1, x, y+2, x, y+3],
		[x, y, x+1, y, x+2, y, x+3, y]
		]

		var Z1Block = [
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y+1, x+1, y+1, x+1, y, x+2, y],
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y+1, x+1, y+1, x+1, y, x+2, y]
		]

		var Z2Block = [
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x+1, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		]

		var OBlock = [
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1]
		]

		blockArray = [TBlock,L1Block,L2Block,IBlock,Z1Block,Z2Block,OBlock]		//different tetris block types
		chosenBlock = blockArray[blocktype][rotation]		//to choose the specific rotation of different tetris blocks

		block = blockfunction(chosenBlock)
	}

	// make the drawn tetris block orange color
	var i = 0
	while (i < block.length) {
		block[i].attr({
	  	"stroke" : "#cc6600",
		"stroke-width" : 3,
		"fill" : "#ff8000"
	 	})
		i++
	}
}


//undraw function to clear the blocks. ie change it back to the bg color (a repeat of the draw function but reversing color changes)
var undraw = function() {
	if (gametype==="mappinggame"){block=[grid[x][y]]}

	if (gametype==="tetrisgame"){
		var TBlock = [
		[x, y, x, y+1, x, y+2, x+1, y+1],
		[x, y, x+1, y, x+2, y, x+1, y+1],
		[x+1, y, x+1, y+1, x+1, y+2, x, y+1],
		[x+2, y+1, x+1, y+1, x, y+1, x+1, y]
		]

		var L1Block = [
		[x+1, y, x+1, y+1, x+1, y+2, x, y+2],
		[x, y, x, y+1, x+1, y+1, x+2, y+1],
		[x, y, x+1, y, x, y+1, x, y+2],
		[x, y, x+1, y, x+2, y, x+2, y+1]
		]

		var L2Block = [
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+2, y, x, y+1],
		[x, y, x, y+1, x, y+2, x+1, y+2],
		[x, y+1, x+1, y+1, x+2, y+1, x+2, y]
		]

		var IBlock = [
		[x, y, x, y+1, x, y+2, x, y+3],
		[x, y, x+1, y, x+2, y, x+3, y],
		[x, y, x, y+1, x, y+2, x, y+3],
		[x, y, x+1, y, x+2, y, x+3, y]
		]

		var Z1Block = [
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y+1, x+1, y+1, x+1, y, x+2, y],
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y+1, x+1, y+1, x+1, y, x+2, y]
		]

		var Z2Block = [
		[x, y, x, y+1, x+1, y+1, x+1, y+2],
		[x+1, y, x, y+1, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		[x, y, x+1, y, x+1, y+1, x+1, y+2],
		]

		var OBlock = [
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1],
		[x, y, x, y+1, x+1, y, x+1, y+1]
		]

		blockArray = [TBlock,L1Block,L2Block,IBlock,Z1Block,Z2Block,OBlock]
		chosenBlock = blockArray[blocktype][rotation]

		block = blockfunction(chosenBlock)
	}

	//change back to blue color
	var i = 0
	while (i < block.length) {
	  block[i].attr({
	  	"fill" : "#5c5c8a",
		"stroke" : "#33334d",
		"stroke-width" : 3
	  })
	  i++
	}
}

//---------------------------------------------------------------------------------------
draw() //draws the blocks first

//---------------------------------------------------------------------------------------
//a separate function to call a new setinterval function at a shorter framerate
var time = function(){
		loadTimeText.attr({"text" : `Time taken: ${(Date.now()- loadTime)/1000}`})
}

//---------------------------------------------------------------------------------------
//each time the block changes posi, it is done by undrawing the block in the current x and y pos, changing the x and y value according to user input, and drawing the block again 
var moveDown = function(){
	undraw()
	state="move"
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos+1][block[i].ypos].space === "occupied") {	//if blocks below are occupied
			state="stop";
		}
		i++
	}
	if (state==="move") {
		x+=1
	}
	draw()
	if (state==="stop"){
		stop()}
}

//tracks the number of times player has stopped a square either when square touches bottom or when player presses spacebar
var numPlacedSq = 0 

// stop function to stop blocks from falling anymore, and to call the draw function again, stop setinterval when the block reaches the bottom line OR when the squares below are occupied
var stop = function(){ 
	var i = 0
	while (i < block.length) {
		grid[block[i].xpos][block[i].ypos].space = "occupied"
		i++
	}
	numPlacedSq++
	x=1
	y=Math.floor(numcol/2)
	if (gametype==="mappinggame"){mappinggameOver()}
	if (gametype==="tetrisgame"){
		blocktype = Math.floor(blockArray.length*Math.random())
		checkRowisFilled()
		draw()
		tetrisGameOver()
	}
	sn_positioned.play()
}


var moveRight = function(){
	undraw()
	state="move"
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos][block[i].ypos+1].space === "occupied") {	//if blocks on right are occupied
			state="stop"
		}
		i++
	}	
	if (state==="move") {
		y+=1
	} else moveDown()
	draw()
}

var moveLeft = function(){
	undraw()
	state="move"
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos][block[i].ypos-1].space === "occupied") {	//if blocks on left are occupied
			state="stop"
		}
		i++
	}
	if (state==="move") {
		y-=1
	} else moveDown()
	draw()
}

var rotate = function(){
	undraw()
	rotation++
	if(rotation===4){rotation=0}
	// console.log(rotation)
	draw()
}


//when grid2[][].state=="empty" , but grid[][].state=="occupied", game over but lose
//when all grid2[][].state==grid[][].state, game over but win
var gameOver
var mappinggameOver = function(){
	var cnt=0
	var cnt1=0
	while (cnt<numrow){
		while (cnt1<numcol){ 
			if (grid2[cnt][cnt1].space=="empty" && grid[cnt][cnt1].space=="occupied"){
	        	gameOver = "false"
	        	// console.log(gameOver + " check")
	        	break
	        } 
	        // else {console.log(gameOver + " check")}
	        cnt1++
   		} 
   		if (gameOver=="false"){break}
		cnt1 = 0
		cnt++
	}

	if (gameOver == "false"){
		paper.image("resources/toobad.gif", 0, 0,pWidth,pHeight);
		clearInterval(drop)
		mouth.animate({"path" : `M 10,${2*dimY/3} Q 50,${2*dimY/5} 90,${2*dimY/3}`},1000,"bounce")	//sad face
		textbox.attr({
			"text" : "you failed...Try again?",
			"font-size" : 50
		})
		sn_fail.play()
		restartButton()
		paper.text(pWidth/4,150,`Time taken: ${(Date.now()- loadTime)/1000}`).attr({	//display timetaken
			"fill" : "#FFD166",
			"font-family" : 'Luckiest Guy',
			"font-size" : 50
		})
		clearInterval(timer)
	}
	if (numPlacedSq===numImageSq && gameOver !== "false"){
		paper.image("resources/congrats.gif", 0, 0,pWidth,pHeight);
		clearInterval(drop)
		mouth.animate({"path" : `M 10,${dimY/2} Q 50,${4*dimY/5} 90,${dimY/2}`},1000,"bounce")	//happy face
		textbox.attr({
		"text" : "CONGRATULATIONS!!!!\nWanna play again?",
		"font-size" : 50})
		sn_success.play()
		restartButton()
		paper.text(pWidth/4,150,`Time taken: ${(Date.now()- loadTime)/1000}`).attr({	//display timetaken
			"fill" : "#FFD166",
			"font-family" : 'Luckiest Guy',
			"font-size" : 50
		})
		clearInterval(timer)
	}

}

var mappingGameRestart = function(){
	togglevalue = "stop"
	paper.clear()
	game = mappingGameInit()
	grid = game.grid
	grid2 = game.grid2
	draw()
	mouth.animate({"path" : `M 10,${2*dimY/3} Q 50,${4*dimY/5} 90,${2*dimY/3}`},1000,"bounce")
	textbox.attr({
		"text" : "INSTRUCTIONS: Move blocks to match the left grid to the right!\nLeft Arrow Key: Move Left \nRight Arrow Key: Move Right\nDown Arrow Key: Move Down\nSpace Bar: Lock block in position",
		"font-size" : 20,
	})
	loadTimeText.attr({"text" : `Time taken: 0`})
}

var tetrisGameOver = function(){
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos][block[i].ypos].space==="occupied" && grid[block[i].xpos-1][block[i].ypos].space==="occupied"){
		paper.image("resources/toobad.gif", 0, 0,pWidth,pHeight);
		mouth.animate({"path" : `M 10,${2*dimY/3} Q 50,${2*dimY/5} 90,${2*dimY/3}`},1000,"bounce")	//sad face
		textbox.attr({
			"text" : "you failed...Try again?",
			"font-size" : 50,
		})

		clearInterval(drop)
		sn_fail.play()
		paper.text(pWidth/4,150,`Score: ${score}`).attr({	//dislay score
			"fill" : "#FFD166",
			"font-family" : 'Luckiest Guy',
			"font-size" : 50
		})
		restartButton()
		return}
		i++
	}
}
var tetrisRestart = function(){
	togglevalue = "stop"
	paper.clear()
	game = tetrisInit()
	grid = game.grid
	grid2 = game.grid2
	draw()
	mouth.animate({"path" : `M 10,${2*dimY/3} Q 50,${4*dimY/5} 90,${2*dimY/3}`},1000,"bounce")
	textbox.attr({
		"text" : "INSTRUCTIONS: Position blocks to complete rows and clear them!\nUp Arrow Key: Rotate\nLeft Arrow Key: Move Left \nRight Arrow Key: Move Right\nDown Arrow Key: Move Down",
		"font-size" : 20
	})
}

 //when row is all occupied, clear that row, (change back the bg colors and reset states), and bring all the rows above down by copying the attributes down
 // function is called each time a block sets down (in stop())
var rowClear = function(row) {
	i=0
	while (i<numcol){
		if (grid[row][i].space!="occupied"){	//if the entire row is not cleared, break out of function
			return}
			// console.log("not full")
		i++
	} 
	sn_rowClear.play()
	// scoring function and shifting rows down function
	i=1
	while (i<numcol-1){
		grid[row][i].space = "empty"	//set state of entire row that was cleared to empty
		grid[row][i].attr({ 			//set color of entire row to blue
			"fill" : "#5c5c8a",
			"stroke" : "#33334d",
		})
		i++
	} 
	var j
	j = row
	while (j>1){
		i = 0 
		while (i<numcol){
			grid[j][i].space = grid[j-1][i].space 		//set state of entire row to the state of the squares directly above it
			grid[j][i].attr({
				"fill" : grid[j-1][i].attr("fill"),		//set color of entire row to the colors of the squares directly above it
				"stroke" : grid[j-1][i].attr("stroke"),
			})
		i++
		}
		i = 0
		j--
	}
	score++
	speed-=10
	if (speed<=100){speed=100}
	scoreText.attr({"text" : `Score: ${score}`})
} 

var checkRowisFilled = function(){
	var cnt = 1
	while (cnt<numrow-1){		//check if any row within the entire grid is filled
		rowClear(cnt)
		// console.log("checking row " + cnt)
		cnt++
	}
}

//---------------------------------------------------------------------------------------
// User Interface things ---------------------------------------

var drop
// Keystrokes -------------------------------------------------
document.addEventListener("keydown", function(ev){
	ev.preventDefault()
	if (togglevalue=="start"){
		if(ev.keyCode == 40){ 	//down
			// console.log("you pressed the down key")
			moveDown()
		}

		if(ev.keyCode == 39){ 	//right
			// console.log("you pressed the right key")
			moveRight()
		}

		if(ev.keyCode == 37){ 	//left
			// console.log("you pressed the left key")
			moveLeft()
		}

		if (gametype==="tetrisgame"){
			if(ev.keyCode == 38){ 	//up
				// console.log("you pressed the up key")
				rotate()
			}
		}

		if (gametype==="mappinggame"){
			if(ev.keyCode == 32){ 	//up
				// console.log("you pressed the spacebar")
				stop()	
			}
		}
	}
})
