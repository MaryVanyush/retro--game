import Character from "../Character";

test('check generate class Character with error', () => {
    expect(() => {
        const received = new Character(1);
    }).toThrow('class "Character" cannot be instantiated directly');
  });