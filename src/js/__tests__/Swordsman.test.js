import Swordsman from "../characters/Swordsman";

test('check clase Swordsman', () => {
    const received = new Swordsman(1);
    const expected = {
      attack: 40, defence: 10, health: 50, level: 1, type: 'swordsman',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Swordsman with error level', () => {
    expect(() => {
        const received = new Swordsman(8);
    }).toThrow('error level');
  });