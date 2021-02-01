import run from './run';
import compile from './compile';
import lex from './lex';

export default function (definition, expression) {
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