// main.js

console.log(`yo`);

// Div where we will put our Raphael paper
var centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(centerDiv);
paper.put=function(gobj){paper.canvas.appendChild(gobj.node)}

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

//-----------------------------------------
var numrow = 20
var numcol = 10
var pxWidth= 15	
var pxHeight = 15
var numImageSq = 5 //sets number of squares needed to be matched in mapping game
var gametype
var x 
var y
var blocktype = 4;
var rotation = 0;
var header = document.getElementById("header")
var score = 0
var loadTime

var bg = paper.rect(0,0,pWidth,pHeight)

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


//function to initialise games, to set up the base grids and starting posis
var mappingGameInit = function(){
	x = 1
	y = Math.floor(numcol/2)
	numPlacedSq = 0
	loadTime = 0
	// header.innerHTML = "Time taken: " + loadTime
	obj = {
		grid : baseGrid(0),
		grid2 : baseGrid((numcol+1)*pxWidth),
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
	x = 1
	y = Math.floor(numcol/2)
	blocktype = Math.floor(Math.random()*7);
	rotation = Math.floor(Math.random()*4);
	score=0
	header.innerHTML = "Score: " + score 
	obj = {
		grid : baseGrid(0)
	}
	gametype = "tetrisgame"
	return obj
}

//for tetris game, to choose block type and rotation
var blockfunction = function(a){
	var i = 0 
	while (i<a.length){
		blockobj = [grid[a[0]][a[1]] , grid[a[2]][a[3]] , grid[a[4]][a[5]] , grid[a[6]][a[7]]] 	//grid [blocktype [rotation] ]
		i++
	}
	return blockobj
}


//animations and stuff--------------------------------
var game  = mappingGameInit()
var grid = game.grid
var grid2 = game.grid2
var block =[]
var state = "move"
var speed = 500;


//draw function to move the block	
//to draw means to change the color of the obj
var draw = function() {
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


//undraw function to clear the blocks. ie change it back to the bg color
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

draw() //draws the blocks first

//each time the block changes posi, it is done by undrawing the block in the current x and y pos, changing the x and y value according to user input, and drawing the block again 
var moveDown = function(){
	undraw()
	state="move"
	// header.innerHTML="Time: " + (Date.now()-loadTime)/1000
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

var numPlacedSq = 0 //number of times player has stopped a square either when sq touches bottom or when player presses spacebar
// stop function to stop blocks from falling anymore, and to call the draw function again 
// stop setinterval when the block reaches the bottom line OR when the squares below are occupied
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
}


var moveRight = function(){
	undraw()
	state="move"
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos][block[i].ypos+1].space === "occupied") {
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
		if (grid[block[i].xpos][block[i].ypos-1].space === "occupied") {
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
		alert("GAMEOVER!")
		mappingGameRestart()
	}
	if (numPlacedSq===numImageSq){
		alert("CONGRATULATIONS!")
		mappingGameRestart()
	}

}

var mappingGameRestart = function(){
	toggle.value = "start"
	togglevalue = "stop"
	clearInterval(drop)
	paper.clear()
	paper.put(bg)
	game = mappingGameInit()
	grid = game.grid
	grid2 = game.grid2
	draw()
}

var tetrisGameOver = function(){
	var i = 0
	while (i < block.length) {
		if (grid[block[i].xpos][block[i].ypos].space==="occupied" && grid[block[i].xpos-1][block[i].ypos].space==="occupied"){
		alert("GAMEOVER!")
		tetrisRestart()}
		i++
	}
}
var tetrisRestart = function(){
	toggle.value = "start"
	togglevalue = "stop"
	clearInterval(drop)
	paper.clear()
	paper.put(bg)
	game = tetrisInit()
	grid = game.grid
	grid2 = game.grid2
	draw()
}

 //when row is all occupied, clear that row, (change back the bg colors and reset states), and bring all the rows above down by copying the attributes down
var rowClear = function(row) {
	i=0
	while (i<numcol){
		if (grid[row][i].space!="occupied"){
			return}
			console.log("not full")
		i++
	} 
	// console.log("this is where you will write the scoring function and shifting rows down function")
	i=1
	while (i<numcol-1){
		grid[row][i].space = "empty"
		grid[row][i].attr({
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
			grid[j][i].space = grid[j-1][i].space
			grid[j][i].attr({
				"fill" : grid[j-1][i].attr("fill"),
				"stroke" : grid[j-1][i].attr("stroke"),
			})
		i++
		}
		i = 0
		j--
	}
	score++
	speed-=5
	if (speed<=100){speed=100}
	header.innerHTML = "Score: " + score 
} 

var checkRowisFilled = function(){
	var cnt = 1
	while (cnt<numrow-1){
		rowClear(cnt)
		console.log("checking row " + cnt)
		cnt++
	}
}


// User Interface things ---------------------------------------

//start and stop buttons ----------------
var togglevalue = "stop"
var toggle = document.getElementById("toggle")
var tetrisOption = document.getElementById("tetris")
var mappingGameOption = document.getElementById("mappinggame")
var drop

toggle.addEventListener("click", function(ev){
    if (togglevalue === "stop"){
      toggle.value = "stop"
      togglevalue = "start"

      drop = setInterval(moveDown, speed)	
      if (gametype==="mappinggame"){
      	loadTime = Date.now()
      	console.log(loadTime)
      }
    } else { 
        toggle.value = "start"
        togglevalue = "stop"
       
        clearInterval(drop)
    }
})


tetrisOption.addEventListener("click", function(ev){
	tetrisRestart()
})

mappingGameOption.addEventListener("click", function(ev){
	mappingGameRestart()
})

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


