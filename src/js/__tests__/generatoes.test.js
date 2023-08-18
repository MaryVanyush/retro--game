import { characterGenerator, generateTeam } from '../generators'
import Bowman from '../characters/Bowman'
import Swordsman from '../characters/Swordsman'
import Magician from '../characters/Magician'

test('checking characterGenerator function for correct class types', () => {
    const players = [];
    const received = [];
    const types = ['bowman', 'swordsman', 'magician'];
    const classes = [Bowman, Swordsman, Magician];
    const playerGenerator = characterGenerator(classes, 4);
    players.push(playerGenerator.next().value);
    players.push(playerGenerator.next().value);
    players.push(playerGenerator.next().value);
    players.forEach(player => {
        if (types.includes(player.type)) received.push(true);
    })
    const expected = [true, true, true];
    expect(received).toEqual(expected);
});

test('checking characterGenerator function for correct class levels', () => {
    const players = [];
    const received = [];
    const classes = [Bowman, Swordsman, Magician];
    const playerGenerator = characterGenerator(classes, 4);
    players.push(playerGenerator.next().value);
    players.push(playerGenerator.next().value);
    players.push(playerGenerator.next().value);
    players.forEach(player => {
        if (player.level >= 1 && player.level <= 4) received.push(true);
    })
    const expected = [true, true, true];
    expect(received).toEqual(expected);
});

test('checking generateTeam function for correct characterCount', () => {
    const players = [Bowman, Swordsman, Magician];
    const team = generateTeam(players, 3, 4)
    const received = team.characters.length;
    expect(received).toEqual(4);
});

test('checking generateTeam function for correct maxLevel', () => {
    const players = [Bowman, Swordsman, Magician];
    const team = generateTeam(players, 3, 4)
    const received = [];
    team.characters.forEach(player => {
        if (player.level >= 1 && player.level <= 3) received.push(true);
    });
    const expected = [true, true, true, true];
    expect(received).toEqual(expected);
});