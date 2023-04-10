import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  collection,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game;
  // gamesCollection = collection(this.firestore, 'games');
  gameId: string = '';
  playerMax: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore = inject(Firestore),
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];

      // this.gameId = params['id'];
      // let docRef = doc(this.gamesCollection, this.gameId);
      // let game$ = docData(docRef);
      // game$.subscribe((game: any) => {
      docData(doc(collection(this.firestore, 'games'), this.gameId)).subscribe(
        (game: any) => {
          this.game.players = game.players;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        }
      );
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
        console.log('players= ', this.playerMax);
        if (this.game.players.length == 8) {
          this.playerMax = true;
        }
      }
    });
  }

  saveGame() {
    // const docRef = doc(this.firestore, "games", this.gameId);
    // const gameData = this.game.toJson();
    // setDoc(docRef, gameData).then(() => {
    //   console.log("Document successfully written!", this.game);
    // });
    setDoc(
      doc(collection(this.firestore, 'games'), this.gameId),
      this.game.toJson()
    );
    // update(this.game.toJson());
  }
}
