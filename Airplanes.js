const area = document.querySelector(".area");
let grid = new Array(21);

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
        area.appendChild(row);
    }
}