let map = [
    ["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"],
    ["#",".",".","#",".",".",".",".",".","#","#","#","#","#","#","#"],
    ["#",".",".","#",".","#","#","#",".","#",".","#","#","#","#","#"],
    ["#",".",".","#",".","#","#","#",".","#",".",".","#","#","#","#"],
    ["#",".",".",".",".","#","#","#",".","#",".","#",".","#","#","#"],
    ["#",".",".",".",".",".",".",".",".","#",".","#","#",".","#","#"],
    ["#",".",".",".",".","#","#","#","#","#",".",".",".",".",".","#"],
    ["#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","#"],
    ["#","#","#","#","#","#",".","#","#","#","#","#","#","#","#","#"],
];

let screenWidth = 120; 
let screenHeight = 20; 
let screen = Array.from(new Array(screenHeight), () => Array.from(new Array(screenWidth), () => " "));

let playerX = 1.0; 
let playerY = 1.0; 
let playerA = 0; 

let mapHeight = 9; 
let mapWidth = 16;	 

let FOV = Math.PI/3; 
let depth = 7;	  


function updateInterface(...data) {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    console.log.apply(this, data);
}


var stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf8");

console.log("Press any key to continue...")

stdin.on( "data", function(key) {

    if (key === "\u0003") {
        process.exit();
    }

    if (key === "a") playerA -= 0.1;
    if (key === "d") playerA += 0.1;
    if (key === "w") {
        let sX = Math.sin(playerA)*0.3;
        let sY = Math.cos(playerA)*0.3;

        if (playerX + sX < mapWidth && playerY + sY < mapHeight) {
            if (map[Math.floor(playerY + sY)][Math.floor(playerX + sX)] !== "#") {
                playerX += sX;
                playerY += sY;
            }
        }
    }
    if (key === "s") {
        let sX = Math.sin(playerA)*0.3;
        let sY = Math.cos(playerA)*0.3;

        if (playerX - sX < mapWidth && playerY - sY < mapHeight) {
            if (map[Math.floor(playerY - sY)][Math.floor(playerX - sX)] !== "#") {
                playerX -= sX;
                playerY -= sY;
            }
        }
    }

    for (let x = 0; x < screenWidth; x++) {

	    let rayAngle = (playerA - FOV/2) + (x / screenWidth) * FOV;
	    let distanceToWall = 0; 
	    let hitWall = false;

	    let eyeX = Math.sin(rayAngle); 
	    let eyeY = Math.cos(rayAngle);

	    while (!hitWall && distanceToWall < depth) {

		    distanceToWall += 0.1;

		    let testX = (playerX + eyeX*distanceToWall);
		    let testY = (playerY + eyeY*distanceToWall);

		    if (testX < 0 || testX >= mapWidth || testY < 0 || testY >= mapHeight) {
			    hitWall = true;
			    distanceToWall = depth;
		    }
		    else if (map[Math.floor(testY)][Math.floor(testX)] === "#") hitWall = true;

        }

        
	    let ceiling = (screenHeight/2) - screenHeight / (distanceToWall); 
	    let floor = screenHeight - ceiling;

        let shade;

        if (distanceToWall <= depth/3)	    shade = "█"; 
	    else if (distanceToWall < depth/2)  shade = "▓"; 
	    else if (distanceToWall < depth/1)  shade = "▒";  
	    else if (distanceToWall < depth)	shade = "░"; 
	    else								shade = " ";

        for (let y = 0; y < screenHeight; y++) {

            if (y <= ceiling) screen[y][x] = " ";
		    else if(y > ceiling && y <= floor) screen[y][x] = shade;
		    else {
			    let b = 1 - (y - screenHeight/2) / (screenHeight/2);

			    if (b < 0.25)		shade = "#";
			    else if (b < 0.5)	shade = "x";
			    else if (b < 0.75)	shade = "~";
			    else if (b < 0.9)	shade = "-";
			    else				shade = " ";

			    screen[y][x] = shade;
		    }

	    }

    }

    strScreen = "";
    for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) {
            if (map[y]) {
                if (map[y][x]) strScreen += x === Math.floor(playerX) && y === Math.floor(playerY) ? "◬" : map[y][x];
                else strScreen += screen[y][x];
            }
            else strScreen += screen[y][x];
        }
        strScreen += "\n"
    }
    updateInterface(`X:${playerX.toFixed(2)}\tY:${playerY.toFixed(2)}\tA:${playerA.toFixed(2)}\tMap ${mapWidth}x${mapHeight}\t(Use: WASD)\n`+strScreen);

});

