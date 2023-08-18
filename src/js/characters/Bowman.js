import Character from "../Character"

export default class Bowman extends Character {
    constructor(level, type = 'bowman', health) {
        super(level, type, health) ;
        if (level < 1 || level > 4) {
            throw new Error('error level');
        }
      this.attack = 25;
      this.defence = 25;
    }
  }