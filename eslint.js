const fs = require('fs');
const path = require('path');
const eslintrc = require('./defaultEslintConfig');

const generate = (excludedPackageNames) => {
    const config = { ...eslintrc };

    if (config.extends) {
        for (const packageName of excludedPackageNames) {
            config.extends = config.extends.filter((item) => !item.includes(packageName));
        }
    }

    if (config.rules) {
        for (const rule in config.rules) {
            for (const packageName of excludedPackageNames) {
                if (rule.startsWith(packageName) || rule.startsWith("@" + packageName)) delete config.rules[rule];
            }
        }
    }

    let parser = `"parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"],
    "tsconfigRootDir": __dirname,
    "ecmaVersion": 2022,
    "sourceType": "module",
  },`;

    if (excludedPackageNames.includes('typescript')) {
        parser = `"parser": "@babel/eslint-parser",
  "parserOptions": {
    "requireConfigFile": false,
    "sourceType": 'module',
  },`;
    }


    let modifiedConfigString = `module.exports = ${JSON.stringify(config, null, 2)};`;
    modifiedConfigString = modifiedConfigString.replace('"parser": 1,', parser);

    const eslintPath = path.join(process.cwd(), 'eslintrc.js');
    fs.writeFile(eslintPath, modifiedConfigString, 'utf8', (err) => {
        if (err) {
        console.error('Error writing the file:', err);
        return;
        }
        console.log('File has been modified successfully.');
    });

};

module.exports = { generate };
