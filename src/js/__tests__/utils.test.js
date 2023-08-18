import { calcTileType, calcHealthLevel } from "../utils"

test('check calcTileType', () => {
    let  received = []
    received.push(calcTileType(0, 8));
    received.push(calcTileType(1, 8));
    received.push(calcTileType(63, 8));
    received.push(calcTileType(7, 7));
    const expected = ["top-left", "top", "bottom-right", "left"];
    expect(received).toEqual(expected);
  });