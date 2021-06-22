module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
      tsconfigRootDir: __dirname,
  },

    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript/base'
    ],
    "rules": {
        "arrow-parens": [
            "error",
            "always"
        ],
        "arrow-body-style": [
            2,
            "as-needed"
        ],
        "comma-dangle": [
            2,
            "always-multiline"
        ],
        "import/imports-first": 0,
       "@typescript-eslint/no-use-before-define":0,
"no-restricted-syntax":0,
      "no-unused-vars":0,
        "import/newline-after-import": 0,
        "import/no-dynamic-require": 0,
        "import/no-extraneous-dependencies": 0,
        "import/no-named-as-default": 0,
        "import/no-unresolved": 0,
        "import/prefer-default-export": 0,
        "indent": [
            2,
            2,
            {
                "SwitchCase": 1
            }
        ],
        "max-len": 0,
      "no-tabs":0,
        "no-new":0,
        "newline-per-chained-call": 0,
      "no-mixed-spaces-and-tabs":0,
"guard-for-in":0,
        "no-nested-ternary":0,
        "no-await-in-loop":0,
        "no-useless-catch":0,        "no-confusing-arrow": 0,
        "no-console": 1,
        "no-use-before-define": 0,
        "prefer-template": 2,
        "class-methods-use-this": 0,
        "require-yield": 0,
        "import/no-webpack-loader-syntax": 0,
        "linebreak-style": 0,

    },
};
