import { FunctionService } from './services/function.service';
import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, DoCheck, OnDestroy {

  cells: string[] = []
  cellSize: number = 10

  cellAmount: number = 1253
  canvas: any
  width!: number
  height!: number
  ctx!: any

  CELL_X!: number
  CELL_Y!: number

  BOARD: any
  isPlayed: boolean = false
  interval: any
  cleared: boolean = false
  //speed states
  speed: number = 10
  controllChange: boolean = false
  //counter for generations
  iterationCounter: number = 0

  //for cell color change
  colors: string[] = ['rgb(116,187,253)', 'rgb(243,187,253)', 'rgb(24,97,253)', 'rgb(113,97,253)', 'rgb(202,197,252)', 'rgb(36,27,125)', 'rgb(252,27,125)', 'rgb(252,231,125']

  constructor(private dataFlowService: DataFlowService, private functionsService: FunctionService) { }

  ngOnInit(): void {
    //canvas
    //finding the canvas HTML elem in order to cooperate with it in future functions
    this.canvas = document.querySelector<HTMLCanvasElement>('#game')
    //creating the context for the 2 dimentional area
    this.ctx = this.canvas?.getContext('2d')
    //the future width and height of the future board
    this.width = this.canvas?.width
    this.height = this.canvas?.height
    //the amount of cells that are availbale in our canvas (horizontally and vertically)
    this.CELL_X = this.width! / this.cellSize
    this.CELL_Y = this.height! / this.cellSize
    this.ctx!.fillStyle = "rgb(90, 90, 90)";
    this.ctx!.strokeStyle = "rgb(90, 90, 90)";
    this.ctx!.lineWidth = 1

    this.functionsService.drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height) //drawing the canvas lines
    this.cellsInit() //creating default alive cells
    this.functionsService.drawBoard(this.ctx, this.colors, this.CELL_X, this.CELL_Y, this.cellSize, this.BOARD) //drawing the initial board with initial cells

    //using service to transfer the functions to the component of Board-Menu
    this.dataFlowService.isStarted$.subscribe((start) => {
      if(start) {
        this.nextGeneration()
      }
      !start ? this.isPlayed = true : this.isPlayed = false
    })
    this.dataFlowService.cleared$.subscribe((reset) => {
      this.cleared = reset
      //resetting the counter of the generations
      this.iterationCounter = 0
    })
    //speed flows for speed change
    this.dataFlowService.speed$.subscribe((speed) => this.speed = speed)
  }

  ngDoCheck() {
    //calling the function to set the generation counter
    this.dataFlowService.provideIterationCounter(this.iterationCounter)

    if(this.isPlayed) {
      clearInterval(this.interval)
    }
    //checking the clearing conditions and setting the inittial desk
    if(this.cleared) {
      this.functionsService.reset(this.ctx, this.width, this.height)
      this.cellsInit()
      this.nextGeneration(true, true)
      this.cleared = false
    }
    //new speed is asignet to the new speed
    this.dataFlowService.isChangedSpeed$.subscribe((isChanged) => this.controllChange = isChanged)

    if(this.controllChange) {
      clearInterval(this.interval)
      this.dataFlowService.speed$.subscribe((speed) => this.speed = speed)
      this.controllChange = false
      this.nextGeneration()
    }
    //flow to change the cell size using the controller
      this.dataFlowService.cellSize$.subscribe((cell) => this.cellSize = cell)
      this.functionsService.reset(this.ctx, this.width, this.height)
      this.functionsService.drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize,  this.width, this.height)
      this.functionsService.drawBoard(this.ctx, this.colors, this.cellSize, this.CELL_X, this.CELL_Y, this.BOARD)
  }

  ngOnDestroy() {
    this.dataFlowService.isStarted$.unsubscribe()
    this.dataFlowService.cleared$.unsubscribe()
    this.dataFlowService.speed$.unsubscribe()
  }

  public cellsInit() {
    //setting some of the cells to true meaning that they are alive and will be filled with color from the beggining of the game
    this.BOARD = this.functionsService.prepareBoard(this.CELL_X, this.CELL_Y)
    this.BOARD[0][1] = true
    this.BOARD[1][1] = true
    this.BOARD[2][1] = true
  }

  //calling all the Necessary fucntion to show the current generation and to calculate the next one according to the rules and updating the state of the cells each second with the SetInterval
  nextGeneration(isCleared?: boolean, isStopped?: boolean) {
    if(isStopped) {
      this.BOARD = this.functionsService.setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD)
      this.functionsService.drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD)
    } else {
      this.interval = setInterval(() => {
        this.BOARD = this.functionsService.setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD)
        if(!isCleared) {
          //generation counter
          this.iterationCounter += 1
        }
      }, this.speed * 100)
    }
  }
  //the posibility to draw new cells yourself
  canvasClick(e: any) {
    //finding the clicked cells coordinates (counting from top left) and rounding that number
    const x = Math.floor( (e.clientX - this.canvas.offsetLeft) / this.cellSize)
    const y = Math.floor( (e.clientY - this.canvas.offsetTop) / this.cellSize)

    //toggling the click( when alive, turns dead and viceversa)
    this.BOARD[x][y] = !this.BOARD[x][y]
    //drawing the cell again according to the new clicked cells and thir coordinates
    this.functionsService.drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD)
  }
}
