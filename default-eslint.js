module.exports = {
    // warning: if you change these any of the rules, you need to uninstall the 
    //      package and install it again
    plugins: {
        "typescript": "on", 
        "airbnb": "on",
        "promise": "on",
        "prettier": "on",
        "sonarjs": "on",
        "import": "on",
        // by default frontend packages are off (won't be installed and applied)
        "jsx-a11y": "off",
        "react": "off",
        "react-hooks": "off",
        // globals: browser is on by default
        "node": "off",
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