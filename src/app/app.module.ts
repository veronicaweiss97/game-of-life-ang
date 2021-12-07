import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


import { AppComponent } from './app.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { HeaderComponent } from './components/header/header.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { BoardMenuComponent } from './components/board-menu/board-menu.component';
import { WelcomeViewComponent } from './views/welcome-view/welcome-view.component';
import { WelcomeFormComponent } from './components/welcome-form/welcome-form.component';
import { InputRadioComponent } from './components/welcome-form/input-radio/input-radio.component';

const appRoutes: Routes = [
  {path: '', component: WelcomeViewComponent},
  {path: 'game-of-life', component: MainViewComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    HeaderComponent,
    GameBoardComponent,
    BoardMenuComponent,
    WelcomeViewComponent,
    WelcomeFormComponent,
    InputRadioComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
