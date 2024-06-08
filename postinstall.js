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
  customEslint: {
    source: 'default-eslint.js',
    destination: 'custom-eslint.js',
  },
};

const customEslintJsonPath = path.join('../../', 'custom-eslint.js');
const packageJsonPath = path.join('../../', 'package.json');
const oldEslintrcPath = path.join('../../', '.eslintrc.js');

const run = () => {
  if (!fs.existsSync(packageJsonPath) || !fs.existsSync(customEslintJsonPath)) {
    console.error('Skipping install. because no parent package.json found');
    process.exit(0);
  }

  const eslintJson = JSON.parse(fs.readFileSync(customEslintJsonPath, 'utf-8'));

  if (fs.existsSync(oldEslintrcPath)) {
    fs.unlinkSync(oldEslintrcPath);
  }

  Object.entries(FILES).forEach(([key, value]) => {
    const source = path.join(process.cwd(), value.source);
    const destination = path.join('../../', value.destination);

    if (!value.onlyCopyIfNotExists || !fs.existsSync(destination)) {
      log(`Copy file ${source} to ${destination}`);
      if (key === 'tsConfig' && eslintJson.typescript === 'off') {
        // we don't copy ts config if typescript is off
      } else fs.copyFileSync(source, destination);
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
