import error from './error';

export default function (
  {
    operators,
    defaultOperator,
    escapeSymbol = '`',
    escapedValue = string => string
  },
  originalinput // lex'd into an array
) {
  const input = [...originalinput];
  const operatorsMap = new Map(
    Object.entries(operators)
  );

  const representationOf =
    something => {
      if (operatorsMap.has(something)) {
        const configSomething = operatorsMap.get(something);

        // console.log(`getting representation of ${something} from ${JSON.stringify(Object.keys(configSomething))}`);

        // console.log(configSomething.symbol);

        const { symbol } = configSomething;

        // console.log(symbol);

        return symbol;
      } else if (typeof something === 'string') {
        return something;
      } else {
        error(`${something} is not a value`);
      }
    };
  const typeOf =
    symbol => operatorsMap.has(symbol) ? operatorsMap.get(symbol).type : 'value';
  const isInfix =
    symbol => typeOf(symbol) === 'infix';
  const isPrefix =
    symbol => typeOf(symbol) === 'prefix';
  const isPostfix =
    symbol => typeOf(symbol) === 'postfix';
  const isCombinator =
    symbol => isInfix(symbol) || isPrefix(symbol) || isPostfix(symbol);
  const awaitsValue =
    symbol => isInfix(symbol) || isPrefix(symbol);

  const hasDefaultOperator = defaultOperator != null && operatorsMap.has(defaultOperator);
  const operatorStack = [];
  const reversePolishRepresentation = [];
  let awaitingValue = true;

  // console.log(JSON.stringify(input))

  const unshiftDefaultOperatorIfPresent =
    hasDefaultOperator ? () => input.unshift(defaultOperator) : () => undefined;

  while (input.length > 0) {
    const symbol = input.shift();

    // console.log(`symbol: ${symbol}, input: ${JSON.stringify(input)}, operatorStack: ${JSON.stringify(operatorStack)}`);

    if (symbol === escapeSymbol) {
      if (input.length === 0) {
        error('Escape symbol ${escapeSymbol} has no following symbol');
      } else {
        const valueSymbol = input.shift();

        if (awaitingValue) {
          // push the escaped value of the symbol

          reversePolishRepresentation.push(escapedValue(valueSymbol));
        } else {
          // value catenation

          input.unshift(valueSymbol);
          input.unshift(escapeSymbol);
          unshiftDefaultOperatorIfPresent();
        }
        awaitingValue = false;
      }
    } else if (symbol === '(' && awaitingValue) {
      // opening parenthesis case, going to build
      // a value
      operatorStack.push(symbol);
      awaitingValue = true;
    } else if (symbol === '(') {
      input.unshift(symbol);
      unshiftDefaultOperatorIfPresent();
      awaitingValue = false;
    } else if (symbol === ')') {
      // closing parenthesis case, clear the
      // operator stack

      while (operatorStack.length > 0 && peek(operatorStack) !== '(') {
        const jssop = JSON.stringify(operatorStack);

        const op = operatorStack.pop();

        // console.log(`popping ${op} off ${jssop}`);

        const r = representationOf(op);

        // console.log(`pushing ${op} of type ${typeof r} onto ${JSON.stringify(reversePolishRepresentation)}`)

        reversePolishRepresentation.push(r);

        // console.log(reversePolishRepresentation.map(x  => x.toString()).join(', '))
      }

      if (peek(operatorStack) === '(') {
        operatorStack.pop();
        awaitingValue = false;
      } else {
        error('Unbalanced parentheses');
      }
    } else if (isPrefix(symbol)) {
      if (awaitingValue) {
        const { precedence } = operatorsMap.get(symbol);

        // pop higher-precedence operators off the operator stack
        while (isCombinator(symbol) && operatorStack.length > 0 && peek(operatorStack) !== '(') {
          const opPrecedence = operatorsMap.get(peek(operatorStack)).precedence;

          if (precedence < opPrecedence) {
            const op = operatorStack.pop();

            reversePolishRepresentation.push(representationOf(op));
          } else {
            break;
          }
        }

        operatorStack.push(symbol);
        awaitingValue = awaitsValue(symbol);
      } else {
        // value catenation

        input.unshift(symbol);
        unshiftDefaultOperatorIfPresent();
        awaitingValue = false;
      }
    } else if (isCombinator(symbol)) {
      const { precedence } = operatorsMap.get(symbol);

      // pop higher-precedence operators off the operator stack
      while (isCombinator(symbol) && operatorStack.length > 0 && peek(operatorStack) !== '(') {
        const opPrecedence = operatorsMap.get(peek(operatorStack)).precedence;

        if (precedence < opPrecedence) {
          const op = operatorStack.pop();

          reversePolishRepresentation.push(representationOf(op));
        } else {
          break;
        }
      }

      operatorStack.push(symbol);
      awaitingValue = awaitsValue(symbol);
    } else if (awaitingValue) {
      // as expected, go straight to the output

      reversePolishRepresentation.push(representationOf(symbol));
      awaitingValue = false;
    } else {
      // value catenation

      input.unshift(symbol);
      unshiftDefaultOperatorIfPresent();
      awaitingValue = false;
    }
  }

  // pop remaining symbols off the stack and push them
  while (operatorStack.length > 0) {
    const op = operatorStack.pop();

    if (operatorsMap.has(op)) {
      const { symbol: opSymbol } = operatorsMap.get(op);
      reversePolishRepresentation.push(opSymbol);
    } else {
      error(`Don't know how to push operator ${op}`);
    }
  }

  return reversePolishRepresentation;
}



function peek(stack) {
  return stack[stack.length - 1];
}
