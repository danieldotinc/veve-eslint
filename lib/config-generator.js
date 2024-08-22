import enquirer from 'enquirer';
import { isPackageTypeModule, installSyncSaveDev } from './utils/utils.js';
import path from 'node:path';
import fs from 'node:fs';
import { writeFile } from "node:fs/promises";
import existingRules from './utils/rules.js';
import { RulesCollector } from './utils/rulesCollector.js';

const prettiercContent = `
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
  }
`;


export class ConfigGenerator {
  constructor(options) {
    console.log('options', options);
    this.cwd = options.cwd;
    this.answers = options.answers || {};
    this.result = {
      devDependencies: ["eslint@8.x"],
      configFilename: "eslint.config.mjs",
      configContent: "",
      installFlags: ["-D"]
    };
  }

  async prompt() {
    const questions = [
      {
        type: "select",
        name: "language",
        message: "Does your project use TypeScript?",
        initial: 0,
        choices: [
            { message: "Yes", name: "typescript" },
            { message: "No", name: "javascript" },
        ],
      },
      {
        type: 'input',
        name: 'root',
        message: 'What is the root directory of your project?',
        initial: 'src',
      },
      {
        type: "select",
        name: "moduleType",
        message: "What type of modules does your project use?",
        initial: 0,
        choices: [
            { message: "JavaScript modules (import/export)", name: "esm" },
            { message: "CommonJS (require/exports)", name: "commonjs" },
            { message: "None of these", name: "script" }
        ]
      },
      {
        type: "select",
        name: "framework",
        message: "Which framework does your project use?",
        initial: 0,
        choices: [
            { message: "React", name: "react" },
            { message: "Vue.js", name: "vue" },
            { message: "None of these", name: "none" }
        ]
      },
      {
        type: 'multiselect',
        name: 'plugins',
        message: 'Select the ESLint plugins you want to use',
        hint: "(Press <space> to select, <a> to toggle all, <i> to invert selection)",
        initial: ['prettier', 'sonarjs', 'import', 'promise'],
        choices: [
          { message: 'Prettier', name: 'prettier' },
          { message: 'SonarJS', name: 'sonarjs' },
          { message: 'Import', name: 'import' },
          { message: 'Promise', name: 'promise' },
          { message: 'JSX-a11y', name: 'jsx-a11y' },
        ]
      },
      {
        type: "multiselect",
        name: "env",
        message: "Where does your code run?",
        hint: "(Press <space> to select, <a> to toggle all, <i> to invert selection)",
        initial: 0,
        choices: [
            { message: "Browser", name: "browser" },
            { message: "Node", name: "node" }
        ]
      },
      {
        type: "toggle",
        name: "recommended",
        message: "Do you want to add recommended rules?",
        enabled: "Yes",
        disabled: "No",
        initial: 1
      }
    ];

    const answers = await enquirer.prompt(questions);
    Object.assign(this.answers, answers);
  }

  build () {
    console.log('calc', this.answers);

    const isESMModule = isPackageTypeModule(this.packageJsonPath);

    this.result.configFilename = isESMModule ? "eslint.config.js" : "eslint.config.mjs";

    const extensions = []; // file extensions to lint, the default is ["js", "mjs", "cjs"]

    let importContent = "";
    const helperContent = `import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});
`;

    let exportContent = `  { ignores: ["**/node_modules/",] },\n`;
    let pluginsContent = "";
    let needCompatHelper = true;
    let rulesContent = "";

    if (this.answers.moduleType === "commonjs" || this.answers.moduleType === "script") {
        exportContent += `  { files: ["**/*.js"], languageOptions: {sourceType: "${this.answers.moduleType}"} },\n`;
    }

    if (this.answers.env?.length > 0) {
      this.result.devDependencies.push("globals");
      importContent += "import globals from \"globals\";\n";
      const envContent = {
          browser: "globals: globals.browser",
          node: "globals: globals.node",
          "browser,node": "globals: {...globals.browser, ...globals.node}"
      };

      exportContent += `  { languageOptions: { ${envContent[this.answers.env.join(",")]} } },\n`;
    }

    this.result.devDependencies.push("@eslint/js");
    importContent += "import pluginJs from \"@eslint/js\";\n";
    exportContent += "  pluginJs.configs.recommended,\n";

    if (this.answers.language === "typescript") {
      extensions.push("ts");
      this.result.devDependencies.push("typescript-eslint");
      // this.result.installFlags.push("--force"); // tseslint does not support eslint 9.x yet
      importContent += "import tseslint from \"typescript-eslint\";\n";
      exportContent += "  ...tseslint.configs.recommended,\n";
    }

    if (this.answers.framework === "vue") {
      extensions.push("vue");
      this.result.devDependencies.push("eslint-plugin-vue@9.x"); // TODO: add versions to all packages
      importContent += "import pluginVue from \"eslint-plugin-vue\";\n";
      exportContent += "   ...pluginVue.configs[\"flat/essential\"],\n";

      // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
      if (this.answers.language === "typescript") {
          exportContent += "  {files: [\"**/*.vue\"], languageOptions: {parserOptions: {parser: tseslint.parser}}},\n";
      }
    }
    if (this.answers.framework === "react") {
      extensions.push("jsx");

      if (this.answers.language === "typescript") {
          extensions.push("tsx");
      }

      this.result.devDependencies.push("eslint-plugin-react@7.x");
      this.result.devDependencies.push("eslint-plugin-react-hooks@4.x");
      importContent += "import pluginReact from \"eslint-plugin-react\";\n";
      importContent += "import pluginReactHooks from \"eslint-plugin-react-hooks\";\n";
      exportContent += "  pluginReact.configs.flat.recommended,\n";
      exportContent += "  pluginReactHooks.configs.recommended,\n";
    }

    if (this.answers.plugins?.length > 0) {
      if (this.answers.plugins.includes("sonarjs")) {
          this.result.devDependencies.push("eslint-plugin-sonarjs@1.x");
          importContent += "import sonarjs from \"eslint-plugin-sonarjs\";\n";
          exportContent += "  sonarjs.configs.recommended,\n";
          pluginsContent += "  \"sonarjs\": sonarjs,\n";
      }
      if (this.answers.plugins.includes('import')) {
          this.result.devDependencies.push("eslint-plugin-import@2.x");
          this.result.devDependencies.push("@eslint/compat");
          importContent += "import _import from \"eslint-plugin-import\";\n";
          importContent += "import { fixupPluginRules } from \"@eslint/compat\";\n";
          pluginsContent += "      import: fixupPluginRules(_import),\n";
      }
      if (this.answers.plugins.includes('jsx-a11y')) {
          this.result.devDependencies.push("eslint-plugin-jsx-a11y@6.x");
          importContent += "import jsxA11y from \"eslint-plugin-jsx-a11y\";\n";
          pluginsContent += "          \"jsx-a11y\": jsxA11y,\n";
          exportContent += "    jsxA11y.flatConfigs.recommended,\n";
      }
      if (this.answers.plugins.includes('promise')) {
          this.result.devDependencies.push("eslint-plugin-promise@7.x");
          importContent += "import pluginPromise from \"eslint-plugin-promise\";\n";
          exportContent += "  pluginPromise.configs['flat/recommended'],\n";
      }
      if (this.answers.plugins.includes('prettier')) {
          this.result.devDependencies.push("eslint-plugin-prettier@5.x");
          this.result.devDependencies.push("prettier@3.x");
          importContent += "import eslintPluginPrettierRecommended from \"eslint-plugin-prettier/recommended\";\n";
          exportContent += "  eslintPluginPrettierRecommended,\n";
      }
    }

    const lintFilesConfig = extensions.length > 0 ? `  {files: ["**/*.{${["js", "mjs", "cjs", ...extensions]}}"]},\n` : "";
    
    if (this.answers.recommended === true) {
      const rulesCollector = new RulesCollector(existingRules, this.answers);
      const rules = rulesCollector.processRules();
      this.rulesContent = JSON.stringify(rules, null, 2);
    }  

    if (pluginsContent) {
      exportContent += `  {
    plugins: {
    ${pluginsContent}  
    },
  },\n`;
    }

    if (this.rulesContent && this.answers.recommended === true) {
      exportContent += `  {
    rules: ${this.rulesContent}
    }\n`;
    }

    exportContent = `${lintFilesConfig}${exportContent}`;

    this.result.configContent = `${importContent}
${needCompatHelper ? helperContent : ""}
export default [\n${exportContent}];`;

  }

  async output() {
    console.info("The config that you've selected requires the following dependencies:\n");
    console.info(this.result.devDependencies.join(", "));

    const questions = [{
        type: "toggle",
        name: "executeInstallation",
        message: "Would you like to install them now?",
        enabled: "Yes",
        disabled: "No",
        initial: 1
    }, {
        type: "select",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        initial: 0,
        choices: ["npm", "yarn", "pnpm", "bun"],
        skip() {
            return this.state.answers.executeInstallation === false;
        }
    }];
    const { executeInstallation, packageManager } = (await enquirer.prompt(questions));
    const configPath = path.join(this.cwd, this.result.configFilename);

    if (executeInstallation === true) {

        if (packageManager === "yarn") {
            const index = this.result.installFlags.indexOf("--force");

            if (index !== -1) {
                this.result.installFlags.splice(index, 1);
            }
        }

        console.info("☕️Installing...");
        installSyncSaveDev(this.result.devDependencies, packageManager, this.result.installFlags);
        await writeFile(configPath, this.result.configContent);
        if (this.answers.plugins.includes('prettier')) {
            await writeFile('.prettierrc', prettiercContent);
        }

    } else {
      await writeFile(configPath, this.result.configContent);
      if (this.answers.plugins.includes('prettier')) {
        await writeFile('.prettierrc', prettiercContent);
      }

      console.info(`Successfully created ${configPath} file.`);
      console.warn("You will need to install the dependencies yourself.");
    }

    const packageJsonPath = path.join(this.cwd, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath), 'utf-8');

    const root = this.answers.root || 'src';
    if (packageJson.scripts === undefined) {
      packageJson.scripts = {};
    }
    packageJson.scripts.lint = `eslint --color "${root}/**/*.{js,ts,jsx,tsx}"`;
    packageJson.scripts[`lint:fix`] = `eslint --fix "${root}/**/*.{js,ts,jsx,tsx}"`;
    if (this.answers.plugins.includes('prettier')) {
      packageJson.scripts[`prettier:fix`] = `prettier --write "${root}/**/*.{js,ts,jsx,tsx}"`;
      packageJson.scripts[`lint:check`] = `prettier -l "${root}/**/*.{js,ts,jsx,tsx}"`;
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}