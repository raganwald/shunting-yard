export default function (representationList, {
  operators,
  toValue
}) {
  const functions = new Map(
    Object.entries(operators).map(
      ([key, { symbol, fn }]) => [symbol, fn]
    )
  );

  const stack = [];

  for (const element of representationList) {
    if (typeof element === 'string') {
      stack.push(toValue(element));
    } else if (functions.has(element)) {
      const fn = functions.get(element);
      const arity = fn.length;

      if (stack.length < arity) {
        error(`Not enough values on the stack to use ${element}`)
      } else {
        const args = [];

        for (let counter = 0; counter < arity; ++counter) {
          args.unshift(stack.pop());
        }

        stack.push(fn.apply(null, args))
      }
    } else {
      error(`Don't know what to do with ${element}'`)
    }
  }
  if (stack.length === 0) {
    return undefined;
  } else if (stack.length > 1) {
    error(`should only be one value to return, but there were ${stack.length} values on the stack`);
  } else {
    return stack[0];
  }
}