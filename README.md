# veve-eslint

Quality standard rules for apps (node, react, next...) written in typescript/javascript

### why is it called "veve-eslint"?
This package is inspired by a legendary software team that I used to be part of called "veve".

The name "veve" is a creative abbreviation of the German word "Vertragsverwaltung" which means "contract organizing". veve team (which probably means Maks 🤔) initially started this combination of lint rules by combining other popular eslint plugins like prettier, sonarjs, airbnb, jsx-a11y...

As a member of that team I loved using this combination of rules in all of our projects to ensure high quality code standards, code consistency across projects and developers, avoiding potential bugs and unnecessary clutter in the code and many other benefits like more efficient pull request reviews: focusing more on the logic and functionality and less on the code conventions.

I miss the legendary developers that I've got to work with in that team: Maksym, Fabian, Denis, Patrick, Ugurcan, Slim, Valentin, Rodrigo, Maria, Alex, Travis, Suleman, Nejla, and Sary.

### before installation

its better to create the following configuration `.custom-eslint.js` in the root of your project (next to package.json) and disable or enable some dependencies/rules before installation of the package:

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

if you want to use this package for a front-end app (react or next), you need to enable (mark as "on") the front-end dependencies ("jsx-a11y", "react", "react-hooks").

if you want to use this package for a "next" project, you also need to change "root" field to "app" (if that's your root for your frontend files)

if you don't add this config file manually before installation, it will automatically be created with the default config (above), but then if you change any of the default config, you need to uninstall and install the package again (for your custom changes to take place don't remove the .custom-eslint.js config).



