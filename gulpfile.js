var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var lessToCSS = require('gulp-less');
var rename = require("gulp-rename");
var rjs = require('gulp-requirejs');

// node node_modules/gulp/bin/gulp.js production
gulp.task('production', function() {
    var all_js_name = 'all.min.js';
    var all_css_name = 'all.min.css';

    var config = {};
    config.mainConfigFile = 'development/js/app/main.js';
    config.out = all_js_name;
    config.name = 'app/main';
    config.include = ['lib/almond.js'];
    config.findNestedDependencies = true;
    config.baseUrl = 'development/js/';

    rjs(config)
        .pipe(gulp.dest('./production/'));

    gulp.src('development/less/total.less')
        .pipe(lessToCSS())
        .pipe(rename(all_css_name))
        .pipe(gulp.dest('./production/'));

    gulp.src('development/index.html')
        .pipe(htmlreplace({
            'less-to-all-css': {
                src: [['' + all_css_name, Date.now()]],
                tpl: '<link type="text/css" rel="stylesheet" href="%s?%s" />'
            },
            'all-js': {
                src: [['' + all_js_name, Date.now()]],
                tpl: '<script async defer src="%s?%s"></script>'
            }
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('production/'));
});