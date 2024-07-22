const path = require('path');
const fs = require('fs');
const { generate } = require('./eslint');

const customEslintJsonPath = path.join('./test/', '.custom-eslint.js');
const defaultEslintJsonPath = path.join(process.cwd(), 'default-eslint.js');
const packageJsonPath = path.join(process.cwd(), 'package.json');

const run = () => {
  // const disabledPackages = [];
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  let eslintJsonPath = '';
  if (fs.existsSync(customEslintJsonPath)) eslintJsonPath = customEslintJsonPath;
  else eslintJsonPath = defaultEslintJsonPath;

  const { plugins } = require(eslintJsonPath);
  
  if (plugins.typescript === 'off') {
    // drop typescript rules and dependencies
    delete packageJson.dependencies['@typescript-eslint/eslint-plugin'];
    delete packageJson.dependencies['@typescript-eslint/parser'];
    delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    // disabledPackages.push('typescript');
  }

  if (plugins.react === 'off') {
    // drop react rules and dependencies
    delete packageJson.dependencies['eslint-plugin-react'];
    delete packageJson.dependencies['@babel/preset-react'];
    // disabledPackages.push('react');
  }

  if (plugins['react-hooks'] === 'off') {
    // drop reactHooks rules and dependencies
    delete packageJson.dependencies['eslint-plugin-react-hooks'];
    // disabledPackages.push('react-hooks');
  }

  if (plugins.airbnb === 'off') {
    // drop airbnb rules and dependencies
    delete packageJson.dependencies['eslint-config-airbnb-base'];
    delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    // disabledPackages.push('airbnb');
  }

  if (plugins.prettier === 'off') {
    // drop prettier rules and dependencies
    delete packageJson.dependencies['prettier'];
    delete packageJson.dependencies['eslint-plugin-prettier'];
    delete packageJson.dependencies['eslint-plugin-prettier'];
    // disabledPackages.push('prettier');
  }

  if (plugins.promise === 'off') {
    // drop promise rules and dependencies
    delete packageJson.dependencies['eslint-plugin-promise'];
    // disabledPackages.push('promise');
  }

  if (plugins['jsx-a11y'] === 'off') {
    // drop jsx-a11y rules and dependencies
    delete packageJson.dependencies['eslint-plugin-jsx-a11y'];
    // disabledPackages.push('jsx-a11y');
  }

  if (plugins.sonarjs === 'off') {
    // drop sonarjs rules and dependencies
    delete packageJson.dependencies['eslint-plugin-sonarjs'];
    // disabledPackages.push('sonarjs');
  }

  if (plugins.import === 'off') {
    // drop import rules and dependencies
    delete packageJson.dependencies['eslint-plugin-import'];
    // disabledPackages.push('import');
  }

  // if (plugins.node === 'off') {
  //   // drop node rules and dependencies
  //   disabledPackages.push('node');
  // }

  generate({config: {plugins}});
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

run();
