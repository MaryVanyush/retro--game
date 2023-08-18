import Magician from "../characters/Magician";

test('check clase Magician', () => {
    const received = new Magician(1);
    const expected = {
      attack: 10, defence: 40, health: 50, level: 1, type: 'magician',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Magician with error level', () => {
    expect(() => {
        const received = new Magician(8);
    }).toThrow('error level');
  });