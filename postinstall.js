const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const log = (message) => console.warn(chalk.white(message));

const FILES = {
  eslintrc: {
    source: 'eslintrc.js',
    destination: '.eslintrc.js',
    rewrite: true
  },
  eslintignore: {
    source: '.eslintignore',
    destination: '.eslintignore',
    rewrite: true
  },
  prettierrc: {
    source: '.prettierrc',
    destination: '.prettierrc',
    rewrite: true
  },
  tsConfig: {
    source: 'tsconfig.json',
    destination: 'tsconfig.json',
    rewrite: true
  },
  customEslint: {
    source: 'default-eslint.js',
    destination: '.custom-eslint.js',
    rewrite: false
  },
};

const customEslintJsonPath = path.join('../../', '.custom-eslint.js');
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

    let eslintJson = {};
    if (fs.existsSync(customEslintJsonPath)) eslintJson = require('../../.custom-eslint.js')

    if ((fs.existsSync(destination) && value.rewrite) || !fs.existsSync(destination)) {
      if (fs.existsSync(destination) && value.rewrite) fs.unlinkSync(destination);

      log(`Copy file ${source} to ${destination}`);
      if (key === 'tsConfig' && eslintJson.plugins.typescript === 'off') {
        // we don't copy ts config if typescript is off
      } else fs.copyFileSync(source, destination);
    }
  });

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // at this point .custom-eslint.js is generated so we can access it
  const { root } = require('../../.custom-eslint.js');
  packageJson.scripts.lint = `eslint --color "${root}/**/*.{js,ts,jsx,tsx}"`;
  packageJson.scripts[`lint:fix`] = `eslint --fix "${root}/**/*.{js,ts,jsx,tsx}"`;
  packageJson.scripts[`prettier:fix`] = `prettier --write "${root}/**/*.{js,ts,jsx,tsx}"`;
  packageJson.scripts[`lint:check`] = `prettier -l "${root}/**/*.{js,ts,jsx,tsx}"`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

run();
