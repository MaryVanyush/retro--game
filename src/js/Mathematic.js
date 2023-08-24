export default class Mathematic {
    static levelUp(character, level) {
      let health = 0;
      let attack = 0;
      let defence = 0;
      for (let i = 0; i < level; i++) {
        health = Math.min(character.health + 80, 100);
        attack = Number((Math.max(character.attack, character.attack * (80 + character.health) / 100)).toFixed(0));
        defence = Number((Math.max(character.defence, character.defence * (80 + character.health) / 100)).toFixed(0));
      }
      return {health, attack, defence};
    }
  }