import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { get } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard;
  game: Game;
  // games$: Observable<any[]>;
  gamesCollection = collection(this.firestore, 'games');
  gameId: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore = inject(Firestore),
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      // this.gameId = params['id'];
      // let docRef = doc(this.gamesCollection, this.gameId);
      // let game$ = docData(docRef);
      // game$.subscribe((game: any) => {
      docData(doc(collection(this.firestore, 'games'), params['id'])).subscribe(
        (game: any) => {
          this.game.players = game.players;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.stack = game.stack;
        }
      );
    });
  }

  newGame() {
    this.game = new Game();
    // const aCollection = collection(this.firestore, 'games');
    // setDoc(doc(aCollection), this.game.toJson());
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        if (this.currentCard !== undefined) {
          this.game.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
