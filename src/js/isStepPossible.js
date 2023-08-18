/**
 * @param index - индекс поля для перемещения
 * @param position - позиция игрока/противника
 * @maxDistance - максимальная дистанция одного хода для игрока/противника
 * */


function getDistance(position, index) {
  const x1 = position % 8;
  const y1 = Math.floor(position / 8);
  const x2 = index % 8;
  const y2 = Math.floor(index / 8);
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
}

export function isStepPossible(position, index, maxDistance) {
    const distance = getDistance(position, index).toFixed(0);
    if(maxDistance === 4){
        if (distance === 0 || distance - 2 > maxDistance) {
            return false;
        }
    }
    if(maxDistance === 2){
        if (distance === 0 || distance - 1 > maxDistance) {
            return false;
        }
    }
    if(maxDistance === 1){
        if (distance === 0 || distance  > maxDistance) {
            return false;
        }
    }
    const x1 = position % 8;
    const y1 = Math.floor(position / 8);
    const x2 = index % 8;
    const y2 = Math.floor(index / 8);
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    if (dx > maxDistance || dy > maxDistance) {
      return false;
    }
    if (dx === 0 && dy === 0) {
      return false;
    }
    const stepX = x1 < x2 ? 1 : x1 > x2 ? -1 : 0;
    const stepY = y1 < y2 ? 1 : y1 > y2 ? -1 : 0;
    let currentX = x1 + stepX;
    let currentY = y1 + stepY;
    let steps = 1;
    while (currentX !== x2 || currentY !== y2) {
      if (currentX < 0 || currentX > 7 || currentY < 0 || currentY > 7) {
        return false;
      }
      currentX += stepX;
      currentY += stepY;
      steps++;
      if (steps > maxDistance) {
        return false;
      }
    }
    return true;
  }

  export function isPossibleStepsIndex(position, maxDistance){
    let arrOfSteps = [1, -1, 7, 8, 9, -7, -8, -9];
    if(maxDistance === 1){
      const possibleStepsIndex = [];
      arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
      return possibleStepsIndex;
    }
    if(maxDistance === 2){
      arrOfSteps = [...arrOfSteps, ...arrOfSteps.map(el => el * 2)];
      const possibleStepsIndex = [];
      arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
      return possibleStepsIndex;
    }
    if(maxDistance === 4){
      arrOfSteps = [
        ...arrOfSteps, 
        ...arrOfSteps.map(el => el * 2), 
        ...arrOfSteps.map(el => el * 3), 
        ...arrOfSteps.map(el => el * 4), 
      ];
      const possibleStepsIndex = [];
      arrOfSteps.forEach(el => possibleStepsIndex.push(position + el));
      return possibleStepsIndex;
    }
  }