import { FunctionService } from './services/function.service';
import { DataFlowService } from '../../services/data-flow.service';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import data from './data/figure-data.json'
import { Router } from '@angular/router';

enum Figures {
  FIRSTFIGURE,
  SECONDFIGURE,
  THIRDFIGURE,
  DEFAULT
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, DoCheck, OnDestroy {

  public Figures = Figures

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
  public pageWidth: number = document.documentElement.scrollWidth;

  //for custom width and height
  public userWidth: number = 600;
  public userHeight: number = 400;

  //figuresvdata json
  public allFigures: any = JSON.parse(JSON.stringify(data))

  //subscriptions
  private _isStartedSubscription: Subscription = new Subscription();
  private _clearSubscription: Subscription = new Subscription();
  private _speedSubscription: Subscription = new Subscription();
  private _cellSizeSubscription: Subscription = new Subscription();
  private _isChangeSpeedSubscription: Subscription = new Subscription();

  constructor(private dataFlowService: DataFlowService, private functionsService: FunctionService, private router: Router) { }

  ngOnInit(): void {

    //for data from Router (history)
    const dataFromForm = history.state.data;
    console.log(dataFromForm);
    this.userWidth = dataFromForm.width;
    this.userHeight = dataFromForm.height;

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

    this.functionsService.drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height); //drawing the canvas lines
    this.cellsInit(); //creating default alive cells
    this._figureInit(dataFromForm.figure.toUpperCase())
    this.functionsService.drawBoard(this.ctx, this.colors, this.CELL_X, this.CELL_Y, this.cellSize, this.BOARD); //drawing the initial board with initial cells

    //using service to transfer the functions to the component of Board-Menu
    this._isStartedSubscription = this.dataFlowService.isStarted$.subscribe((start) => {
      if(start) {
        this.nextGeneration();
      }
      !start ? this.isPlayed = true : this.isPlayed = false;
    });
    this._clearSubscription = this.dataFlowService.cleared$.subscribe((reset) => {
      this.cleared = reset;
      //resetting the counter of the generations
      this.iterationCounter = 0;
    });
    //speed flows for speed change
    this._speedSubscription = this.dataFlowService.speed$.subscribe((speed) => this.speed = speed);
  }

  ngDoCheck(): void {
    //calling the function to set the generation counter
    this.dataFlowService.provideIterationCounter(this.iterationCounter);

    if(this.isPlayed) {
      clearInterval(this.interval);
    }
    //checking the clearing conditions and setting the inittial desk
    if(this.cleared) {
      this.functionsService._reset(this.ctx, this.width, this.height);
      this.cellsInit();

      this.nextGeneration(true, true);
      this.cleared = false;
    }
    //new speed is asignet to the new speed
    this._isChangeSpeedSubscription = this.dataFlowService.isChangedSpeed$.subscribe((isChanged) => this.controllChange = isChanged);

    if(this.controllChange) {
      clearInterval(this.interval);
      this._speedSubscription = this.dataFlowService.speed$.subscribe((speed) => this.speed = speed);
      this.controllChange = false;
      this.nextGeneration();
    }
    //flow to change the cell size using the controller
      this._cellSizeSubscription = this.dataFlowService.cellSize$.subscribe((cell) => this.cellSize = cell);
      this.functionsService._reset(this.ctx, this.width, this.height);
      this.functionsService.drawBorders(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize,  this.width, this.height);
      this.functionsService.drawBoard(this.ctx, this.colors, this.cellSize, this.CELL_X, this.CELL_Y, this.BOARD);
  }

  ngOnDestroy(): void {
    this._isStartedSubscription.unsubscribe();
    this._clearSubscription.unsubscribe();
    this._speedSubscription.unsubscribe();
    this._cellSizeSubscription.unsubscribe();
    this._isChangeSpeedSubscription.unsubscribe();
  }

  //initial cells coordinates
  private _figureInit(figure: string): void {

    if(figure === this.Figures[0]) {
      for (let i = 0; i < this.allFigures.firstFigure.length; i++) {
        this.BOARD[this.allFigures.firstFigure[i].x][this.allFigures.firstFigure[i].y] = true;
      }
    } if (figure === this.Figures[1]) {
      for (let i = 0; i < this.allFigures.secondFigure.length; i++) {
        this.BOARD[this.allFigures.secondFigure[i].x][this.allFigures.secondFigure[i].y] = true;
      }
    }  if (figure === this.Figures[2]) {
      for (let i = 0; i < this.allFigures.thirfFigures.length; i++) {
        this.BOARD[this.allFigures.thirfFigures[i].x][this.allFigures.thirfFigures[i].y] = true;
      }
    } if (figure === this.Figures[3]) {
      for (let i = 0; i < this.allFigures.defaultFigure.length; i++) {
       return
      }
    }
  }

  //for canvas responsiveness
  public onResize(e: any): void {
    this.pageWidth = document.documentElement.scrollWidth;
  }

  public cellsInit(): void {
    //setting some of the cells to true meaning that they are alive and will be filled with color from the beggining of the game
    this.BOARD = this.functionsService.prepareBoard(this.CELL_X, this.CELL_Y);
  }

  //calling all the Necessary fucntion to show the current generation and to calculate the next one according to the rules and updating the state of the cells each second with the SetInterval
  public nextGeneration(isCleared?: boolean, isStopped?: boolean): void {

    if(isStopped) {
      this.BOARD = this.functionsService.setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD);
      this.functionsService.drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD);
    } else {
      this.interval = setInterval(() => {
        this.BOARD = this.functionsService.setNewGeneration(this.CELL_X, this.CELL_Y, this.BOARD);
        if(!isCleared) {
          //generation counter
          this.iterationCounter += 1;
        }
      }, this.speed * 100);
    }
  }
  //the posibility to draw new cells yourself
  public canvasClick(e: any): void {
    //finding the clicked cells coordinates (counting from top left) and rounding that number
    const x = Math.floor( (e.clientX - this.canvas.offsetLeft) / this.cellSize);
    const y = Math.floor( (e.clientY - this.canvas.offsetTop) / this.cellSize);

    //toggling the click( when alive, turns dead and viceversa)
    this.BOARD[x][y] = !this.BOARD[x][y];

    //drawing the cell again according to the new clicked cells and thir coordinates
    this.functionsService.drawAll(this.ctx, this.CELL_X, this.CELL_Y, this.cellSize, this.width, this.height, this.colors, this.BOARD);
  }
}
