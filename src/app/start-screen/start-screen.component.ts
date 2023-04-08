import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}
  newGame() {
    let game = new Game();
    // const aCollection = collection(this.firestore, 'games');
    // setDoc(doc(aCollection), this.game.toJson());

    this.router.navigateByUrl('/game');
  }
}
