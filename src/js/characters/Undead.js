import Character from "../Character"

export default class Undead extends Character {
    constructor(level, type = 'undead', health) {
        super(level, type, health) ;
        if (level < 1 || level > 4) {
            throw new Error('error level');
        }
      this.attack = 40;
      this.defence = 10;
    }
  }