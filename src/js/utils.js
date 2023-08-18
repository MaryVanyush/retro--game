/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * @example
 * ```js
 * */
export function calcTileType(index, boardSize) {
  const topLeft = 0;
  if (topLeft === index) return 'top-left';
  const topRight = boardSize - 1;
  if (topRight === index) return 'top-right';
  const bottomRight = (boardSize * boardSize) - 1;
  if (bottomRight === index) return 'bottom-right';
  const bottomLeft = bottomRight - (boardSize - 1)
  if (bottomLeft === index) return 'bottom-left';
  if (index >= 1 && index <= (boardSize - 2)) return 'top';
  if (index >= (bottomLeft + 1) && index <= (bottomRight - 1)) return 'bottom';
  if (index % boardSize === 0) return 'left';
  if ((index + 1) % boardSize === 0) return 'right';
  return 'center';
}




export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
