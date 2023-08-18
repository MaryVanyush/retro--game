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
    this.gameState = new GameState();

    this.setEventOnCell = this.setEventOnCell.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.toMouseenterCell = this.toMouseenterCell.bind(this);
    this.resetOptions = this.resetOptions.bind(this);
    this.toStepOfOpponent = this.toStepOfOpponent.bind(this);
    this.toAttacPlayer = this.toAttacPlayer.bind(this);
    this.toCharacterRemove = this.toCharacterRemove.bind(this);
    this.levelUp = this.levelUp.bind(this);
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.generateTeams(1, 4);
    this.setEventOnCell();
  }

  setEventOnCell() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellClick(index) {
    let playerCharacters = ['bowman', 'swordsman', 'magician'];
    index = this.gamePlay.cells.indexOf(event.currentTarget);
    const character = this.positionsTeams.find(char => char.position === index);
    if(this.possibleStep !== null) {
      this.positionsTeams = this.positionsTeams.filter(char => char.position !== this.selectedCellIndex);
      this.selectedCharacter.position = index;
      this.positionsTeams.push(this.selectedCharacter);
      this.gamePlay.redrawPositions(this.positionsTeams);
      this.gamePlay.deselectCell(this.selectedCellIndex);
      this.gamePlay.deselectCell(this.mouseEnterCell);
      this.resetOptions();
      this.gameState.сhangeСurrentPlayer();
      this.toStepOfOpponent()
      return;
    }
    if(this.possibleAttack !== null) {
      const attacker = this.selectedCharacter.character
      const damage =  Math.max(attacker.attack - character.character.defence, attacker.attack * 0.1);
      // после моей аттаки в момент анимации иногда зависает___________________________________________________________________________________________
      this.gamePlay.showDamage(index, damage).then(() => {
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
        // let playerTeam = [];
        // playerTeam = this.positionsTeams.filter(char => playerCharacters.includes(char.character.type));
        // if(playerTeam.length === 0){
        //   alert('Game Over')            эта логика должна быть после атаки противника
        //   return;
        // } 
        if(opponentTeam.length === 0){
          this.levelUp(this.positionsTeams);
          return;
        }
        this.gameState.сhangeСurrentPlayer();
        this.toStepOfOpponent();
      })
      return;
    }
    if (!character){
      GamePlay.showError("there is no player in this cell");
      return;
    };
    if (!playerCharacters.includes(character.character.type)){
      GamePlay.showError("this is not your character");
      return;
    }
    if (this.selectedCellIndex !== null) {
      this.gamePlay.deselectCell(this.selectedCellIndex);
    }
    this.gamePlay.selectCell(index);
    this.selectedCellIndex = character.position;
    this.selectedCharacter = character;
    this.toMouseenterCell();
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

  toAttacPlayer(index, opponent){
    const player = this.positionsTeams.filter(char => char.position === index);
    const attacker = opponent.character
    const damage =  Math.max(attacker.attack - player[0].character.defence, attacker.attack * 0.1);
    this.gamePlay.showDamage(player[0].position, damage).then(() => {
      player[0].character.health = player[0].character.health - damage
      this.gamePlay.redrawPositions(this.positionsTeams);
      if(player[0].character.health <= 0){
        this.toCharacterRemove(player[0]);
      }
      this.gameState.сhangeСurrentPlayer();
  })
  }

  // иногда попадает на одну ту же клетку с другим игроком-не проверяет на позицию других участников----------------------------------------------------------
  async generateOpponentPosition (possibleStepsIndex, position, maxDistance) {
    let randomIndex = Math.floor(Math.random() * possibleStepsIndex.length);
      while(!isStepPossible(position, randomIndex, maxDistance)) {
        randomIndex = Math.floor(Math.random() * possibleStepsIndex.length)
      }
    // while(!isStepPossible(position, randomIndex, maxDistance)) {
    //   randomIndex = Math.floor(Math.random() * possibleStepsIndex.length)
    //   }
    return randomIndex;
  }

  resetOptions() {
    this.possibleStep = null;
    this.possibleAttack = null;
    this.selectedCellIndex = null;
    this.selectedCharacter = null;
    this.mouseEnterCell = null;
  }

  toCharacterRemove(character){
    this.positionsTeams = this.positionsTeams.filter(char => char !== character);
    this.gamePlay.redrawPositions(this.positionsTeams);
    return;
  }

  toMouseenterCell(){
    console.log(this.selectedCellIndex) // вылетает undefined ----------------------------------------------------------------------------
    this.gamePlay.cells.forEach(cell => cell.addEventListener("mouseenter", () => {
      const index = this.gamePlay.cells.indexOf(event.currentTarget);
      if (this.mouseEnterCell !== null) {
        this.gamePlay.deselectCell(this.mouseEnterCell);
      }
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


  levelUp(team){
    let levelUpCharacters =[];
    team.forEach(character => {
      console.log(character);
      const updatedData = Mathematic.levelUp(character.character);
      character.character.health = updatedData.health;
      character.character.attack = updatedData.attack;
      character.character.defence = updatedData.defence;
      character.character.level += 1;
      levelUpCharacters.push(character)
    })

      console.log(levelUpCharacters);

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
