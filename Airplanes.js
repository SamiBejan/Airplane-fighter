const area = document.querySelector(".area");
let grid = new Array(21);
let airplane = [{"line": 2, "col": 10}, {"line": 1, "col": 10}, {"line": 1, "col": 9}, {"line": 1, "col": 11}];
let second = 0, minute = 0, score = 0, end = false;
let rocks = new Array(0), bullet = new Array(0);
let timer, rockGenerator, rockMover;
let bulletInd = 0;

createSpace();

//The game area is created
function createSpace() {
    for (let i = 1; i < grid.length; ++i) {
        grid[i] = new Array(21);
    }
    for (let i = 1; i < grid.length; ++i) {
        let row = document.createElement("tr");
        for (let j = 1; j < grid[i].length; ++j) {
            grid[i][j] = document.createElement("td");
            row.appendChild(grid[i][j]);
        }
        area.prepend(row);
    }
}

function createAirplane() {
    for (let i = 0; i < airplane.length; ++i) {
        grid[airplane[i].line][airplane[i].col].classList.add("airplane");
    }
} 

function deleteAirplane() {
    for (let i = 0; i < airplane.length; ++i) {
        grid[airplane[i].line][airplane[i].col].classList.remove("airplane");
    }
}

/*We delete the rocks of the previous game, create the new airplane, allow it to move, 
hide the pop-up, start the timer, reset score to 0, generate the rocks and made them to fall*/
function startGame() {
    deleteRocks();
    createAirplane();
    document.getElementsByClassName("pop-up")[0].style.visibility = "hidden";
    timer = setInterval(cntTime, 1000);
    window.addEventListener("keydown", moveOrFire);
    rockGenerator = setInterval(generateRocks, 3000);
    rockMover = setInterval(moveRocks, 400);
    score = 0;
}

    //We check if the key pressed is an arrow
    function isArrowKey(key) {
        return (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight");
    }

    //We check if the airplane go beyond the area margins 
    function hitWall(key) {
        return ((key === "ArrowUp" && airplane[0].line + 1 === 21) || (key === "ArrowDown" && airplane[1].line - 1 === 0) ||
        (key === "ArrowLeft" && airplane[2].col - 1 === 0) || (key === "ArrowRight" && airplane[3].col + 1 === 21));
    }

    //We check if the airplane hits a rock when moving
    function hitRock() {
        for (let i = 0; i < airplane.length; ++i) {
            if (grid[airplane[i].line][airplane[i].col].classList.contains("rock")) {
                return true;
            }
        }
        return false;
    }

/*If the key pressed is an arrow and the airplane remains inside the area, we move it to the new position. 
If the Space key is pressed, a bullet is created and released. If the airplane hits a rock, the game ends*/
function moveOrFire(e) { 
    if (isArrowKey(e.key) && !hitWall(e.key)) {
        deleteAirplane();
        if (e.key === "ArrowUp") {
            e.preventDefault();
            for (let i = 0; i < airplane.length; ++i) {
                ++airplane[i].line;
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            for (let i = 0; i < airplane.length; ++i) {
                --airplane[i].line;
            }
        } else if (e.key === "ArrowLeft") {
            for (let i = 0; i < airplane.length; ++i) {
                --airplane[i].col;
            }
        } else {
            for (let i = 0; i < airplane.length; ++i) {
                ++airplane[i].col;
            }
        }
    } else if (e.key === " " && !hitWall(e.key)) {
        e.preventDefault();
        createBullet(airplane[0].line, airplane[0].col);
    }
    if (hitRock()) {
        endGame();
    } else {
        createAirplane();    
    } 
}

//We count the game time and make sure that the minutes and seconds are displayed with two digits
function cntTime() {
    ++second;
    let prefixMin = "0", prefixSec = "0";
    if (second === 60) {
        second = 0;
        ++minute;
    }
    if (minute >= 10) {
        prefixMin = "";
    }
    if (second >= 10) {
        prefixSec = "";
    }
    document.querySelector(".timer").innerText = prefixMin + minute + ":" + prefixSec + second;
}

//We generate 3 new rocks on the top row of the area
function generateRocks() {
    for (let j = 1; j <= 3; ++j) {
        let col = Math.ceil(Math.random() * 20);
        for (let k = 1; j > 1 && k < j; ++k) {
            while (col === rocks[rocks.length - k].col) {
                col = Math.ceil(Math.random() * 20);
            }
        }
        rocks.push({"line": 21, "col": col});
    }
}

/* We move the rocks by periodically lowering their positions and updating their display in the area.
Particular cases are with the rocks entering the area from above or those leaving the area beneath. 
If the rock hits the airplane, the game ends. If it hits a bullet, it will be distroyed alongside the bullet 
and the score will be incremented */
function moveRocks() {
    for (let i = 0; i < rocks.length; ++i) {
        if (rocks[i].line != 21 ) {
            grid[rocks[i].line][rocks[i].col].classList.remove("rock"); 
        }
        --rocks[i].line; 
        if (rocks[i].line === 0) {    
            rocks.splice(i, 1);
            --i;
        } else if (grid[rocks[i].line][rocks[i].col].classList.contains("airplane")) {
            grid[rocks[i].line][rocks[i].col].classList.add("rock"); 
            endGame();
        } else if (grid[rocks[i].line][rocks[i].col].classList.contains("bullet")) {
            grid[rocks[i].line][rocks[i].col].classList.remove("bullet"); 
            for (let j = 0; j < bullet.length; ++j) {
                if (bullet[j].line === rocks[i].line && bullet[j].col === rocks[i].col) {
                    stopBullet(j);
                    --j;
                }
            }
            if (bulletInd >= bullet.length) {
                bulletInd = 0;
            }
            rocks.splice(i, 1);
            --i;
            incrementScore();
        } else {
            grid[rocks[i].line][rocks[i].col].classList.add("rock"); 
        }
    }
}

//A new bullet is generated and released
function createBullet(x, y) {
    bullet.unshift({"line": x, "col": y, "fire": setInterval(moveBullet, 50)});
}

/*The bullets are moved by periodically increasing their position and updating their display in the area.
If a bullet hits a rock, it will be distroyed alongside the rock and the score will be incremented*/
function moveBullet() {
    grid[bullet[bulletInd].line][bullet[bulletInd].col].classList.remove("bullet");
    ++bullet[bulletInd].line;
    if (bullet[bulletInd].line <= 20 && !grid[bullet[bulletInd].line][bullet[bulletInd].col].classList.contains("rock")) {
        grid[bullet[bulletInd].line][bullet[bulletInd].col].classList.add("bullet");
    } else if (bullet[bulletInd].line <= 20 && grid[bullet[bulletInd].line][bullet[bulletInd].col].classList.contains("rock")) {
        grid[bullet[bulletInd].line][bullet[bulletInd].col].classList.remove("rock");
        for (let j = 0; j < rocks.length; ++j) {
            if (bullet[bulletInd].line === rocks[j].line && bullet[bulletInd].col === rocks[j].col) {
                rocks.splice(j, 1);
                --j;
            } 
        }
        incrementScore();
        stopBullet(bulletInd);
        --bulletInd;
    } else {
        stopBullet(bulletInd);
        --bulletInd;
    }
    ++bulletInd;
    if (bulletInd >= bullet.length) {
        bulletInd = 0;
    }
}
    
//The bullet is stopped and deleted
function stopBullet(x) {
    clearInterval(bullet[x].fire);
    bullet.splice(x, 1);
}

function incrementScore() {
    ++score;
    document.getElementsByClassName("score")[0].innerText = "Score\n" + score;
}

//All bullets are stopped and deleted
function deleteBullets() {
    while (bullet.length) {
        grid[bullet[0].line][bullet[0].col].classList.remove("bullet");
        clearInterval(bullet[0].fire);
        bullet.shift();
    }
}

//All rocks are deleted
function deleteRocks() {
    const rockCells = document.getElementsByClassName("rock");
    while (rockCells.length) {
        rockCells[0].classList.remove("rock");
    }
    rocks.splice(0, rocks.length);
}

/*The timer is stopped and reset to 0, the rocks are stopped, the airplane and bullets are deleted
and the Game Over pop-up is displayed*/
function endGame()  {
    document.getElementsByClassName("timer")[0].innerText = "00:00";
    document.getElementsByClassName("pop-up")[0].style.visibility = "visible";
    document.getElementsByClassName("pop-upText")[0].innerText = "GAME OVER \n \n Score: " + score;
    document.getElementsByClassName("startGame")[0].innerText = "Start Again";
    window.removeEventListener("keydown", moveOrFire);
    deleteBullets();
    deleteAirplane();
    clearInterval(timer);
    clearInterval(rockGenerator);
    clearInterval(rockMover);
}
