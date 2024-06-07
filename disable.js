const fs = require('fs');
const path = require('path');

const disable = (packageNames) => {
  // Path to the original JavaScript file
  const eslintPath = path.join(process.cwd(), 'eslintrc.json');

  // Read the original file
  fs.readFile(eslintPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Evaluate the file content to get the JavaScript object
    let config;
    try {
      config = eval(data);
    } catch (error) {
      console.error('Error parsing the file:', error);
      return;
    }

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

    // Convert the modified object back to a string
    const modifiedConfigString = `module.exports = ${JSON.stringify(config, null, 2)};`;

    // Write the modified string back to the original file or a new file
    fs.writeFile(eslintPath, modifiedConfigString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('File has been modified successfully.');
    });
  });
};

module.export = disable;
