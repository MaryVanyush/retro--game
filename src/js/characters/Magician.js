import Character from "../Character"

export default class Magician extends Character {
    constructor(level, type = 'magician', health) {
        super(level, type, health) ;
        if (level < 1 || level > 4) {
            throw new Error('error level');
        }
      this.attack = 10;
      this.defence = 40;
    }
  }