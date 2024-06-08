const path = require('path');
const fs = require('fs');
const { generate } = require('./eslint');

const customEslintJsonPath = path.join('../../', 'custom-eslint.js');
const defaultEslintJsonPath = path.join(process.cwd(), 'default-eslint.js');
const packageJsonPath = path.join(process.cwd(), 'package.json');

const run = () => {
  const disabledPackages = [];
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  let eslintJsonPath = '';
  if (fs.existsSync(customEslintJsonPath)) eslintJsonPath = customEslintJsonPath;
  else eslintJsonPath = defaultEslintJsonPath;

  const eslintJson = require(eslintJsonPath);
  
  if (eslintJson.typescript === 'off') {
    // drop typescript rules and dependencies
    delete packageJson.dependencies['@typescript-eslint/eslint-plugin'];
    delete packageJson.dependencies['@typescript-eslint/parser'];
    delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    disabledPackages.push('typescript');
  }

  if (eslintJson.react === 'off') {
    // drop react rules and dependencies
    delete packageJson.dependencies['eslint-plugin-react'];
    delete packageJson.dependencies['@babel/preset-react'];
    disabledPackages.push('react');
  }

  if (eslintJson['react-hooks'] === 'off') {
    // drop reactHooks rules and dependencies
    delete packageJson.dependencies['eslint-plugin-react-hooks'];
    disabledPackages.push('react-hooks');
  }

  if (eslintJson.node === 'off') {
    // drop node rules and dependencies
    delete packageJson.dependencies['eslint-plugin-node'];
    disabledPackages.push('node');
  }

  if (eslintJson.airbnb === 'off') {
    // drop airbnb rules and dependencies
    delete packageJson.dependencies['eslint-config-airbnb'];
    delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    disabledPackages.push('airbnb');
  }

  if (eslintJson.prettier === 'off') {
    // drop prettier rules and dependencies
    delete packageJson.dependencies['prettier'];
    delete packageJson.dependencies['eslint-plugin-prettier'];
    delete packageJson.dependencies['eslint-plugin-prettier'];
    disabledPackages.push('prettier');
  }

  if (eslintJson.promise === 'off') {
    // drop promise rules and dependencies
    delete packageJson.dependencies['eslint-plugin-promise'];
    disabledPackages.push('promise');
  }

  if (eslintJson['jsx-a11y'] === 'off') {
    // drop jsx-a11y rules and dependencies
    delete packageJson.dependencies['eslint-plugin-jsx-a11y'];
    disabledPackages.push('jsx-a11y');
  }

  if (eslintJson.sonarjs === 'off') {
    // drop sonarjs rules and dependencies
    delete packageJson.dependencies['eslint-plugin-sonarjs'];
    disabledPackages.push('sonarjs');
  }

  if (eslintJson.import === 'off') {
    // drop import rules and dependencies
    delete packageJson.dependencies['eslint-plugin-import'];
    disabledPackages.push('import');
  }

  generate(disabledPackages);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

run();
