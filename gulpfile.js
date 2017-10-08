'use strict';

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    gulpif = require('gulp-if'),
    gulpsync = require('gulp-sync')(gulp),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    svgSprite = require('gulp-svg-sprite'),
    imageResize = require('gulp-image-resize'),
    bulkSass = require('gulp-sass-glob-import'),
    include = require("gulp-include"),
    autoprefixer = require('gulp-autoprefixer'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    htmltidy = require('gulp-htmltidy'),
    htmlbeautify = require('gulp-html-beautify'),
    replace = require('gulp-replace-task'),
    sassLint = require('gulp-sass-lint'),
    fileinclude = require('gulp-file-include');


//configs

var autoPrefixerOptions = {
    browsers: ['last 2 versions', '> 1%', 'Firefox ESR', 'ie > 8', 'safari 5', 'opera 12.1'],
    cascade: true
};

var plumberCfg = {
    errorHandler: notify.onError({
        message: "Error: <%= error.message %>"
    })
};

var fileIncludeCfg = {
    prefix: '@@',
    basepath: '@root'
};

var formatHTML = {
    "indent_size": 2,
    "indent_char": "  ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": true,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": true
};

var imgResizeCfg = {
    width: '50%',
    height: '50%',
    crop: false,
    upscale: false
};

var spriteDefaultCfg = {
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png',
    padding: 5
};

var spriteMithRetinaCfg = {
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png',
    retinaImgName: 'sprite@2x.png',
    retinaSrcFilter: ['src/static/assets/img/sprite/retina/**/*_2x.png'],
    retinaImgPath: '../img/sprite@2x.png',
    padding: 5
};

var spriteSvgCfg = {
    "mode": {
        "css": {
            "spacing": {
                "padding": 5
            },
            "dest": "./",
            "layout": "horizontal",
            "sprite": "sprite-svg.svg",
            "bust": false,
            "render": {
                "scss": {
                    "dest": "_sprite-svg.scss"
                }
            }
        }
    }
};

var svgSymbol = {
    mode: {
        view: {
            bust: false
        },
        symbol: true
    }
};

// Path
var path = {
    build: {
        root: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        fonts: 'build/fonts/',
        img: 'build/img/',
        pic: 'build/pic',
        svg: 'src/static/assets/img/svg/',
        html: 'build/*.html'
    },
    src: {
        root: 'src/',
        html: 'src/pages/*.html',
        js: 'src/static/scripts/*.js',
        styles: 'src/static/styles/',
        sass: 'src/static/styles/main.scss',
        sassLint: ['src/static/styles/**/*.scss', 'src/modules/**/*.scss'],
        img: 'src/static/assets/img/*.*',
        pic: ['src/static/assets/pic/**/*.jpg', 'src/static/assets/pic/**/*.png', 'src/static/assets/pic/**/*.svg'],
        fonts: 'src/static/assets/fonts/**/*.*',
        spr: {
            default: 'src/static/assets/img/sprite/default/*.png',
            retina2x: 'src/static/assets/img/sprite/retina/2x/*.png',
            retina1x: 'src/static/assets/img/sprite/retina/1x/',
            retina: 'src/static/assets/img/sprite/retina/**/*.png',
            svg: 'src/static/assets/img/sprite/svg/**/*.svg'
        },
        modules: 'src/modules/**/*.scss'
    },
    watch: {
        html: ['src/pages/**/*.html', 'src/modules/**/*.html'],
        sass: 'src/static/styles/**/*.scss',
        fonts: 'src/static/assets/fonts/**/*.*',
        js: ['src/static/scripts/**/*.js', 'src/modules/**/*.js'],
        pic: 'src/static/assets/pic/**/*.*',
        spr: {
            svg: 'src/static/assets/img/sprite/svg/**/*.svg',
            retina2x: 'src/static/assets/img/sprite/retina/2x/*.png',
            default: 'src/static/assets/img/sprite/default/*.png'
        }

    },
    clean: ['build', 'build/css/main.css', 'build/*.html']
};

// server
var webserver = {
    dev: {
        server: {
            baseDir: './build'
        },
        //tunnel: true,
        //host: 'localhost',
        //port: 9001,
        //logPrefix: 'app_dev'
    },
    prod: {
        server: {
            baseDir: './build'
        },
        //tunnel: true,
        //host: 'localhost',
        //port: 9002,
        //logPrefix: 'app_prod'
    }
};

// clen
gulp.task('clean', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

//---------------------------------------//
//  SASS
//---------------------------------------//

// clean css
gulp.task('clean:css', function (cb) {
    return gulp.src(path.build.css, {read: false}).pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src(path.src.sassLint)
        .pipe(sassLint({
            files: {ignore: 'src/static/styles/plugins/**/*.scss'},
            rules: {
                'quotes' : 0,
                'property-sort-order' : 0,
                'empty-line-between-blocks' : 0,
                'pseudo-element' : 0,
                'nesting-depth' : 0,
                'mixin-name-format' : 0,
                'no-vendor-prefixes' : 0,
                'no-transition-all' : 0,
                'no-empty-rulesets' : 0,
                'no-color-literals' : 0 //mb leave it?
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

//development
gulp.task('sass:dev', function () {
    return gulp.src(path.src.sass)
        .pipe(plumber(plumberCfg))
        .pipe(sourcemaps.init())
        .pipe(bulkSass())
        .pipe(sass())
        .pipe(autoprefixer(autoPrefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

// production
gulp.task('sass:prod', function () {
    return gulp.src(path.src.sass)
        .pipe(plumber(plumberCfg))
        .pipe(bulkSass())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer(autoPrefixerOptions))
        .pipe(gulp.dest(path.build.css));
});

//---------------------------------------//
// Спрайты
//---------------------------------------//

//спрайты
gulp.task('sprite:default', function () {
    var spriteData =
        gulp.src(path.src.spr.default, {read: false})
            .pipe(plumber(plumberCfg))
            .pipe(spritesmith(spriteDefaultCfg))
    spriteData.img.pipe(gulp.dest(path.build.img)); 	// путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.src.styles)); 	// путь, куда сохраняем стили
    return spriteData;
});

gulp.task('clean:1x', function (cb) {
    return gulp.src(path.src.spr.retina1x, {read: false}).pipe(clean());
});

gulp.task('retina:resize', ['clean:1x'], function (cb) {
    var ret = gulp.src(path.src.spr.retina2x)
        .pipe(plumber(plumberCfg))
        .pipe(rename(function (path) {
            path.basename = path.basename.slice(0, -3);
        }))
        .pipe(imageResize(imgResizeCfg))
        .pipe(gulp.dest(path.src.spr.retina1x));

    return ret;
});

gulp.task('sprite:retina', ['retina:resize'], function () {
    var spriteData =
        gulp.src(path.src.spr.retina)
            .pipe(plumber(plumberCfg))
            .pipe(spritesmith(spriteMithRetinaCfg));
    spriteData.img.pipe(gulp.dest(path.build.img));
    spriteData.css.pipe(gulp.dest(path.src.styles));

    return spriteData;
});

gulp.task('sprite:svg', function () {
    gulp.src(path.src.spr.svg)
        .pipe(plumber(plumberCfg))
        .pipe(svgSprite(svgSymbol))
        .pipe(gulp.dest(path.build.svg));
});

//---------------------------------------//
// Pic optimization
//---------------------------------------//
// clean pic
gulp.task('clean:pic', function (cb) {
    return gulp.src(path.build.pic, {read: false}).pipe(clean());
});
gulp.task('img:pic', function () {
    gulp.start('clean:pic');
    gulp.src(path.src.pic)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.pic));
});
// clean img
gulp.task('clean:img', function (cb) {
    return gulp.src(path.build.img, {read: false}).pipe(clean());
});
gulp.task('img:img', function () {
    gulp.start('clean:img');
    gulp.start('sprite:retina');
    gulp.start('sprite:default');
    gulp.start('sprite:svg');

    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));

});


//---------------------------------------//
// concat js
//---------------------------------------//
gulp.task('scripts:dev', function () {
    return gulp.src(path.src.js)
        .pipe(include({
            hardFail: true,
            includePaths: [
                __dirname + '/',
                __dirname + '/bower_components',
                __dirname + '/node_modules',
                __dirname + '/src/static/scripts/'
            ]
        }))
        .pipe(gulpif('main.js', babel({
            presets: ['env']
        })))
        .pipe(removeEmptyLines({
            removeComments: true
        }))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('scripts:build', function () {
    return gulp.src(path.src.js)
        .pipe(include({
            hardFail: true,
            includePaths: [
                __dirname + '/',
                __dirname + '/bower_components',
                __dirname + '/node_modules',
                __dirname + '/src/static/scripts/'
            ]
        }))
        .pipe(gulpif('main.js', babel({
            presets: ['env']
        })))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

//---------------------------------------//
// Fonts
//---------------------------------------//

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

//---------------------------------------//
// html
//---------------------------------------//

// clean html
gulp.task('clean:html', function (cb) {
    return gulp.src(path.build.html, {read: false}).pipe(clean());
});

gulp.task('html:dev', function () {

    gulp.src(path.src.html)
        .pipe(plumber(plumberCfg))
        .pipe(fileinclude(fileIncludeCfg))
        .pipe(gulp.dest(path.build.root))
});

// production
gulp.task('html:prod', function () {
    gulp.src(path.src.html)
        .pipe(plumber(plumberCfg))
        .pipe(fileinclude(fileIncludeCfg))
        .pipe(replace({
            patterns: [
                {
                    match: /(@@[a-zA-Z_]+)/g,
                    replacement: ' '
                }
            ]
        }))
        .pipe(htmltidy({
            indent: true
        }))
        .pipe(htmlbeautify(formatHTML))
        .pipe(gulp.dest(path.build.root))
});

//---------------------------------------//
// watch
//---------------------------------------//

gulp.task('watch', function () {
    watch(path.watch.html, function (event, cb) {
        gulp.start('html:dev');
    });
    watch([path.watch.sass, path.src.modules], function (event, cb) {
        gulp.start('sass:dev');
    });
    watch([path.watch.sass, path.src.modules], function (event, cb) {
        gulp.start('lint');
    });
    watch(path.watch.js, function (event, cb) {
        gulp.start('scripts:dev');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.spr.svg], function (event, cb) {
        gulp.start('sprite:svg');
    });
    watch([path.watch.spr.default], function (event, cb) {
        gulp.start('sprite:default');
    });
    watch([path.watch.spr.retina2x], function (event, cb) {
        gulp.start('sprite:retina');
    });
    watch([path.watch.pic], function (event, cb) {
        gulp.start('img:pic');
    });
    watch([path.watch.pic], function (event, cb) {
        gulp.start('img:img');
    });
});


//---------------------------------------//
// server
//---------------------------------------//
// development
gulp.task('webserver:dev', function () {
    browserSync([path.build.css, path.build.js], webserver.dev);
});

// production
gulp.task('webserver:prod', function () {
    browserSync(webserver.prod);
});


// Develop
gulp.task('develop', gulpsync.sync([
    'clean:html',
    'clean:css',
    'clean:pic',
    [
        'html:dev',
        'lint',
        'sass:dev',
        'img:pic',
        'img:img',
        'fonts:build',
        'scripts:dev',
        'sprite:retina',
        'sprite:default',
        'sprite:svg'
    ],
    'watch',
    'webserver:dev'
]));

// Production
gulp.task('production', gulpsync.sync([
    'clean',
    [
        'html:prod',
        'sass:prod',
        'img:pic',
        'img:img',
        'fonts:build',
        'scripts:build',
        'sprite:retina',
        'sprite:default',
        'sprite:svg'
    ]
]));