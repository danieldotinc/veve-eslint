
/*
includePlugins is an array of strings, each string is a eslint rule name
react, node, typescript = @typescript-eslint, jsx-a11y, react-hooks, import, promise
*/
export class RulesCollector {
  
  constructor(existingRules, answers) {
    this.rules = existingRules;
    this.includePlugins = [];
    if (answers.framework === "react") {
      this.includePlugins.push("react");
      this.includePlugins.push("react-hooks");
    }
    if (answers.plugins.includes('import')) {
      this.includePlugins.push("import");
    }
    if (answers.plugins.includes('promise')) {
      this.includePlugins.push("promise");
    }
    if (answers.plugins.includes('jsx-a11y')) {
      this.includePlugins.push("jsx-a11y");
    }
    if (answers.env.indexOf("node")>=0) {
      this.includePlugins.push("node");
    }
    if (answers.language === "typescript") {
      this.includePlugins.push("@typescript-eslint");
    }
  }

  processRules() {
    this.cleanRules();
    return this.rules;
  }

  cleanRules() {
    for (const key in this.rules) {
      // Check if the key starts with any prefix from includePlugins
      const shouldKeep = this.includePlugins.some(prefix => key.startsWith(prefix));
      
      // If the key doesn't match any prefix, delete it
      if (!shouldKeep) {
          delete this.rules[key];
      }
    }
  }
}
