import Undead from "../characters/Undead";

test('check clase Undead', () => {
    const received = new Undead(1);
    const expected = {
      attack: 40, defence: 10, health: 50, level: 1, type: 'undead',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Undead with error level', () => {
    expect(() => {
        const received = new Undead(8);
    }).toThrow('error level');
  });