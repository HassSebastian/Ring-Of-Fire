import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  aCollection = collection(this.firestore, 'games');
  game: Game;
  constructor(private router: Router) {}
  newGame() {
    let game = new Game();
    addDoc(this.aCollection, game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}
