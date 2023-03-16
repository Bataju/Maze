let regenerate = document.querySelector(".regenerate");
let home = document.querySelector(".home");
let complete = document.querySelector(".complete");

let reachedHome = false;

regenerate.addEventListener("click", () => {
    location.reload();
});

home.addEventListener("click", () => {
    complete.style.display = "none";//make the div disappear
});

let form = document.querySelector("#controls");
let container = document.querySelector(".form-container");
form.addEventListener("submit", generateMaze);
function generateMaze(event) {
    event.preventDefault();
    dropdown = document.getElementById("dropdown");
    selectedValue = dropdown.value;

    if (selectedValue == 1) {
        rows = columns = 10;
        delay = 50;
    }
    else if (selectedValue == 2) {
        rows = columns = 20;
        delay = 30;
    }
    else if (selectedValue == 3) {
        rows = columns = 30;
        delay = 1;
    }
    else
    {
        rows = columns = 10;
        delay = 50;
    }

    container.style.display = "none";

    newMaze = new Maze(600, rows, columns, delay);
    newMaze.setup();
    newMaze.drawMaze();
}

// let newNaze;
// let newMaze = new Maze(600, 30, 30, 1);
// newMaze.setup();
// newMaze.drawMaze();

document.addEventListener("keydown", move);

function move(event) {
    if (!generationComplete) {
        return;
    }
    if (reachedHome)
        return;
    let key = event.key;
    let row = currentCell.rowNumber;
    let col = currentCell.columnNumber;

    switch (key) {
        case "ArrowUp":
            if (!currentCell.walls.topWall) {
                let next = newMaze.grid[row - 1][col];
                currentCell = next;
                newMaze.drawMaze();
                currentCell.highlightCurrentCell(newMaze.noOfColumns);
                // not required if goal is in bottom right
                if (currentCell.goal) {
                    reachedHome = true;
                    complete.style.display = "block";
                }
            }
            break;

        case "ArrowRight":
            if (!currentCell.walls.rightWall) {
                let next = newMaze.grid[row][col + 1];
                currentCell = next;
                newMaze.drawMaze();
                currentCell.highlightCurrentCell(newMaze.noOfColumns);
                if (currentCell.goal) {
                    reachedHome = true;
                    complete.style.display = "block";//make the div visible
                }
            }
            break;

        case "ArrowDown":
            if (!currentCell.walls.bottomWall) {
                let next = newMaze.grid[row + 1][col];
                currentCell = next;
                newMaze.drawMaze();
                currentCell.highlightCurrentCell(newMaze.noOfColumns);
                if (currentCell.goal) {
                    reachedHome = true;
                    complete.style.display = "block";
                }
            }
            break;

        case "ArrowLeft":
            if (!currentCell.walls.leftWall) {
                let next = newMaze.grid[row][col - 1];
                currentCell = next;
                newMaze.drawMaze();
                currentCell.highlightCurrentCell(newMaze.noOfColumns);
                // not required if goal is in bottom right
                if (currentCell.goal) {
                    reachedHome = true;
                    complete.style.display = "block";
                }
            }
            break;
    }
}
