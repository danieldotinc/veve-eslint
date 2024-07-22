const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const log = (message) => console.warn(chalk.white(message));

const FILES = {
  eslintrc: {
    source: 'eslintrc.js',
    destination: 'eslint.config.mjs'
  },
  prettierrc: {
    source: '.prettierrc',
    destination: '.prettierrc'
  },
  tsconfig: {
    source: 'tsconfig.json',
    destination: 'tsconfig.json'
  },
  customEslint: {
    source: 'default-eslint.js',
    destination: '.custom-eslint.js'
  },
};

const customEslintJsonPath = path.join('./test/', '.custom-eslint.js');
const packageJsonPath = path.join('./test/', 'package.json');

const run = () => {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Skipping install. because no parent package.json found');
    process.exit(0);
  }
  
  Object.entries(FILES).forEach(([key, value]) => {
    const source = path.join(process.cwd(), value.source);
    const destination = path.join('./test/', value.destination);

    let eslintJson;
    if (fs.existsSync(customEslintJsonPath)) eslintJson = require('./test/.custom-eslint.js')
    else eslintJson = require('./default-eslint.js');

    if ((fs.existsSync(destination) && eslintJson.overwrite?.[key] == 'on') || !fs.existsSync(destination)) {
      if (fs.existsSync(destination) && eslintJson.overwrite?.[key] == 'on') fs.unlinkSync(destination);

      log(`Copy file ${source} to ${destination}`);
      if (key === 'tsconfig' && eslintJson.plugins.typescript === 'off') {
        // we don't copy ts config if typescript is off
      } else fs.copyFileSync(source, destination);
    }
  });

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // at this point .custom-eslint.js is generated so we can access it
  const { root } = require('./test/.custom-eslint.js');
  packageJson.scripts['lint'] = `eslint --color "${root}/"`;
  packageJson.scripts[`lint:fix`] = `eslint --fix "${root}/"`;
  packageJson.scripts[`prettier:fix`] = `prettier --write "${root}/**/*.{js,ts,jsx,tsx}"`;
  packageJson.scripts[`lint:check`] = `prettier -l "${root}/**/*.{js,ts,jsx,tsx}"`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

run();
