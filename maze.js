//depth first search and recursive backtracker, use of stack data structure
let maze = document.querySelector(".maze");
let context = maze.getContext("2d");
let currentCell; //the current selected cell

class Maze{
    constructor(sizeOfMaze, noOfRows, noOfColumns)
    {
        this.sizeOfMaze = sizeOfMaze;
        this.noOfRows = noOfRows;
        this.noOfColumns = noOfColumns;
        this.grid = [];//2d array representing rows and columns of maze
        this.stack = []; //1d array, with push pop functions, for recursive backtracking
    }

    //setup for the maze using nested for loops
    setup(){
        for(let row= 0; row<this.noOfRows ; row++)
        {
            let rowArray = [];
            for(let col=0;col<this.noOfColumns;col++)
            {
                //new instance of cell class
                let cell = new Cell(row, col, this.grid, this.sizeOfMaze);
                rowArray.push(cell);//push each cell to the row array
            }
            this.grid.push(rowArray);//push each row to the 2d grid
        }
        currentCell = this.grid[0][0]; 
    }

    async drawMaze()
    {
        maze.width = this.sizeOfMaze;
        maze.height = this.sizeOfMaze;//square maze
        maze.style.background = "lightpink";

        currentCell.visited = true;//visit the first cell

        //nested for loop to run showCell for each cell
        for(let row= 0; row<this.noOfRows ; row++)
        {
            for(let col=0;col<this.noOfColumns;col++)
            {
                let grid = this.grid;
                grid[row][col].showCell(this.sizeOfMaze, this.noOfRows, this.noOfColumns);
            }
        }

        let nextNeighbour = currentCell.checkNeighbours();
        if(nextNeighbour)
        {
            nextNeighbour.visited=true;
            this.stack.push(currentCell);//push current cell to stack for recursive backtracking later
            currentCell.highlightCurrentCell(this.noOfColumns);
            currentCell.removeWalls(currentCell, nextNeighbour);
            currentCell = nextNeighbour;
        }
        else if(this.stack.length>0)//backtracker when no more available neighbours
        {
            let cell = this.stack.pop();
            currentCell = cell; //new cell popped becomes the current cell
            currentCell.highlightCurrentCell(this.noOfColumns);
        }

        //all cells visited
        if(this.stack.length===0)
        {
            return;
        }

        await delayRoutine(50);//milliseconds

        window.requestAnimationFrame(() =>
        {
            this.drawMaze();
        })
    }
}

class Cell{
    constructor(rowNumber, columnNumber, parentGrid, parentSize)
    {
        //dimensions of parent grid is needed to draw each cell
        //parent grid is passed so that neighbouring cells of a particular cell are accessible
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        //each cell can be marked if it is visited
        this.visited = false; //false by default
        //all cells have four walls
        //a js object
        this.walls = {
            topWall : true,
            bottomWall : true,
            leftWall : true,
            rightWall : true
        };
    }

    checkNeighbours()
    {
        let grid = this.parentGrid;
        let row = this.rowNumber;
        let col = this.columnNumber;
        let neighboursArray = [];//push all the unvisited neighbours of the cell

        let topNeighbour = row !== 0 ? grid[row-1][col]: undefined;
        let rightNeighbour = col !== grid.length-1 ? grid[row][col+1]: undefined;
        let bottomNeighbour = row !== grid.length-1 ? grid[row+1][col]: undefined;
        let leftNeighbour = col !== 0 ? grid[row][col-1]: undefined;

        if(topNeighbour && !topNeighbour.visited)
            neighboursArray.push(topNeighbour);
        if(rightNeighbour && !rightNeighbour.visited)
            neighboursArray.push(rightNeighbour);
        if(bottomNeighbour && !bottomNeighbour.visited)
            neighboursArray.push(bottomNeighbour);
        if(leftNeighbour && !leftNeighbour.visited)
            neighboursArray.push(leftNeighbour);

        //choose a random neighbour
        if(neighboursArray.length!==0)
        {
            let random = Math.floor(Math.random() * neighboursArray.length); //0 to length-1
            return neighboursArray[random];//return a random neighbour from the array of neighbours
        }
        else
        {
            return undefined;
        }
    }

    drawTopWall(xCoordinate, yCooordinate,sizeOfMaze,noOfRows, noOfColumns )
    {
        //on the canvas
        //x and y represent top left hand of cell
        //x+size/noofcol give top right hand of cell
        context.beginPath();
        context.moveTo(xCoordinate, yCooordinate);//moved to the given coordinate
        context.lineTo(xCoordinate+sizeOfMaze/noOfColumns, yCooordinate);
        context.stroke();//will draw the line
    }

    drawRightWall(xCoordinate, yCooordinate,sizeOfMaze, noOfRows, noOfColumns)
    {
        context.beginPath();
        context.moveTo(xCoordinate+sizeOfMaze/noOfColumns, yCooordinate);//top right
        context.lineTo(xCoordinate+sizeOfMaze/noOfColumns, yCooordinate+sizeOfMaze/noOfRows);
        context.stroke();
    }  
    
    drawBottomWall(xCoordinate, yCooordinate,sizeOfMaze,noOfRows, noOfColumns)
    {
        context.beginPath();
        context.moveTo(xCoordinate, yCooordinate+sizeOfMaze/noOfRows);//bottom left
        context.lineTo(xCoordinate+sizeOfMaze/noOfColumns, yCooordinate+sizeOfMaze/noOfRows);
        context.stroke();
    }  

    drawLeftWall(xCoordinate, yCooordinate,sizeOfMaze, noOfRows, noOfColumns)
    {
        context.beginPath();
        context.moveTo(xCoordinate, yCooordinate);//top left
        context.lineTo(xCoordinate, yCooordinate+sizeOfMaze/noOfRows);
        context.stroke();
    }  

    highlightCurrentCell(noOfColumns)
    {
        let x = (this.columnNumber * this.parentSize )/noOfColumns+1;
        let y = (this.rowNumber * this.parentSize )/noOfColumns+1; //noOfRows = noOfColumns
    
        context.fillStyle = "#6b5b95";
        context.fillRect(x, y, this.parentSize/noOfColumns-1, this.parentSize/noOfColumns-1);
    }

    removeWalls(cell1, cell2)
    {
        //check which of the walls are to be removed
        //take two cells from the grid, subtract (2-3)=-1, remove right wall of 2 i.e cell1
        //(3-2)=1, remove left wall of 3 i.e cell1 and right wall of 2 i.e. cell2
        let x = cell1.columnNumber - cell2.columnNumber;
        if(x==-1)
        {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
        else if(x==1)
        {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        }

        let y = cell1.rowNumber - cell2.rowNumber;
        if(y==-1)
        {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
        else if(y==1)
        {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        }
    }

    showCell(sizeOfMaze, noOfRows, noOfColumns)
    {
        let x = this.columnNumber * sizeOfMaze / noOfColumns;
        let y = this.rowNumber * sizeOfMaze / noOfRows;

        context.strokeStyle = "black"; //to draw the walls
        context.fillStyle = "lightpink"; //each cell filled black
        context.lineWidth = 3;//each grid line 2pixel

        //draw the walls
        if(this.walls.topWall)
            this.drawTopWall(x, y, sizeOfMaze, noOfRows, noOfColumns);
        if(this.walls.rightWall)
            this.drawRightWall(x, y, sizeOfMaze, noOfRows, noOfColumns);
        if(this.walls.bottomWall)
            this.drawBottomWall(x, y, sizeOfMaze, noOfRows, noOfColumns);
        if(this.walls.leftWall)
            this.drawLeftWall(x, y, sizeOfMaze, noOfRows, noOfColumns);

        if(this.visited)
        {
            //fill color for visited cells
            context.fillRect(x+1, y+1, sizeOfMaze/noOfColumns-1, sizeOfMaze/noOfRows-1)
        }
    }
}

function delayRoutine(millisecs) { 
    return new Promise(resolve => { 
        setTimeout(() => { resolve('') }, millisecs); 
    }) 
}

let newMaze = new Maze(600, 10, 10);
newMaze.setup();
newMaze.drawMaze();