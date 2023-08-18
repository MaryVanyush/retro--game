import { isStepPossible } from "../isStepPossible";

test('checking isStepPossible', () => {
    const received = [];
    received.push(isStepPossible(63, 53, 2));
    received.push(isStepPossible(28, 55, 4));
    received.push(isStepPossible(0, 9, 1));
    received.push(isStepPossible(23, 24, 1));
    received.push(isStepPossible(16, 20, 4));
    const expected = [false, true, true, false, true];
    expect(received).toEqual(expected);
});
