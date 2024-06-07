const path = require('path');
const fs = require('fs');

const veveEslintJsonPath = path.join('../../', 'veve-eslint.json');
const packageJsonPath = path.join(process.cwd(), 'package.json');

const run = () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (fs.existsSync(veveEslintJsonPath)) {
    const veveEslintJson = JSON.parse(fs.readFileSync(veveEslintJsonPath, 'utf-8'));
    if (veveEslintJson.typescript === 'off') {
      // drop typescript rules
      delete packageJson.dependencies['@typescript-eslint/eslint-plugin'];
      delete packageJson.dependencies['@typescript-eslint/parser'];
      delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    }

    if (veveEslintJson.react === 'off') {
      // drop react rules
      delete packageJson.dependencies['eslint-plugin-react'];
      delete packageJson.dependencies['@babel/preset-react'];
    }

    if (veveEslintJson.reactHooks === 'off') {
      // drop reactHooks rules
      delete packageJson.dependencies['eslint-plugin-react-hooks'];
    }

    if (veveEslintJson.node === 'off') {
      // drop node rules
      delete packageJson.dependencies['eslint-plugin-node'];
    }

    if (veveEslintJson.airbnb === 'off') {
      // drop airbnb rules
      delete packageJson.dependencies['eslint-config-airbnb'];
      delete packageJson.dependencies['eslint-config-airbnb-typescript'];
    }

    if (veveEslintJson.prettier === 'off') {
      // drop prettier rules
      delete packageJson.dependencies['prettier'];
      delete packageJson.dependencies['eslint-plugin-prettier'];
      delete packageJson.dependencies['eslint-plugin-prettier'];
    }

    if (veveEslintJson.promise === 'off') {
      // drop promise rules
      delete packageJson.dependencies['eslint-plugin-promise'];
    }

    if (veveEslintJson.jsxA11y === 'off') {
      // drop jsx-a11y rules
      delete packageJson.dependencies['eslint-plugin-jsx-a11y'];
    }

    if (veveEslintJson.sonarjs === 'off') {
      // drop sonarjs rules
      delete packageJson.dependencies['eslint-plugin-sonarjs'];
    }

    if (veveEslintJson.import === 'off') {
      // drop import rules
      delete packageJson.dependencies['eslint-plugin-import'];
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
};

run();
