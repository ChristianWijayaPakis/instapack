'use strict';

let minifier = require('html-minifier');
let fs = require('fs');
let path = require('path');
let tools = require('browserify-transform-tools');

let minifierOptions = {
    caseSensitive: false,
    collapseBooleanAttributes: true,      // Not default
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,             // Not default
    conservativeCollapse: true,           // Not default
    decodeEntities: false,
    html5: true,
    includeAutoGeneratedTags: true,
    keepClosingSlash: false,
    minifyCSS: false,
    minifyJS: false,
    minifyURLs: false,
    preserveLineBreaks: false,
    preventAttributesEscaping: false,
    processConditionalComments: false,
    removeAttributeQuotes: false,
    removeComments: true,                 // Not default
    removeEmptyAttributes: false,
    removeEmptyElements: false,
    removeOptionalTags: false,
    removeRedundantAttributes: true,      // Not default
    removeScriptTypeAttributes: true,     // Not default
    removeStyleLinkTypeAttributes: true,  // Not default
    removeTagWhitespace: false,
    sortAttributes: true,                 // Not default
    sortClassName: true,                  // Not default
    trimCustomFragments: false,
    useShortDoctype: false
};

let transformOptions = {
    includeExtensions: ['html']
};

let transformer = tools.makeStringTransform('htmlify', transformOptions, function (content, args, done) {
    content = minifier.minify(content, minifierOptions);
    content = 'module.exports = ' + JSON.stringify(content) + ';\n';
    done(null, content);
});

module.exports = transformer;

/*
let dummyPath = path.resolve(__dirname, "./test.html");
let content = '<h1>\nHello World!\n</h1>';
tools.runTransform(transformer, dummyPath, { content: content }, function (err, result) {
    console.log(result);
});
*/