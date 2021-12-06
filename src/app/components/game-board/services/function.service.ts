import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

 //creating the two dimentional array in order to create all the cells which all initially are equal to false, meaning that they are dead and have no color
 public _prepareBoard(cellX: number, cellY: number): boolean[][] {
    const board = [];
    for( let i = 0; i < cellX; i++ )  {
        const row = [];
        for( let j = 0; j < cellY; j++ ) {
            row.push(false);
        }
        board.push(row);
    }
    return board;
  }

  //drawing the lines in our grid with canvas fucntions, on X and Y, using loop to iterate through all the cells
  public _drawBorders(ctx: any, cellX: number, cellY: number, size: number, width: number, height: number):void {
    for( let i = 0; i < cellX ; i++ ) {
        ctx.beginPath();
        ctx.moveTo(i * size- 0.5, 0);
        ctx.lineTo(i * size - 0.5, height);
        ctx.stroke();
    }
    for( let j = 0; j < cellY ; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * size - 0.5);
      ctx.lineTo(width, j * size - 0.5);
      ctx.stroke();
    }
  }
  //drawing the new generation every time the board updates
  public _drawAll(ctx: any, cellX: number, cellY: number, size: number, width: number, height: number, colors: string[], board: []): void {
    this._reset(ctx, width, height)
    this._drawBoard(ctx, colors, cellX, cellY, size, board)
    this._drawBorders(ctx, cellX, cellY, size, width, height)
  }
   //clearing the board with native canvas function clearRect between each generations
   public _reset(ctx: any, width: number, height: number): void {
    ctx.clearRect(0, 0, width, height)
  }
  //drawing the board considering alive and dead cells
  public _drawBoard(ctx: any, colors: string[], size: number , cellX: number, cellY: number, board: []): void {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]

    for( let i = 0; i < cellX!; i++ ) {
      for( let j = 0; j < cellY!; j++ ) {
        if(!this._isAlive(i, j, cellX!, cellY!, board)) {
          //when the cell is dead, we break the loop
          continue
        }
        //if the cell is alice, we color it
        ctx.fillRect(i * size, j * size, size, size)
      }
    }
  }

  //checking the current status of the cell, return 0 is dead , and 1 is alive
  public _isAlive(x: number, y: number, cellX: number, cellY: number, board: []): number {
    if( x < 0 || x >= cellX || y < 0 || y >= cellY) {
      return 0
    }
    return board[x][y] ? 1 : 0
  }

  //counting the neighbouring cells around the particular one
  public _countNeighbours(x: number, y: number, cellX: number, cellY: number, board: []): number {
    let count = 0
    for( let i of [-1, 0, 1]) {
      for( let j of [-1, 0, 1]) {
        if(!(i === 0 && j === 0)) {
          count += this._isAlive( x + i, y + j, cellX, cellY, board)
        }
      }
    }
    return count
  }

  //looping through the coordinates and checkig for the next generation
  //creating the new empty board( which will be the next board with new data)
  public _setNewGeneration(cellX: number, cellY: number, board: []): boolean[][] {

    const cBoard = this._prepareBoard(cellX, cellY)

    for( let i = 0; i < cellX; i++ ) {
      for( let j = 0; j < cellY; j++ ) {
        //if the cell is dead but has three neighbours, it becomes alive (true)
        if(!this._isAlive(i, j, cellX, cellY, board)) {
          if(this._countNeighbours(i, j,cellX, cellY, board) === 3 ) {
            cBoard[i][j] = true
          }
        } else {
          //if the cell is already alive and it has 2 or 3 neighbouring cells , then it stays alive (true)
          const count = this._countNeighbours(i, j, cellX, cellY, board)
          if(count == 2 || count == 3) {
            cBoard[i][j] = true
          }
        }
      }
    }
    return cBoard
  }

}
