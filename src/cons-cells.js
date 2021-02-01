import test from './infra/test';

const cells = {
  operators: {
    '∅': {
      symbol: Symbol('∅'),
      type: 'atomic',
      fn: () => []
    },
    '.': {
      symbol: Symbol('.'),
      type: 'infix',
      precedence: 2,
      fn: (a, b) => [a, ...b]
    }
  },
  toValue: n => +n
};

test(cells, {
  '1.2.3.∅': [1, 2, 3],
  '1 . 2 . 3 . ∅': [1, 2, 3],
  '12.34.56.∅': [12, 34, 56]
});