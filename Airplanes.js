const area = document.querySelector(".area");
let grid = new Array(21);
let airplane = [{"line": 2, "col": 10}, {"line": 1, "col": 10}, {"line": 1, "col": 9}, {"line": 1, "col": 11}];
let second = 0, minute = 0, score = 0, end = false;
let rocks = new Array(0);
let timer, rockGenerator, rockMover;

createSpace();

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

function startGame() {
    /*We delete the rocks of the previous game, create the new airplane, allow it to move, 
    start the timer, reset score to 0, generate the rocks and made them to fall*/
    const rockCells = document.getElementsByClassName("rock");
    while (rockCells.length) {
        rockCells[0].classList.remove("rock");
    }
    rocks.splice(0,rocks.length);
    createAirplane();
    document.getElementsByClassName("pop-up")[0].style.visibility = "hidden";
    timer = setInterval(cntTime, 1000);
    window.addEventListener("keydown", move);
    rockGenerator = setInterval(generateRocks, 3000);
    rockMover = setInterval(moveRocks, 1000);
    score = 0;
}

    //We check if the key pressed is arrow
    function isArrowKey(key) {
        return (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight");
    }

    //We check if the airplane go beyond the area margins
    function hitWall(key) {
        return ((key === "ArrowUp" && airplane[0].line + 1 === 11) || (key === "ArrowDown" && airplane[1].line - 1 === 0) ||
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

function move(e) { 
    if (isArrowKey(e.key) && !hitWall(e.key)) {
        deleteAirplane();
        if (e.key === "ArrowUp") {
            for (let i = 0; i < airplane.length; ++i) {
                ++airplane[i].line;
            }
        } else if (e.key === "ArrowDown") {
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
    } 
    if (hitRock()) {
        endGame();
    } else {
        createAirplane();    
    } 
}

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

function generateRocks() {
    //We generate 3 new rocks on the top row of the area
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

function moveRocks() {
    /* We lower each rock's position. If it comes from above the area, we just display it on the new position.
    If it goes beneath the area, we just remove the rock. If the rock hits the airplane, we end the game. 
    If not any of these cases, we remove the rock and then display it on the new position */
    for (let i = 0; i < rocks.length; ++i) {
        if (rocks[i].line != 21) {
            grid[rocks[i].line][rocks[i].col].classList.remove("rock"); 
        }
        --rocks[i].line; 
        if (rocks[i].line === 0) {    
            rocks.shift();
            --i;
            ++score;
            document.getElementsByClassName("score")[0].innerText = "Score\n" + score;
        } else if (grid[rocks[i].line][rocks[i].col].classList.contains("airplane")) {
            grid[rocks[i].line][rocks[i].col].classList.add("rock"); 
            endGame();
        } else {
            grid[rocks[i].line][rocks[i].col].classList.add("rock"); 
        }
    }
}

function endGame()  {
    //We stop the timer and reset it to 0, stop the rocks, delete the airplane and display the Game Over pop-up
    document.getElementsByClassName("timer")[0].innerText = "00:00";
    document.getElementsByClassName("pop-up")[0].style.visibility = "visible";
    document.getElementsByClassName("pop-upText")[0].innerText = "GAME OVER \n \n Score: " + score;
    document.getElementsByClassName("startGame")[0].innerText = "Start Again";
    window.removeEventListener("keydown", move);
    clearInterval(timer);
    clearInterval(rockGenerator);
    clearInterval(rockMover);
    deleteAirplane();
}
