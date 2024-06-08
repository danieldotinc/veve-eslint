const fs = require('fs');
const path = require('path');
const eslintrc = require('./defaultEslintConfig');

const generate = (packageNames) => {
    const config = { ...eslintrc };

    if (config.extends) {
        for (const packageName of packageNames) {
        config.extends = config.extends.filter((item) => item.includes(packageName));
        }
    }

    if (config.rules) {
        for (const rule in config.rules) {
        for (const packageName of packageNames) {
            if (rule.includes(packageName)) delete config.rules[rule];
        }
        }
    }

    const modifiedConfigString = `module.exports = ${JSON.stringify(config, null, 2)};`;

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
