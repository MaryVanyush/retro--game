export default class GameState {
  constructor() {
    this.currentPlayer = "player";
  }

  сhangeСurrentPlayer() { 
    this.currentPlayer = (this.currentPlayer === "player") ? "opponent" : "player";
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
