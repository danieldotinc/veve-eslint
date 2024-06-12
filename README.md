# veve-eslint

quality standard rules for apps (node, react, next...) written in typescript/javascript


### before installation

its better to create the following configuration `.custom-eslint.js` and disable or enable some dependencies/rules before installation of the package:

```
module.exports = {
    // warning: if you change these any of the rules, you need to uninstall the package and install it again
    plugins: {
        "typescript": "on", 
        "node": "on",
        "airbnb": "on",
        "promise": "on",
        "prettier": "on",
        "sonarjs": "on",
        "import": "on",
        // by default frontend packages are off
        "jsx-a11y": "off",
        "react": "off",
        "react-hooks": "off"
    },
    root: "src"
}
```

if you want to use this for a front-end app (react or node), you need to enable (mark as "on") the front-end dependencies ("jsx-a11y", "react", "react-hooks").

if you don't add this manually, it will automatically be created with the default config (above). but then if you change any of the above, you need to uninstall and install the package again (without removing the .custom-eslint.js config).


