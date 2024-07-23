const fs = require('fs');
const path = require('path');
const eslintrc = require('./defaultEslintConfig');

const generate = (plugins) => {
    // use string instead of json
    // const config = { ...eslintrc };

    const content = fs.readFileSync('./defaultEslintConfig.js', 'utf8');

    const modifiedContent = modifyFileContent(content, plugins);

    const isUseNode = plugins['node'] === 'on';
    let languageOptions;
    if (plugins['typescript'] && plugins['typescript'] === 'on') {
        languageOptions = 
            `languageOptions: {
                globals: {
                    ...globals.browser,
                    ${isUseNode ? '...globals.node,' : ''}
                },
                parser: tsParser,
                parserOptions: {
                  programs: [parser.createProgram('tsconfig.json')],
                },
            },`
    } else {
        languageOptions = 
            `languageOptions: {
                globals: {
                    ...globals.browser,
                    ${isUseNode ? '...globals.node,' : ''}
                },
                parser: babelParser,
            },`
    }

    let modifiedConfigString = modifiedContent.replace('languageOptions: 111', languageOptions);
    // modifiedConfigString = modifiedConfigString.replace('languageOptions: 111', languageOptions);

    const eslintPath = path.join(process.cwd(), 'eslint.config.mjs');
    if (fs.existsSync(eslintPath)) fs.unlinkSync(eslintPath);
    
    fs.writeFile(eslintPath, modifiedConfigString, 'utf8', (err) => {
        if (err) {
        console.error('Error writing the file:', err);
        return;
        }
        console.log('File has been modified successfully.');
    });

};

module.exports = { generate };

function modifyFileContent(content, plugins) {
    console.log('plugins', plugins);
  const lines = content.split('\n');
  let modifiedLines = [];
  let insideJsxA11yRuleBlock = false;
  let insideReactRuleBlock = false;
  let insideSonarjsRuleBlock = false;

  lines.forEach(line => {
    if (plugins.airbnb === "off") {
      if (line.includes("const sonarjs = require('eslint-plugin-sonarjs');") || line.includes("sonarjs.configs.recommended")) {
        return; // Skip lines related to sonarjs
      }
    }

    if (plugins['jsx-a11y'] === "off") {
      if (line.includes("'jsx-a11y/label-has-associated-control': [")) {
        insideJsxA11yRuleBlock = true;
        return; // Skip the start of the jsx-a11y rule block
      }
      if (insideJsxA11yRuleBlock) {
        if (line.includes('],')) {
          insideJsxA11yRuleBlock = false;
        }
        return; // Skip lines inside the jsx-a11y rule block
      }
      if (line.includes("const jsxA11y = require('eslint-plugin-jsx-a11y');")) {
        return; // Skip jsx-a11y plugin import
      }
    }

    if (plugins.react === "off") {
      if (line.includes("'react/") || line.includes("'react-hooks/")) {
        insideReactRuleBlock = true;
        if (line.includes('[') && !line.includes(']')) {
          // This line starts a multiline rule
          return;
        }
        if (line.includes(']')) {
          insideReactRuleBlock = false;
          return; // Skip this line if it closes a multiline rule
        }
        if (!line.includes('[')) {
          return; // Skip single-line rules
        }
      }
      if (insideReactRuleBlock) {
        if (line.includes('],')) {
          insideReactRuleBlock = false;
        }
        return; // Skip lines inside the react rule block
      }
      if (line.includes("const react = require('eslint-plugin-react');") || line.includes("const eslintPluginReactHooks = require('eslint-plugin-react-hooks');")) {
        return; // Skip react plugin imports
      }
    }

    if (plugins.sonarjs === "off") {
      if (line.includes("'sonarjs/")) {
        insideSonarjsRuleBlock = true;
        if (line.includes('[') && !line.includes(']')) {
          // This line starts a multiline rule
          return;
        }
        if (line.includes(']')) {
          insideSonarjsRuleBlock = false;
          return; // Skip this line if it closes a multiline rule
        }
        if (!line.includes('[')) {
          return; // Skip single-line rules
        }
      }
      if (insideSonarjsRuleBlock) {
        if (line.includes('],')) {
          insideSonarjsRuleBlock = false;
        }
        return; // Skip lines inside the sonarjs rule block
      }
      if (line.includes("const sonarjs = require('eslint-plugin-sonarjs');")) {
        return; // Skip sonarjs plugin import
      }
    }

    if (plugins.promise === "off" && line.includes("const pluginPromise = require('eslint-plugin-promise');")) {
      return; // Skip promise plugin import
    }

    if (plugins.prettier === "off") {
      if (line.includes("const eslintConfigPrettier = require('eslint-config-prettier');") || line.includes("const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');")) {
        return; // Skip prettier plugin imports
      }
      if (line.includes("eslintConfigPrettier") || line.includes("eslintPluginPrettierRecommended")) {
        return; // Skip prettier config references
      }
    }

    if (plugins.import === "off" && line.includes("const _import = require('eslint-plugin-import');")) {
      return; // Skip import plugin import
    }

    modifiedLines.push(line); // Add the line if it doesn't match any skip conditions
  });

  return modifiedLines.join('\n');
}
