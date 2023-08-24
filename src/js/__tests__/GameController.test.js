import GameController from "../GameController";
import Bowman from "../characters/Bowman";
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import 'mock-local-storage';

test('checking getCharacterInfo method for correct info', () => {
    const character = new Bowman(1);
    const controller = new GameController();
    const received = controller.getCharacterInfo(character);
    const emojiLevel = String.fromCodePoint(0x1F396);
    const emojiAttak = String.fromCodePoint(0x2694);
    const emojiDefence = String.fromCodePoint(0x1F6E1);
    const emojiHealth = String.fromCodePoint(0x2764);
    const expected = `${emojiLevel} ${1} ${emojiAttak} ${25} ${emojiDefence} ${25} ${emojiHealth} ${50}`;
    expect(received).toEqual(expected);
});

test('checking getAttacDistance method for Swordsman', () => {
    const character = new Swordsman(1);
    const controller = new GameController();
    const received = controller.getAttacDistance(character.type);
    const expected = 1;
    expect(received).toBe(expected);
});

test('checking getAttacDistance method Magician', () => {
    const character = new Magician(1);
    const controller = new GameController();
    const received = controller.getAttacDistance(character.type);
    const expected = 4;
    expect(received).toBe(expected);
});

test('checking getStepDistance method for Swordsman', () => {
    const character = new Swordsman(1);
    const controller = new GameController();
    const received = controller.getStepDistance(character.type);
    const expected = 4;
    expect(received).toBe(expected);
});

test('checking getStepDistance method for Vampire', () => {
    const character = new Vampire(1);
    const controller = new GameController();
    const received = controller.getStepDistance(character.type);
    const expected = 2;
    expect(received).toBe(expected);
});