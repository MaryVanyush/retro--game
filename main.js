/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/utils.js
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * @example
 * ```js
 * */
function calcTileType(index, boardSize) {
  const topLeft = 0;
  if (topLeft === index) return 'top-left';
  const topRight = boardSize - 1;
  if (topRight === index) return 'top-right';
  const bottomRight = boardSize * boardSize - 1;
  if (bottomRight === index) return 'bottom-right';
  const bottomLeft = bottomRight - (boardSize - 1);
  if (bottomLeft === index) return 'bottom-left';
  if (index >= 1 && index <= boardSize - 2) return 'top';
  if (index >= bottomLeft + 1 && index <= bottomRight - 1) return 'bottom';
  if (index % boardSize === 0) return 'left';
  if ((index + 1) % boardSize === 0) return 'right';
  return 'center';
}
function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}
;// CONCATENATED MODULE: ./src/js/GamePlay.js

class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
    this.boardEl = this.container.querySelector('[data-id=board]');
    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }
    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);
      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');
      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);
      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }
  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }
  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }
  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }
  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }
  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }
  static showError(message) {
    alert(message);
  }
  static showMessage(message) {
    alert(message);
  }
  selectCell(index) {
    let color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yellow';
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }
  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList).filter(o => o.startsWith('selected')));
  }
  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }
  hideCellTooltip(index) {
    this.cells[index].title = '';
  }
  showDamage(index, damage) {
    return new Promise(resolve => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }
  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/themes.js
const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain'
};
/* harmony default export */ const js_themes = (themes);
;// CONCATENATED MODULE: ./src/js/cursors.js
const cursors = {
  auto: 'auto',
  pointer: 'pointer',
  crosshair: 'crosshair',
  notallowed: 'not-allowed'
};
/* harmony default export */ const js_cursors = (cursors);
;// CONCATENATED MODULE: ./src/js/Team.js
/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * */
class Team {
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
;// CONCATENATED MODULE: ./src/js/generators.js


/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomClass = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const randomLevel = Math.ceil(Math.random() * maxLevel);
    yield new randomClass(randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */

function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  for (let i = 0; i < characterCount; i++) {
    const playerGenerator = characterGenerator(allowedTypes, maxLevel);
    const character = playerGenerator.next().value;
    team.add(character);
  }
  return team;
}
;// CONCATENATED MODULE: ./src/js/Character.js
/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
class Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'generic';
    if (this.constructor === Character) {
      throw new Error('class "Character" cannot be instantiated directly');
    }
    if (type === 'generic') {
      throw new Error('Class "Character" cannot be instantiated with type "generic"');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Bowman.js

class Bowman extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'bowman';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 25;
    this.defence = 25;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Swordsman.js

class Swordsman extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'swordsman';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 40;
    this.defence = 10;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Magician.js

class Magician extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'magician';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 10;
    this.defence = 40;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Daemon.js

class Daemon extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'daemon';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 10;
    this.defence = 10;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Undead.js

class Undead extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'undead';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 40;
    this.defence = 10;
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Vampire.js

class Vampire extends Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'vampire';
    let health = arguments.length > 2 ? arguments[2] : undefined;
    super(level, type, health);
    if (level < 1 || level > 4) {
      throw new Error('error level');
    }
    this.attack = 25;
    this.defence = 25;
  }
}
;// CONCATENATED MODULE: ./src/js/PositionedCharacter.js

class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
    this.character = character;
    this.position = position;
  }
}
;// CONCATENATED MODULE: ./src/js/GameStateService.js
class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }
  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/GameState.js

class GameState {
  constructor() {
    this.currentPlayer = "player";
    this.level = 1;
    this.gameStateService = new GameStateService(localStorage);
  }
  сhangeСurrentPlayer() {
    this.currentPlayer = this.currentPlayer === "player" ? "opponent" : "player";
  }
  levelUp() {
    if (this.level === 4) return;
    this.level += 1;
    this.currentPlayer = "player";
  }
  load() {
    return this.gameStateService.load();
  }
  static from(object) {
    // TODO: create object
    return null;
  }
}
;// CONCATENATED MODULE: ./src/js/Mathematic.js
class Mathematic {
  static levelUp(character, level) {
    let health = 0;
    let attack = 0;
    let defence = 0;
    for (let i = 0; i < level; i++) {
      health = Math.min(character.health + 80, 100);
      attack = Number(Math.max(character.attack, character.attack * (80 + character.health) / 100).toFixed(0));
      defence = Number(Math.max(character.defence, character.defence * (80 + character.health) / 100).toFixed(0));
    }
    return {
      health,
      attack,
      defence
    };
  }
}
;// CONCATENATED MODULE: ./src/js/isStepPossible.js
/**
 * @param index - индекс поля для перемещения
 * @param position - позиция игрока/противника
 * @maxDistance - максимальная дистанция одного хода для игрока/противника
 * */

function getDistance(position, index) {
  const x1 = position % 8;
  const y1 = Math.floor(position / 8);
  const x2 = index % 8;
  const y2 = Math.floor(index / 8);
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
}
function isStepPossible(position, index, maxDistance) {
  const distance = getDistance(position, index).toFixed(0);
  if (maxDistance === 4) {
    if (distance === 0 || distance - 2 > maxDistance) {
      return false;
    }
  }
  if (maxDistance === 2) {
    if (distance === 0 || distance - 1 > maxDistance) {
      return false;
    }
  }
  if (maxDistance === 1) {
    if (distance === 0 || distance > maxDistance) {
      return false;
    }
  }
  const x1 = position % 8;
  const y1 = Math.floor(position / 8);
  const x2 = index % 8;
  const y2 = Math.floor(index / 8);
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  if (dx > maxDistance || dy > maxDistance) {
    return false;
  }
  if (dx === 0 && dy === 0) {
    return false;
  }
  const stepX = x1 < x2 ? 1 : x1 > x2 ? -1 : 0;
  const stepY = y1 < y2 ? 1 : y1 > y2 ? -1 : 0;
  let currentX = x1 + stepX;
  let currentY = y1 + stepY;
  let steps = 1;
  while (currentX !== x2 || currentY !== y2) {
    if (currentX < 0 || currentX > 7 || currentY < 0 || currentY > 7) {
      return false;
    }
    currentX += stepX;
    currentY += stepY;
    steps++;
    if (steps > maxDistance) {
      return false;
    }
  }
  return true;
}
function isPossibleStepsIndex(position, maxDistance) {
  let arrOfSteps = [1, -1, 7, 8, 9, -7, -8, -9];
  if (maxDistance === 1) {
    const possibleStepsIndex = [];
    arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
    return possibleStepsIndex;
  }
  if (maxDistance === 2) {
    arrOfSteps = [...arrOfSteps, ...arrOfSteps.map(el => el * 2)];
    const possibleStepsIndex = [];
    arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
    return possibleStepsIndex;
  }
  if (maxDistance === 4) {
    arrOfSteps = [...arrOfSteps, ...arrOfSteps.map(el => el * 2), ...arrOfSteps.map(el => el * 3), ...arrOfSteps.map(el => el * 4)];
    const possibleStepsIndex = [];
    arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
    return possibleStepsIndex;
  }
}
;// CONCATENATED MODULE: ./src/js/GameController.js














class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionsTeams = [];
    this.positions = [];
    this.team = null;
    this.opponent = null;
    this.selectedCellIndex = null;
    this.selectedCharacter = null;
    this.mouseEnterCell = null;
    this.possibleStep = null;
    this.possibleAttack = null;
    this.numberOfCharacters = 2;
    this.gameState = new GameState();
    this.setEventOnCell = this.setEventOnCell.bind(this);
    this.toNewGame = this.toNewGame.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.toMouseenterCell = this.toMouseenterCell.bind(this);
    this.resetOptions = this.resetOptions.bind(this);
    this.toStepOfOpponent = this.toStepOfOpponent.bind(this);
    this.checkPosition = this.checkPosition.bind(this);
    this.toAttacPlayer = this.toAttacPlayer.bind(this);
    this.toCharacterRemove = this.toCharacterRemove.bind(this);
    this.levelUp = this.levelUp.bind(this);
    this.toSaveGame = this.toSaveGame.bind(this);
    this.toLoadGame = this.toLoadGame.bind(this);
  }
  async init() {
    await this.gamePlay.drawUi(js_themes.prairie);
    await this.generateTeams(1, this.numberOfCharacters);
    await this.setEventOnCell();
  }
  toNewGame() {
    this.positionsTeams = [];
    this.positions = [];
    this.team = null;
    this.opponent = null;
    this.selectedCellIndex = null;
    this.selectedCharacter = null;
    this.mouseEnterCell = null;
    this.possibleStep = null;
    this.possibleAttack = null;
    this.numberOfCharacters = 2;
    this.gameState = new GameState();
    this.gamePlay.drawUi(js_themes.prairie);
    this.generateTeams(1, this.numberOfCharacters);
  }
  async levelUpInit() {
    const themeKeys = Object.keys(js_themes);
    const currentTheme = js_themes[themeKeys[this.gameState.level - 1]];
    await this.gamePlay.drawUi(currentTheme);
    await this.generateTeams(1, this.numberOfCharacters);
  }
  toSaveGame() {
    this.gameState.gameStateService.save({
      positionsTeams: this.positionsTeams,
      level: this.gameState.level
    });
  }
  toLoadGame() {
    const state = this.gameState.load();
    this.positionsTeams = state.positionsTeams;
    this.gameState.level = state.level;
    const themeKeys = Object.keys(js_themes);
    const currentTheme = js_themes[themeKeys[this.gameState.level - 1]];
    this.gamePlay.drawUi(currentTheme);
    this.gamePlay.redrawPositions(this.positionsTeams);
  }
  setEventOnCell() {
    this.gamePlay.addNewGameListener(this.toNewGame);
    this.gamePlay.addSaveGameListener(this.toSaveGame);
    this.gamePlay.addLoadGameListener(this.toLoadGame);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }
  async handlePossibleStep(index) {
    this.positionsTeams = this.positionsTeams.filter(char => char.position !== this.selectedCellIndex);
    this.selectedCharacter.position = index;
    this.positionsTeams.push(this.selectedCharacter);
    await this.gamePlay.redrawPositions(this.positionsTeams);
    await this.gamePlay.deselectCell(this.selectedCellIndex);
    await this.gamePlay.deselectCell(this.mouseEnterCell);
    await this.resetOptions();
    await this.gameState.сhangeСurrentPlayer();
    await this.toStepOfOpponent();
  }
  async handlePossibleAttack(index, character) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    const attacker = this.selectedCharacter.character;
    const damage = Number(Math.max(attacker.attack - character.character.defence, attacker.attack * 0.1).toFixed(1));
    await this.gamePlay.showDamage(index, damage).then(() => {
      character.character.health = character.character.health - damage;
      this.gamePlay.redrawPositions(this.positionsTeams);
      this.gamePlay.deselectCell(this.selectedCellIndex);
      this.gamePlay.deselectCell(this.mouseEnterCell);
      if (character.character.health <= 0) {
        this.toCharacterRemove(character);
      }
      let opponentTeam = [];
      opponentTeam = this.positionsTeams.filter(char => !playerCharacters.includes(char.character.type));
      this.resetOptions();
      if (opponentTeam.length === 0) {
        this.levelUp(this.positionsTeams);
        return;
      }
      this.gameState.сhangeСurrentPlayer();
      this.toStepOfOpponent();
    });
  }
  async onCellClick(index) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    let playersTeam = [];
    playersTeam = this.positionsTeams.filter(char => playerCharacters.includes(char.character.type));
    if (playersTeam.length === 0) {
      return;
    }
    index = this.gamePlay.cells.indexOf(event.currentTarget);
    const character = this.positionsTeams.find(char => char.position === index);
    if (this.possibleStep !== null) {
      await this.handlePossibleStep(index);
      this.selectedCellIndex = null;
      return;
    }
    if (this.possibleAttack !== null) {
      await this.handlePossibleAttack(index, character);
      this.selectedCellIndex = null;
      return;
    }
    if (!character) {
      await GamePlay.showError("there is no player in this cell");
      return;
    }
    ;
    if (!playerCharacters.includes(character.character.type)) {
      await GamePlay.showError("this is not your character");
      return;
    }
    if (this.selectedCellIndex !== null) {
      await this.gamePlay.deselectCell(this.selectedCellIndex);
    }
    await this.gamePlay.selectCell(index);
    this.selectedCellIndex = character.position;
    this.selectedCharacter = character;
    await this.toMouseenterCell();
  }
  toStepOfOpponent() {
    if (this.gameState.currentPlayer === "player") return;
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    let playerTeam = [];
    let opponentTeam = [];
    playerTeam = this.positionsTeams.filter(char => playerCharacters.includes(char.character.type));
    opponentTeam = this.positionsTeams.filter(char => !playerCharacters.includes(char.character.type));
    let opponentTeamDistans = [];
    opponentTeam.forEach(char => {
      const stepDistans = this.getStepDistance(char.character.type);
      const attackDistans = this.getAttacDistance(char.character.type);
      const position = char.position;
      const character = char.character;
      opponentTeamDistans.push({
        attackDistans,
        stepDistans,
        position,
        character
      });
    });
    let indexForAttack = null;
    let opponentCharacter = null;
    opponentTeamDistans.forEach(opponent => {
      const possibleAttackIndex = isPossibleStepsIndex(opponent.position, opponent.attackDistans);
      let arrFromplayerTeamPositions = [];
      playerTeam.forEach(player => arrFromplayerTeamPositions.push(player.position));
      const matchingIndexes = possibleAttackIndex.filter(index => arrFromplayerTeamPositions.includes(index));
      if (matchingIndexes.length !== 0) {
        matchingIndexes.forEach(index => {
          if (isStepPossible(opponent.position, index, opponent.attackDistans)) {
            indexForAttack = index;
            opponentCharacter = opponent;
            return;
          }
        });
      }
    });
    if (indexForAttack !== null && opponentCharacter !== null) {
      this.toAttacPlayer(indexForAttack, opponentCharacter);
    } else {
      const maxstepDistansOpponent = opponentTeamDistans.reduce((prev, current) => {
        return prev.stepDistans > current.stepDistans ? prev : current;
      });
      let selectedOpponent = this.positionsTeams.filter(char => char.position === maxstepDistansOpponent.position);
      const possibleStepsIndex = isPossibleStepsIndex(maxstepDistansOpponent.position, maxstepDistansOpponent.stepDistans);
      this.generateOpponentPosition(possibleStepsIndex, maxstepDistansOpponent.position, maxstepDistansOpponent.stepDistans).then(nextStep => {
        this.positionsTeams = this.positionsTeams.filter(char => char.position !== selectedOpponent[0].position);
        selectedOpponent[0].position = nextStep;
        this.positionsTeams.push(selectedOpponent[0]);
        this.gamePlay.redrawPositions(this.positionsTeams);
        this.gameState.сhangeСurrentPlayer();
        return;
      });
    }
  }
  async toAttacPlayer(index, opponent) {
    const player = this.positionsTeams.filter(char => char.position === index);
    const attacker = opponent.character;
    const damage = Number(Math.max(attacker.attack - player[0].character.defence, attacker.attack * 0.1).toFixed(1));
    await this.gamePlay.showDamage(player[0].position, damage).then(() => {
      player[0].character.health = player[0].character.health - damage;
      this.gamePlay.redrawPositions(this.positionsTeams);
      if (player[0].character.health <= 0) {
        this.toCharacterRemove(player[0]);
      }
      this.gameState.сhangeСurrentPlayer();
    });
  }
  checkPosition(index) {
    let positions = [];
    this.positionsTeams.forEach(char => {
      positions.push(char.position);
    });
    if (positions.includes(index)) {
      return false;
    } else {
      return true;
    }
  }
  async generateOpponentPosition(possibleStepsIndex, position, maxDistance) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * possibleStepsIndex.length);
    } while (!isStepPossible(position, randomIndex, maxDistance) || !this.checkPosition(randomIndex));
    return randomIndex;
  }
  resetOptions() {
    this.possibleStep = null;
    this.possibleAttack = null;
    this.selectedCellIndex = null;
    this.selectedCharacter = null;
    this.mouseEnterCell = null;
  }
  async toCharacterRemove(character) {
    this.positionsTeams = this.positionsTeams.filter(char => char !== character);
    await this.gamePlay.redrawPositions(this.positionsTeams);
    return;
  }
  toMouseenterCell() {
    this.gamePlay.cells.forEach(cell => cell.addEventListener("mouseenter", () => {
      const index = this.gamePlay.cells.indexOf(event.currentTarget);
      if (this.mouseEnterCell !== null) {
        this.gamePlay.deselectCell(this.mouseEnterCell);
      }
      if (this.selectedCellIndex === null) return;
      this.gamePlay.selectCell(this.selectedCellIndex);
      this.mouseEnterCell = index;
      const character = this.positionsTeams.find(char => char.position === index);
      let playerCharacters = ['bowman', 'swordsman', 'magician'];
      if (character && playerCharacters.includes(character.character.type) && index === character.position) {
        this.gamePlay.setCursor(js_cursors.pointer);
        this.possibleStep = null;
        this.possibleAttack = null;
        return;
      } else if (character && !playerCharacters.includes(character.character.type) && index === character.position) {
        const maxDistanceAttac = this.getAttacDistance(this.selectedCharacter.character.type);
        const possibleAttac = isStepPossible(this.selectedCellIndex, index, maxDistanceAttac);
        if (possibleAttac) {
          this.gamePlay.setCursor(js_cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.possibleAttack = index;
          this.possibleStep = null;
          return;
        } else {
          this.gamePlay.setCursor(js_cursors.notallowed);
          this.possibleStep = null;
          this.possibleAttack = null;
          return;
        }
      } else {
        const maxDistanceStep = this.getStepDistance(this.selectedCharacter.character.type);
        const possibleStep = isStepPossible(this.selectedCellIndex, index, maxDistanceStep);
        if (possibleStep) {
          this.gamePlay.setCursor(js_cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          this.possibleStep = index;
          this.possibleAttack = null;
          return;
        } else {
          this.gamePlay.setCursor(js_cursors.notallowed);
          this.possibleStep = null;
          this.possibleAttack = null;
          return;
        }
      }
    }));
  }
  getAttacDistance(characterType) {
    if (characterType === 'swordsman' || characterType === 'undead') {
      return 1;
    } else if (characterType === 'bowman' || characterType === 'vampire') {
      return 2;
    } else if (characterType === 'magician' || characterType === 'daemon') {
      return 4;
    }
  }
  getStepDistance(characterType) {
    if (characterType === 'swordsman' || characterType === 'undead') {
      return 4;
    } else if (characterType === 'bowman' || characterType === 'vampire') {
      return 2;
    } else if (characterType === 'magician' || characterType === 'daemon') {
      return 1;
    }
  }
  getCharacterInfo(character) {
    const {
      level,
      attack,
      defence,
      health
    } = character;
    const emojiLevel = String.fromCodePoint(0x1F396);
    const emojiAttak = String.fromCodePoint(0x2694);
    const emojiDefence = String.fromCodePoint(0x1F6E1);
    const emojiHealth = String.fromCodePoint(0x2764);
    return `${emojiLevel} ${level} ${emojiAttak} ${attack} ${emojiDefence} ${defence} ${emojiHealth} ${health}`;
  }
  levelUp(teamPlayers) {
    if (this.gameState.level === 4) {
      return;
    }
    this.gameState.levelUp();
    this.resetOptions();
    this.team = null;
    this.opponent = null;
    let levelUpCharacters = [];
    teamPlayers.forEach(character => {
      character.character.level += 1;
      const updatedData = Mathematic.levelUp(character.character, character.character.level);
      character.character.health = updatedData.health;
      character.character.attack = updatedData.attack;
      character.character.defence = updatedData.defence;
      levelUpCharacters.push(character);
    });
    let playerCharacters = ['swordsman', 'bowman', 'magician'];
    let opponentCharacters = ['undead', 'vampire', 'daemon'];
    this.levelUpInit().then(() => {
      this.positionsTeams.forEach(char => {
        if (opponentCharacters.includes(char.character.type)) {
          char.character.level = this.gameState.level;
          const updatedData = Mathematic.levelUp(char.character, this.gameState.level);
          char.character.health = updatedData.health;
          char.character.attack = updatedData.attack;
          char.character.defence = updatedData.defence;
        }
      });
      for (let i = 0; i < levelUpCharacters.length; i++) {
        this.positionsTeams.forEach(char => {
          if (playerCharacters.includes(char.character.type) && char.character.level === 1) {
            const index = this.positionsTeams.indexOf(char);
            const position = char.position;
            this.positionsTeams.splice(index, 1);
            levelUpCharacters[i].position = position;
            this.positionsTeams.push(levelUpCharacters[i]);
            return;
          }
        });
      }
      this.positionsTeams = this.positionsTeams.filter((char, index, self) => index === self.findIndex(c => c.position === char.position));
      this.gamePlay.redrawPositions(this.positionsTeams);
      console.log(this.positionsTeams);
    });
  }
  onCellEnter(index) {
    const character = this.positionsTeams.find(char => char.position === index);
    if (character) {
      const message = this.getCharacterInfo(character.character);
      this.gamePlay.showCellTooltip(message, index);
    }
  }
  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
  async generatePositionAsync(character) {
    return new Promise(resolve => {
      let position = this.generatePosition(character);
      resolve(position);
    });
  }
  async generateTeams(maxLevel, characterCount) {
    const players = [Bowman, Swordsman, Magician];
    const opponentPlayers = [Daemon, Undead, Vampire];
    this.team = generateTeam(players, maxLevel, characterCount);
    this.opponet = generateTeam(opponentPlayers, maxLevel, characterCount);
    await this.setPositionsAsync(this.team);
    await this.setPositionsAsync(this.opponet);
  }
  generatePosition(character) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    let position = 0;
    let random = 2;
    while (random % 8 !== 0) {
      if ((random - 1) % 8 === 0) {
        break;
      }
      random = Math.floor(Math.random() * 63);
    }
    position = random;
    if (playerCharacters.includes(character.type)) {
      return position;
    } else {
      return position + 6;
    }
  }
  async setPositionsAsync(team) {
    let promises = team.characters.map(async character => {
      let position = await this.generatePositionAsync(character);
      while (this.positions.includes(position)) {
        position = await this.generatePositionAsync(character);
      }
      this.positions.push(position);
      const positionedCharacter = new PositionedCharacter(character, position);
      this.positionsTeams.push(positionedCharacter);
    });
    await Promise.all(promises);
    this.gamePlay.redrawPositions(this.positionsTeams);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
/**
 * Entry point of app: don't change this
 */



const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map