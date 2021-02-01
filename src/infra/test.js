import lex from './lex';
import compile from './compile';
import run from './run';
import evaluate from './evaluate';

export default function (config, testMap) {
  for (const [expression, expectedResult] of Object.entries(testMap)) {
    const lexed = lex(config, expression);
    const compiled = compile(config, lexed);
    const result = run(config, compiled);
    const verdict = deepEqual(result, expectedResult) ? 'ok' : `expected ${expectedResult}, but was ${result}`;

    console.log(
      `${expression} => ${stringifyList(lexed)} => ${stringifyList(compiled)} => ${JSON.stringify(result)}`
    );
    console.log(verdict);

    const directResult = evaluate(config, expression);
    const verdict2 = deepEqual(directResult, expectedResult) ? 'ok' : `expected ${expectedResult}, but was ${directResult}`;

    console.log(
      `${expression} => ${JSON.stringify(directResult)}`
    );
    console.log(verdict2);
  }
}

export function deepEqual(a, b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    } else {
      for (let i = 0; i < a.length; ++i) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  } else if (a instanceof Array || b instanceof Array) {
    return false;
  } else if (a instanceof Object && b instanceof Object) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();

    if (!deepEqual(aKeys, bKeys)) {
      return false;
    } else {
      return aKeys.every( key => deepEqual(a[key], b[key]) );
    }
  } else {
    return a === b;
  }
}

export function stringifyList(something) {
  return `[${something.map(x => x.toString()).join(', ')}]`;
}
