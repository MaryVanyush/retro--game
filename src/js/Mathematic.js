export default class Mathematic {
    static levelUp(character) {
      const health = Math.min(character.health + 80, 100);
      const attack = Math.max(character.attack, character.attack * (80 + character.health) / 100);
      const defence = Math.max(character.defence, character.defence * (80 + character.health) / 100);
      return {health, attack, defence}
    }
  }