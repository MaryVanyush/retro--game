import Vampire from "../characters/Vampire";

test('check clase Vampire', () => {
    const received = new Vampire(1);
    const expected = {
      attack: 25, defence: 25, health: 50, level: 1, type: 'vampire',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Vampire with error level', () => {
    expect(() => {
        const received = new Vampire(8);
    }).toThrow('error level');
  });