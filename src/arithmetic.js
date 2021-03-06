import test from './infra/test';

const arithmetic = {
  operators: {
    '+': {
      symbol: Symbol('+'),
      type: 'infix',
      precedence: 1,
      fn: (a, b) => a + b
    },
    '-': {
      symbol: Symbol('-'),
      type: 'infix',
      precedence: 1,
      fn: (a, b) => a - b
    },
    '*': {
      symbol: Symbol('*'),
      type: 'infix',
      precedence: 3,
      fn: (a, b) => a * b
    },
    '/': {
      symbol: Symbol('/'),
      type: 'infix',
      precedence: 2,
      fn: (a, b) => a / b
    },
    '!': {
      symbol: Symbol('!'),
      type: 'postfix',
      precedence: 4,
      fn: function factorial (a, memo = 1) {
        if (a < 2) {
          return a * memo;
        } else {
          return factorial(a - 1, a * memo);
        }
      }
    }
  },
  defaultOperator: '*',
  toValue: n => +n
};

test(arithmetic, {
  '1': 1,
  '(1)': 1,
  '(1+2)3!': 18,
  '((1+2)3)!': 362880,
  '1+2+3+4+5+6+7+8+9+0': 45
});
