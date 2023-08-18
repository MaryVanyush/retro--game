import Daemon from "../characters/Daemon";

test('check clase Daemon', () => {
    const received = new Daemon(1);
    const expected = {
      attack: 10, defence: 10, health: 50, level: 1, type: 'daemon',
    };
    expect(received).toEqual(expected);
  });

  test('check clase Daemon with error level', () => {
    expect(() => {
        const received = new Daemon(8);
    }).toThrow('error level');
  });