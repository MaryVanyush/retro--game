import GameStateService from "../GameStateService";

const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  
  test('checking GameStateService load method', () => {
    const mockLoad = jest.fn(() => ({}));
    jest.spyOn(GameStateService.prototype, 'load').mockImplementation(mockLoad);
    const gameState = new GameStateService(localStorageMock);
    gameState.save({});
    const expected = {};
    const received = gameState.load();
    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(received).toEqual(expected);
  });