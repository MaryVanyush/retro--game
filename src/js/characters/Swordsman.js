import Character from "../Character"

export default class Swordsman extends Character {
    constructor(level, type = 'swordsman', health) {
        super(level, type, health) ;
        if (level < 1 || level > 4) {
            throw new Error('error level');
        }
      this.attack = 40;
      this.defence = 10;
    }
  }