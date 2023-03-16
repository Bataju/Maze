let newNaze;
let newMaze = new Maze(600, 10, 10);
newMaze.setup();
newMaze.drawMaze();

document.addEventListener("keydown", move);

function move(event) {
    if (!generationComplete) 
    {
      return;
    }
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
          if (currentCell.goal) return;
        }
        break;
  
      case "ArrowRight":
        if (!currentCell.walls.rightWall) {
          let next = newMaze.grid[row][col + 1];
          currentCell = next;
          newMaze.drawMaze();
          currentCell.highlightCurrentCell(newMaze.noOfColumns);
          if (currentCell.goal) return;
        }
        break;
  
      case "ArrowDown":
        if (!currentCell.walls.bottomWall) {
          let next = newMaze.grid[row + 1][col];
          currentCell = next;
          newMaze.drawMaze();
          currentCell.highlightCurrentCell(newMaze.noOfColumns);
          if (currentCell.goal) return;
        }
        break;
  
      case "ArrowLeft":
        if (!currentCell.walls.leftWall) {
          let next = newMaze.grid[row][col - 1];
          currentCell = next;
          newMaze.drawMaze();
          currentCell.highlightCurrentCell(newMaze.noOfColumns);
          // not required if goal is in bottom right
          if (currentCell.goal) return;
        }
        break;
    }
  }