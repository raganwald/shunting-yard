import error from './error';

// takes as input raw text, returns an array of symbols
// config.operators is a dictionary, with each key being an operator
// this version only supports single-character operators
export default function (config, input) {
  if (typeof input !== 'string') {
    error(config, `Don't know how to lex #{JSON.stringify(input.inspect)}`);
  }

  // operators that automatically break symbols apart
  // TODO: sort by descending order of length for the
  // purpose of disambiguating the && operator from &,
  // if we ever want that
  const breakingOperators = Object.keys(config.operators).filter(
    key => key.match(/^[a-zA-Z]/) == null
  ).map(
    op => op.toString()
  );
  const parentheses = ['(', ')'];
  const significantChunks = breakingOperators.concat(parentheses);

  // split on whitespace
  // TODO: make whitespace breaking configurable?
  // seems unlikely
  const strings = input.split(/\s+/);

  return split_strings_on_significant_chunks(strings, significantChunks);
}

function split_strings_on_significant_chunks(strings, chunks = []) {
  console.log('split_strings_on_significant_chunks', JSON.stringify(strings), JSON.stringify(chunks));

  if (chunks.length === 0) {
    return strings;
  } else {
    // TODO: flatten linear recursion
    const chunk = chunks[0];
    const postSplitStrings = strings.flatMap(
      str => split_on_a_significant_chunk(str, chunk)
    );

    // console.log(`chunk: ${JSON.stringify(chunk)}, postSplitStrings: ${JSON.stringify(postSplitStrings)}`)

    return split_strings_on_significant_chunks(
      postSplitStrings,
      chunks.slice(1)
    );
  }
}

// split each string around significant chunks,
// but keep the chunks
function split_on_a_significant_chunk(str, chunk) {
  console.log('split_on_a_significant_chunk', JSON.stringify(str), JSON.stringify(chunk));

  if (str.length === 0) {
    return [];
  } else if (str === chunk) {
    return [str];
  } else if (str.startsWith(chunk)) {
    return [chunk].concat(split_on_a_significant_chunk(str.slice(chunk.size), chunk));
  } else if (str.endsWith(chunk)) {
    const strUptoChunk = str.slice(0, str.length - chunk.length - 1);

    // console.log(`strUptoChunk: ${strUptoChunk}`);

    return split_on_a_significant_chunk(strUptoChunk, chunk).concat([chunk]);
  } else {
    const substrings = str.split(chunk);
    const first = substrings[0];
    const rest = substrings.slice(1).flatMap( substrings => [chunk, substrings] );

    // console.log(`first: ${JSON.stringify(first)}, rest: ${JSON.stringify(rest)}`)

    rest.unshift(first);
    return rest;
  }
}