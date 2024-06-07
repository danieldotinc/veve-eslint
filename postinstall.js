const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const log = (message) => console.warn(chalk.white(message));

const FILES = {
  eslintrc: {
    source: 'eslintrc.js',
    destination: '.eslintrc.js',
  },
  prettierrc: {
    source: '.prettierrc',
    destination: '.prettierrc',
  },
  tsConfig: {
    source: 'tsconfig.json',
    destination: 'tsconfig.json',
  },
  veveEslint: {
    source: 'veve-eslint.json',
    destination: 'veve-eslint.json',
  },
};

const packageJsonPath = path.join('../../', 'package.json');
const oldEslintrcPath = path.join('../../', '.eslintrc.js');

const run = () => {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Skipping install. because no parent package.json found');
    process.exit(0);
  }

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

  packageJson.scripts.lint = 'eslint --color "src/**/*.{js,ts,jsx,tsx}"';
  packageJson.scripts['lint:fix'] = 'eslint --fix "src/**/*.{js,ts,jsx,tsx}"';
  packageJson.scripts['prettier:fix'] = 'prettier --write "src/**/*.{js,ts,jsx,tsx}"';
  packageJson.scripts['lint:check'] = 'prettier -l "src/**/*.{js,ts,jsx,tsx}"';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

run();
