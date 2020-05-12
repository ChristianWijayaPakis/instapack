import { minify } from 'html-minifier';
import { SourceMapGenerator, RawSourceMap } from 'source-map';

const minifierOptions = {
    caseSensitive: false,
    collapseBooleanAttributes: true,        // NOT DEFAULT
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,               // NOT DEFAULT
    conservativeCollapse: true,             // NOT DEFAULT
    continueOnParseError: false,
    decodeEntities: false,
    html5: true,
    includeAutoGeneratedTags: true,
    keepClosingSlash: true,                 // NOT DEFAULT
    minifyCSS: false,
    minifyJS: false,
    minifyURLs: false,
    preserveLineBreaks: false,
    preventAttributesEscaping: false,
    processConditionalComments: false,
    removeAttributeQuotes: false,
    removeComments: true,                   // NOT DEFAULT
    removeEmptyAttributes: false,
    removeEmptyElements: false,
    removeOptionalTags: false,
    removeRedundantAttributes: true,        // NOT DEFAULT
    removeScriptTypeAttributes: false,      // NOT DEFAULT
    removeStyleLinkTypeAttributes: false,   // NOT DEFAULT
    removeTagWhitespace: false,
    sortAttributes: false,                  // NOT DEFAULT
    sortClassName: false,                   // NOT DEFAULT
    trimCustomFragments: false,
    useShortDoctype: false
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export = function (this: any, html: string): void {
    let template = minify(html, minifierOptions).trim();
    template = 'module.exports = ' + JSON.stringify(template);
    // console.log(this.resourcePath);

    // source-map 0.6.1 docs
    // https://github.com/mozilla/source-map/tree/5d4678c0ace727d467c6fdf33af090cf64a8123a
    if (this.sourceMap) {
        const gen = new SourceMapGenerator({
            file: this.resourcePath + '.js'
        });

        gen.addMapping({
            source: this.resourcePath,
            generated: {
                column: 0,
                line: 1
            },
            original: {
                column: 0,
                line: 1
            }
        });

        gen.setSourceContent(this.resourcePath, html);
        const sm: RawSourceMap = JSON.parse(gen.toString());
        this.callback(null, template, sm);
    } else {
        this.callback(null, template);
    }
};