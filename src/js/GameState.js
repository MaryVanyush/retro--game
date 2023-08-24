import GameStateService from "./GameStateService";

export default class GameState {
  constructor() {
    this.currentPlayer = "player";
    this.level = 1;
    this.gameStateService = new GameStateService(localStorage)
  }

  сhangeСurrentPlayer() { 
    this.currentPlayer = (this.currentPlayer === "player") ? "opponent" : "player";
  }

  levelUp(){
    if (this.level === 4) return;
    this.level += 1;
    this.currentPlayer = "player";
  }

  load(){
    return this.gameStateService.load()
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
