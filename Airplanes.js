const area = document.querySelector(".area");
let grid = new Array(21);
let airplane = [{"line": 2, "col": 10}, {"line": 1, "col": 9}, {"line": 1, "col": 10}, {"line": 1, "col": 11}];

createSpace();
createAirplane();

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

function move(e) {
    if (isArrowKey(e.key) && !hitWall(e.key)) {
        for (let i = 0; i < airplane.length; ++i) {
            grid[airplane[i].line][airplane[i].col].classList.remove("airplane");
        }
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
        createAirplane();
    }
}

function isArrowKey(key) {
    return (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight");
}

function hitWall(key) {
    return ((key === "ArrowUp" && airplane[0].line + 1 === 11) || (key === "ArrowDown" && airplane[2].line - 1 === 0) ||
    (key === "ArrowLeft" && airplane[1].col - 1 === 0) || (key === "ArrowRight" && airplane[3].col + 1 === 21));
}

window.addEventListener("keydown", move);
