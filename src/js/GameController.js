import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from "./GamePlay";
import GameState from "./GameState";

import Mathematic from "./Mathematic";
import { isStepPossible, isPossibleStepsIndex } from "./isStepPossible";

export default class GameController {
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
    await this.gamePlay.drawUi(themes.prairie);
    await this.generateTeams(1, this.numberOfCharacters);
    await this.setEventOnCell();
  }

  toNewGame(){
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
    this.gamePlay.drawUi(themes.prairie);
    this.generateTeams(1, this.numberOfCharacters);
  }

  async levelUpInit() {
    const themeKeys = Object.keys(themes);
    const currentTheme = themes[themeKeys[this.gameState.level - 1]];
    await this.gamePlay.drawUi(currentTheme);
    await this.generateTeams(1, this.numberOfCharacters);
  }

  toSaveGame(){
    this.gameState.gameStateService.save({positionsTeams: this.positionsTeams, level: this.gameState.level});
  }

  toLoadGame(){
    const state = this.gameState.load();
    this.positionsTeams = state.positionsTeams;
    this.gameState.level = state.level;
    const themeKeys = Object.keys(themes);
    const currentTheme = themes[themeKeys[this.gameState.level - 1]];
    this.gamePlay.drawUi(currentTheme);
    this.gamePlay.redrawPositions(this.positionsTeams);
  }

  setEventOnCell() {
    this.gamePlay.addNewGameListener(this.toNewGame)
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
    await this.toStepOfOpponent()
  }
  
  async handlePossibleAttack(index, character) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    const attacker = this.selectedCharacter.character
    const damage =  Number((Math.max(attacker.attack - character.character.defence, attacker.attack * 0.1)).toFixed(1));
    await this.gamePlay.showDamage(index, damage).then(() => {
      character.character.health = character.character.health - damage
      this.gamePlay.redrawPositions(this.positionsTeams);
      this.gamePlay.deselectCell(this.selectedCellIndex);
      this.gamePlay.deselectCell(this.mouseEnterCell);
      if(character.character.health <= 0){
        this.toCharacterRemove(character);
      }
      let opponentTeam = [];
      opponentTeam = this.positionsTeams.filter(char => !playerCharacters.includes(char.character.type));
      this.resetOptions();
      if(opponentTeam.length === 0){
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
    if(playersTeam.length === 0){
      return;
    }
    index = this.gamePlay.cells.indexOf(event.currentTarget);
    const character = this.positionsTeams.find(char => char.position === index);
    if(this.possibleStep !== null) {
      await this.handlePossibleStep(index);
      this.selectedCellIndex = null;
      return;
    }
    if(this.possibleAttack !== null) {
      await this.handlePossibleAttack(index, character);
      this.selectedCellIndex = null;
      return;
    }
    if (!character){
      await GamePlay.showError("there is no player in this cell");
      return;
    };
    if (!playerCharacters.includes(character.character.type)){
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

  toStepOfOpponent(){
    if(this.gameState.currentPlayer === "player") return;
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
      opponentTeamDistans.push({attackDistans, stepDistans, position, character});
    });

    let indexForAttack = null;
    let opponentCharacter = null;
    opponentTeamDistans.forEach(opponent => {
      const possibleAttackIndex = isPossibleStepsIndex(opponent.position, opponent.attackDistans);
      let arrFromplayerTeamPositions = [];
      playerTeam.forEach(player => arrFromplayerTeamPositions.push(player.position));
      const matchingIndexes = possibleAttackIndex.filter(index => arrFromplayerTeamPositions.includes(index));
      if (matchingIndexes.length !== 0){
        matchingIndexes.forEach(index => {
          if(isStepPossible(opponent.position, index, opponent.attackDistans)){
            indexForAttack = index;
            opponentCharacter = opponent;
            return;
          }
        })
      }
    })
    if(indexForAttack !== null && opponentCharacter !== null) {
      this.toAttacPlayer(indexForAttack, opponentCharacter);
    } else {
      const maxstepDistansOpponent = opponentTeamDistans.reduce((prev, current) => {
        return (prev.stepDistans > current.stepDistans) ? prev : current;
      });
      let selectedOpponent = this.positionsTeams.filter(char => char.position === maxstepDistansOpponent.position);
      const possibleStepsIndex = isPossibleStepsIndex(maxstepDistansOpponent.position, maxstepDistansOpponent.stepDistans);
      this.generateOpponentPosition (possibleStepsIndex, maxstepDistansOpponent.position, maxstepDistansOpponent.stepDistans)
      .then((nextStep) => {
        this.positionsTeams = this.positionsTeams.filter(char => char.position !== selectedOpponent[0].position);
        selectedOpponent[0].position = nextStep
        this.positionsTeams.push(selectedOpponent[0]);
        this.gamePlay.redrawPositions(this.positionsTeams);
        this.gameState.сhangeСurrentPlayer();
        return;
      })
    }
  }

  async toAttacPlayer(index, opponent){
    const player = this.positionsTeams.filter(char => char.position === index);
    const attacker = opponent.character
    const damage =  Number((Math.max(attacker.attack - player[0].character.defence, attacker.attack * 0.1)).toFixed(1));
    await this.gamePlay.showDamage(player[0].position, damage).then(() => {
      player[0].character.health = player[0].character.health - damage
      this.gamePlay.redrawPositions(this.positionsTeams);
      if(player[0].character.health <= 0){
        this.toCharacterRemove(player[0]);
      }
      this.gameState.сhangeСurrentPlayer();
  })
  }

  checkPosition(index){
    let positions = [];
    this.positionsTeams.forEach( char => {
      positions.push(char.position)
    })
    if(positions.includes(index)){
      return false;
    } else {
      return true;
    }
  }

  async generateOpponentPosition (possibleStepsIndex, position, maxDistance) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * possibleStepsIndex.length);
    } while(!isStepPossible(position, randomIndex, maxDistance) || !this.checkPosition(randomIndex));
    return randomIndex;
  }

  resetOptions() {
    this.possibleStep = null;
    this.possibleAttack = null;
    this.selectedCellIndex = null;
    this.selectedCharacter = null;
    this.mouseEnterCell = null;
  }

  async toCharacterRemove(character){
    this.positionsTeams = this.positionsTeams.filter(char => char !== character);
    await this.gamePlay.redrawPositions(this.positionsTeams);
    return;
  }

  toMouseenterCell(){
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
      if (character && playerCharacters.includes(character.character.type) && index === character.position){
        this.gamePlay.setCursor(cursors.pointer);
        this.possibleStep = null;
        this.possibleAttack = null;
        return;
      } else if (character && !playerCharacters.includes(character.character.type) && index === character.position){
        const maxDistanceAttac = this.getAttacDistance(this.selectedCharacter.character.type);
        const possibleAttac = isStepPossible(this.selectedCellIndex, index, maxDistanceAttac);
        if(possibleAttac) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.possibleAttack = index;
          this.possibleStep = null;
          return;
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
          this.possibleStep = null;
          this.possibleAttack = null;
          return;
        }
      } else {
        const maxDistanceStep = this.getStepDistance(this.selectedCharacter.character.type);
        const possibleStep = isStepPossible(this.selectedCellIndex, index, maxDistanceStep);
        if(possibleStep){
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          this.possibleStep = index;
          this.possibleAttack = null;
          return;
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
          this.possibleStep = null;
          this.possibleAttack = null;
          return;
        }
      }
    }))
  }

  getAttacDistance(characterType){
    if(characterType === 'swordsman' || characterType === 'undead'){
      return 1;
    } else if (characterType === 'bowman' || characterType === 'vampire'){
      return 2;
    } else if (characterType === 'magician' || characterType === 'daemon'){
      return 4;
    }
  }

  getStepDistance(characterType){
    if(characterType === 'swordsman' || characterType === 'undead'){
      return 4;
    } else if (characterType === 'bowman' || characterType === 'vampire'){
      return 2;
    } else if (characterType === 'magician' || characterType === 'daemon'){
      return 1;
    }
  }

  getCharacterInfo(character){
    const {level, attack, defence, health} = character;
    const emojiLevel = String.fromCodePoint(0x1F396);
    const emojiAttak = String.fromCodePoint(0x2694);
    const emojiDefence = String.fromCodePoint(0x1F6E1);
    const emojiHealth = String.fromCodePoint(0x2764);
    return `${emojiLevel} ${level} ${emojiAttak} ${attack} ${emojiDefence} ${defence} ${emojiHealth} ${health}`;
  }

  levelUp(teamPlayers){
    if(this.gameState.level === 4) {
      return;
    }
    this.gameState.levelUp();
    this.resetOptions()
    this.team = null;
    this.opponent = null;
    let levelUpCharacters =[];
    teamPlayers.forEach(character => {
      character.character.level += 1;
      const updatedData = Mathematic.levelUp(character.character, character.character.level);
      character.character.health = updatedData.health;
      character.character.attack = updatedData.attack;
      character.character.defence = updatedData.defence;
      levelUpCharacters.push(character)
    })
    let playerCharacters = ['swordsman', 'bowman', 'magician'];
    let opponentCharacters = ['undead', 'vampire', 'daemon'];
    this.levelUpInit().then(() => {
      this.positionsTeams.forEach(char => {
        if (opponentCharacters.includes(char.character.type)){
          char.character.level = this.gameState.level;
          const updatedData = Mathematic.levelUp(char.character, this.gameState.level);
          char.character.health = updatedData.health;
          char.character.attack = updatedData.attack;
          char.character.defence = updatedData.defence;
        }
      })
      for (let i = 0; i < levelUpCharacters.length; i++) {
        this.positionsTeams.forEach(char => {
          if (playerCharacters.includes(char.character.type) && char.character.level === 1) {
            const index = this.positionsTeams.indexOf(char)
            const position = char.position;
            this.positionsTeams.splice(index, 1)
            levelUpCharacters[i].position = position
            this.positionsTeams.push(levelUpCharacters[i])
            return;
          }
        })
      }
      this.positionsTeams = this.positionsTeams.filter((char, index, self) =>
        index === self.findIndex((c) => (
          c.position === char.position
        ))
      );
      this.gamePlay.redrawPositions(this.positionsTeams);
      console.log(this.positionsTeams);
      })
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

  async generateTeams(maxLevel, characterCount){
    const players = [Bowman, Swordsman, Magician];
    const opponentPlayers = [Daemon, Undead, Vampire];
    this.team = generateTeam(players, maxLevel, characterCount);
    this.opponet = generateTeam(opponentPlayers, maxLevel, characterCount);
    await this.setPositionsAsync(this.team);
    await this.setPositionsAsync(this.opponet);
  } 

  generatePosition (character) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    let position = 0;
    let random = 2;
    while((random % 8) !== 0) {
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
      while(this.positions.includes(position)) {
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
