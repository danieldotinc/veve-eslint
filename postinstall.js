const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const log = (message) => console.warn(chalk.white(message)); // eslint-disable-line

const FILES = {
  // eslintignore: {
  //   source: '.eslintignore',
  //   destination: '.eslintignore',
  // },
  eslintrc: {
    source: 'eslintrc.js',
    destination: '.eslintrc.js',
  },
  // jestConfig: {
  //   source: 'jest.config.js',
  //   destination: 'jest.config.js',
  // },
  // nodemonConfig: {
  //   source: 'nodemon.json',
  //   destination: 'nodemon.json',
  //   onlyService: true,
  //   onlyCopyIfNotExists: true,
  // },
  // prettierrc: {
  //   source: 'prettierrc',
  //   destination: '.prettierrc',
  // },
  // testJson: {
  //   source: 'test.json',
  //   destination: 'config/test.json',
  //   onlyCopyIfNotExists: true,
  // },
  tsConfig: {
    source: 'tsconfig.json',
    destination: 'tsconfig.json',
  },
  // prodTsConfig: {
  //   source: 'tsconfig.prod.json',
  //   destination: 'tsconfig.prod.json',
  // },
};

const packageJsonPath = path.join('../../', 'package.json');
const oldEslintrcPath = path.join('../../', '.eslintrc.js');

const run = () => {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Skipping install. because no parent package.json found');
    process.exit(0);
  }

  // remove old .eslintrc file
  if (fs.existsSync(oldEslintrcPath)) {
    fs.unlinkSync(oldEslintrcPath);
  }

  Object.entries(FILES).forEach(([key, value]) => {
    const source = path.join(process.cwd(), value.source);
    const destination = path.join('../../', value.destination);

    if (!value.onlyCopyIfNotExists || !fs.existsSync(destination)) {
      log(`Copy file ${source} to ${destination}`);
      fs.copyFileSync(source, destination);
    }
  });

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.main = `dist/`;
  packageJson.scripts['compile'] = `tsc -p ./tsconfig.json`;
  // packageJson.scripts['test'] = `jest`;
  // packageJson.scripts['test:report'] = 'yarn test -- --coverage --ci';
  // packageJson.scripts['test:watch'] = 'yarn test -- --watch';
  packageJson.scripts['lint'] = 'eslint --color \"src/**/*.{js,ts,jsx,tsx}\"';
  packageJson.scripts['lint:fix'] = 'eslint --fix \"src/**/*.{js,ts,jsx,tsx}\"';
  packageJson.scripts['prettier:fix'] = 'prettier --write \"src/**/*.{js,ts,jsx,tsx}\"';
  packageJson.scripts['lint:check'] = 'prettier -l \"src/**/*.{js,ts,jsx,tsx}\"';
  packageJson.scripts['prebuild'] = 'yran lint';
  packageJson.scripts['prestart'] = 'yran lint';
  packageJson.scripts['pretest'] = 'yarn lint';
};

run();