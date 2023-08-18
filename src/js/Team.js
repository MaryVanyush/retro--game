/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * */
export default class Team {
  constructor() {
    this.characters = [];

  }

  add(character) {
    this.characters.push(character);
  }

  // remove(character) {
  //   const index = this.characters.indexOf(character);
  //   if (index !== -1) {
  //     this.characters.splice(index, 1);
  //   }
  // }
}
