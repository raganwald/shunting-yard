import evaluate from './infra/evaluate';

const arithmetic = {
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
      fn: (a, b) => (console.log(`${JSON.stringify(a)} . ${JSON.stringify(b)}`), [a, ...b])
    }
  },
  toValue: n => +n
};

const expressions = [
  // '1.2.3.∅',
  // '1 . 2 . 3 . ∅',
  '12.34.56.∅'
];

for (const expression of expressions) {
  console.log(
    `${expression} => ${JSON.stringify(evaluate(arithmetic, expression))}`
  );
}
