import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { HeaderComponent } from './components/header/header.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { BoardMenuComponent } from './components/board-menu/board-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    HeaderComponent,
    GameBoardComponent,
    BoardMenuComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
