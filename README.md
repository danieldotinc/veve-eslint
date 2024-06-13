# veve-eslint

Quality standard coding rules for frontend or backend apps (node, react, next…), typescript or javascript apps.

- This package is a combination of popular eslint packages like: prettier, sonarjs, airbnb, jsx-a11y...

- This package is highly customizable, you can disable its internal dependencies! 🤩, plugins and overwrite its rules.

### Why Is It Called "veve-eslint"? 🤔
This package is inspired by a legendary software team 🦄 that I used to be a part of called "veve".

The name "veve" is a creative abbreviation of the German word "Vertragsverwaltung" which means "contract organizing". 

veve team (which probably means Maks 🥷🏻) initially started this combination of lint rules by combining other popular eslint plugins like prettier, sonarjs, airbnb, jsx-a11y...

As a member of that team I 💙ed using this combination of rules in all of our projects to ensure high quality code standards, code consistency across projects and developers, avoiding potential bugs 🐞 and unnecessary clutter 🧹 in the code and many other benefits like more efficient pull request reviews: focusing more on the logic and functionality and less on the code conventions.

I miss 😢 the legendary developers that I've got to work with in that team: Maksym 🇺🇦, Fabian 🇩🇪, Denis 🇷🇺, Patrick 🇩🇪, Ugurcan 🇹🇷, Slim 🇹🇳, Valentin 🇩🇪, Rodrigo 🇧🇷, Maria 🇺🇦, Alex 🇷🇺, Travis 🇭🇰, Suleman 🇵🇰, Nejla 🇲🇰, Sary 🇪🇬 and me 🇮🇷.

### Add Custom Config Before Installation

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
    root: "src",
    overwrite: {
        // if you don't want your custom changes to these files to be overwritten 
        //     by each install of the package, mark the respective file as "off"
        "tsconfig": "on",
        "eslintrc": "on",
        "eslintignore": "on",
        "prettierrc": "on",
    }
}
```

- if you want to use this package for a front-end app (react or next), you need to enable (mark as "on") the front-end dependencies ("jsx-a11y", "react", "react-hooks").

- if you want to use this package for a "next" project, you also need to change "root" field to "app" (if that's your root for your frontend files)

- if you don't add this config file manually before installation, it will automatically be created with the default config (above), but then if you change any of the default config, you need to uninstall and install the package again (for your custom changes to take place don't remove the ".custom-eslint.js" config).

- with every installation your config files (tsconfig, eslintrc, eslintignore, prettierrc) will be overwritten with the default files. To avoid that, in case of having some custom changes to any of these files, you must mark the overwrite option for that file as "off".



