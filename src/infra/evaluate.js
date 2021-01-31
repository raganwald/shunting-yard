import run from './run';
import compile from './compile';
import lex from './lex';

export default function (expression, definition) {
  return run(
    definition,
    compile(
      definition,
      lex(
        definition,
        expression
      )
    )
  );
}