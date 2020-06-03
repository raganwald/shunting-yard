import stackMachine from './stack-machine';
import shuntingYard from './shunting-yard';

export default function (expression, definition) {
  return stackMachine(
    shuntingYard(
      expression, definition
    ),
    definition
  );
}