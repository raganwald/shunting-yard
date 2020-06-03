# Shunting Yard

### setup and running the examples

Prerequisites:

- A recent-ish installation of node.
- Babel (if you prefer) https://babeljs.io/docs/en/usage

Installing Babel to compile ES-whatever to node-whatever:

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

Running an example:

```bash
% npx babel src --out-dir lib && node ./lib/arithmetic.js

Successfully compiled 4 files with Babel (590ms).

(1+2)3! => 18

%
```
