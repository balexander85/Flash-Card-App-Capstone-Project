module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "quotes": ["error", "double"],
        "indent": ["error", 2],
        "max-len": ["error", { "code": 120 }],
        "no-unused-vars": "error",
        // need to run for production only
        // "no-console": "error"
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "linebreak-style": ["error", "unix"],
        "semi": ["error", "always"],
        "no-trailing-spaces": "error",
        "consistent-this": ["error", "self"],
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "no-multi-spaces": ["error"],
        "object-curly-spacing": [ "error", "always" ]
    }
}
