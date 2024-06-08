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