import Bowman from "../characters/Bowman";

test('check clase Bowman', () => {
    const received = new Bowman(1);
    const expected = {
      attack: 25, defence: 25, health: 50, level: 1, type: 'bowman',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Bowman with error level', () => {
    expect(() => {
        const received = new Bowman(8);
    }).toThrow('error level');
  });
