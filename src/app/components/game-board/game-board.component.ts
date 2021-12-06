import { FormDataService } from './../../services/form-data.service';
import { FunctionService } from './services/function.service';
import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, DoCheck, OnDestroy {

  public cells: string[] = [];
  public cellSize: number = 10;

  public cellAmount: number = 1253;
  public canvas: any;
  public width!: number;
  public height!: number;
  public ctx!: any;

  public CELL_X!: number;
  public CELL_Y!: number;

  public BOARD: any;
  public isPlayed: boolean = false;
  public interval: any;
  public cleared: boolean = false;
  //speed states
  public speed: number = 10;
  public controllChange: boolean = false;
  //counter for generations
  public iterationCounter: number = 0;

  //for cell color change
  public colors: string[] = ['rgb(116,187,253)', 'rgb(243,187,253)', 'rgb(24,97,253)', 'rgb(113,97,253)', 'rgb(202,197,252)', 'rgb(36,27,125)', 'rgb(252,27,125)', 'rgb(252,231,125'];
  //for canvas responsiveness
  public pangeWidth: number = document.documentElement.scrollWidth;

  //instances for the initial cells coordinates
  public firstFigure: {x: number, y: number}[] = [
    {x: 8, y: 4},
    {x: 8, y: 10},
    {x: 9, y: 4},
    {x: 9, y: 10},
    {x: 10, y: 4},
    {x: 10, y: 5},
    {x: 10, y: 9},
    {x: 10, y: 10},
    {x: 12, y: 0},
    {x: 12, y: 1},
    {x: 12, y: 2},
    {x: 12, y: 5},
    {x: 12, y: 6},
    {x: 12, y: 8},
    {x: 12, y: 9},
    {x: 12, y: 12},
    {x: 12, y: 13},
    {x: 12, y: 14},
    {x: 13, y: 2},
    {x: 13, y: 4},
    {x: 13, y: 6},
    {x: 13, y: 8},
    {x: 13, y: 10},
    {x: 13, y: 12},
    {x: 14, y: 4},
    {x: 14, y: 5},
    {x: 14, y: 9},
    {x: 14, y: 10},
    {x: 16, y: 4},
    {x: 16, y: 5},
    {x: 16, y: 9},
    {x: 16, y: 10},
    {x: 17, y: 2},
    {x: 17, y: 4},
    {x: 17, y: 6},
    {x: 17, y: 8},
    {x: 17, y: 10},
    {x: 17, y: 12},
    {x: 18, y: 0},
    {x: 18, y: 1},
    {x: 18, y: 2},
    {x: 18, y: 5},
    {x: 18, y: 6},
    {x: 18, y: 8},
    {x: 18, y: 9},
    {x: 18, y: 12},
    {x: 18, y: 13},
    {x: 18, y: 14},
    {x: 20, y: 4},
    {x: 20, y: 5},
    {x: 20, y: 9},
    {x: 20, y: 10},
    {x: 21, y: 4},
    {x: 21, y: 10},
    {x: 22, y: 4},
    {x: 22, y: 10}
  ];
  public secondFigure: {x: number, y: number}[] = [
    {x: 12, y: 5},
    {x: 12, y: 7},
    {x: 13, y: 4},
    {x: 14, y: 4},
    {x: 14, y: 8},
    {x: 15, y: 4},
    {x: 15, y: 8},
    {x: 16, y: 4},
    {x: 17, y: 4},
    {x: 17, y: 7},
    {x: 18, y: 4},
    {x: 18, y: 5},
    {x: 18, y: 6}
  ];
  public thirdFigure: {x: number, y: number}[] = [
    {x: 5, y: 6},
    {x: 6, y: 4},
    {x: 6, y: 6},
    {x: 7, y: 5},
    {x: 7, y: 6}
  ];
  public defaultFigure: {x: number, y: number}[] = [
    {x: 0, y: 1},
    {x: 1, y: 1},
    {x: 2, y: 1},
  ]
  //for custom width and height
  public userWidth: number = 600
  public userHeight: number = 400


  constructor(private dataFlowService: DataFlowService, private functionsService: FunctionService, private formDataService: FormDataService) { }

  ngOnInit(): void {
    //for local storage
    const dataFromForm = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('formData'))));
    console.log(dataFromForm);
    this.userWidth = dataFromForm.width;
    this.userHeight = dataFromForm.height;

    //data from the welcome view
    this.formDataService.formData$.subscribe((formData) => console.log(formData));

    //canvas

    //finding the canvas HTML elem in order to cooperate with it in future functions
    this.canvas = document.querySelector<HTMLCanvasElement>('#game');
    //custom width and height
    this.canvas.width = this.userWidth;
    this.canvas.height = this.userHeight;
    //creating the context for the 2 dimentional area
    this.ctx = this.canvas?.getContext('2d');
    //the future width and height of the future board
    this.width = this.canvas?.width;
    this.height = this.canvas?.height;
    //the amount of cells that are availbale in our canvas (horizontally and vertically)
    this.CELL_X = this.width! / this.cellSize;
    this.CELL_Y = this.height! / this.cellSize;
    this.ctx!.fillStyle = "rgb(90, 90, 90)";
    this.ctx!.strokeStyle = "rgb(90, 90, 90)";
    this.ctx!.lineWidth = 1;

    this.functionsService._drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height); //drawing the canvas lines
    this._cellsInit(); //creating default alive cells
    this._figureInit(dataFromForm.figure)
    this.functionsService._drawBoard(this.ctx, this.colors, this.CELL_X, this.CELL_Y, this.cellSize, this.BOARD); //drawing the initial board with initial cells

    //using service to transfer the functions to the component of Board-Menu
    this.dataFlowService.isStarted$.subscribe((start) => {
      if(start) {
        this._nextGeneration();
      }
      !start ? this.isPlayed = true : this.isPlayed = false;
    });
    this.dataFlowService.cleared$.subscribe((reset) => {
      this.cleared = reset;
      //resetting the counter of the generations
      this.iterationCounter = 0;
    });
    //speed flows for speed change
    this.dataFlowService.speed$.subscribe((speed) => this.speed = speed);
  }

  ngDoCheck(): void {
    //calling the function to set the generation counter
    this.dataFlowService._provideIterationCounter(this.iterationCounter);

    if(this.isPlayed) {
      clearInterval(this.interval);
    }
    //checking the clearing conditions and setting the inittial desk
    if(this.cleared) {
      this.functionsService._reset(this.ctx, this.width, this.height);
      this._cellsInit();

      this._nextGeneration(true, true);
      this.cleared = false;
    }
    //new speed is asignet to the new speed
    this.dataFlowService.isChangedSpeed$.subscribe((isChanged) => this.controllChange = isChanged);

    if(this.controllChange) {
      clearInterval(this.interval);
      this.dataFlowService.speed$.subscribe((speed) => this.speed = speed);
      this.controllChange = false;
      this._nextGeneration();
    }
    //flow to change the cell size using the controller
      this.dataFlowService.cellSize$.subscribe((cell) => this.cellSize = cell);
      this.functionsService._reset(this.ctx, this.width, this.height);
      this.functionsService._drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize,  this.width, this.height);
      this.functionsService._drawBoard(this.ctx, this.colors, this.cellSize, this.CELL_X, this.CELL_Y, this.BOARD);
  }

  ngOnDestroy(): void {
    this.dataFlowService.isStarted$.unsubscribe();
    this.dataFlowService.cleared$.unsubscribe();
    this.dataFlowService.speed$.unsubscribe();
    this.dataFlowService.cellSize$.unsubscribe();
    this.dataFlowService.isChangedSpeed$.unsubscribe();

  }

  //initial cells coordinates
  private _figureInit(figure: string): void {
    if(figure === 'firstFigure') {
      for (let i = 0; i < this.firstFigure.length; i++) {
        this.BOARD[this.firstFigure[i].x][this.firstFigure[i].y] = true;
      }
    } else if (figure === 'secondFigure') {
      for (let i = 0; i < this.secondFigure.length; i++) {
        this.BOARD[this.secondFigure[i].x][this.secondFigure[i].y] = true;
      }
    } else if (figure === 'thirdFigure') {
      for (let i = 0; i < this.thirdFigure.length; i++) {
        this.BOARD[this.thirdFigure[i].x][this.thirdFigure[i].y] = true;
      }
    } else if (figure === 'default') {
      for (let i = 0; i < this.defaultFigure.length; i++) {
       return
      }
    }

  }

  //for canvas responsiveness
  public _onResize(e: any): void {
    this.pangeWidth = document.documentElement.scrollWidth;
  }

  public _cellsInit(): void {
    //setting some of the cells to true meaning that they are alive and will be filled with color from the beggining of the game
    this.BOARD = this.functionsService._prepareBoard(this.CELL_X, this.CELL_Y);

  }

  //calling all the Necessary fucntion to show the current generation and to calculate the next one according to the rules and updating the state of the cells each second with the SetInterval
  public _nextGeneration(isCleared?: boolean, isStopped?: boolean): void {


    if(isStopped) {
      this.BOARD = this.functionsService._setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD);
      this.functionsService._drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD);
    } else {
      this.interval = setInterval(() => {
        this.BOARD = this.functionsService._setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD);
        if(!isCleared) {
          //generation counter
          this.iterationCounter += 1;
        }
      }, this.speed * 100);
    }
  }
  //the posibility to draw new cells yourself
  public _canvasClick(e: any): void {
    //finding the clicked cells coordinates (counting from top left) and rounding that number
    const x = Math.floor( (e.clientX - this.canvas.offsetLeft) / this.cellSize);
    const y = Math.floor( (e.clientY - this.canvas.offsetTop) / this.cellSize);

    //toggling the click( when alive, turns dead and viceversa)
    this.BOARD[x][y] = !this.BOARD[x][y];

    //drawing the cell again according to the new clicked cells and thir coordinates
    this.functionsService._drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD);
  }
}
