//----------------------------- Configuration -------------------------------//

const src           = "./app/src";
const public        = "./app/public";
const _ES6          = `${src}/js/**/*.js`;
const _pug          = `${src}/pug/**/*.pug`;
const _js           = `${public}/assets/js/`;
const _css          = `${public}/assets/css`;
const _sass         = `${src}/sass/**/*.scss`;
const _plugins      = `${src}/js/plugins/**/*.js`;

//--------------------------------- Modules ---------------------------------//

const del           = require('del');
const gulp          = require("gulp");
const sass          = require("gulp-sass");
const pug           = require("gulp-pug");
const uglify        = require("gulp-uglify");
const babel         = require("gulp-babel");
const concat        = require("gulp-concat");
const autoprefixer  = require("gulp-autoprefixer");
const browserSync   = require("browser-sync").create();

//------------------------------ Production --------------------------------//

function compilapug () {
  return gulp
    .src(_pug)
    .pipe(pug())
    .pipe(gulp.dest(public))
    .pipe(browserSync.stream());
}

function compilasass () {
  return gulp
    .src(_sass)
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest(_css))
    .pipe(browserSync.stream());
}

function compilajs () {
  return gulp
  .src(_ES6)
  .pipe(concat('main.js'))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest(_js))
  .pipe(browserSync.stream());
}

function pluginsJS () { 
  return gulp
  .src([
    './app/src/js/plugins/slide.js'
  ])
  .pipe(concat('plugins.js'))
  .pipe(gulp.dest(_js))
  .pipe(browserSync.stream());
}

function browser () {
  browserSync.init({
    server: {
      baseDir: public,
    },
  });
}

function clean () {
  return del([public], {force:true});
}

function watchview () {
  gulp.watch(_sass, gulp.series(clean, compilasass))
  gulp.watch(_pug, gulp.series(clean, compilapug))
  gulp.watch([_pug, _ES6, _sass, _plugins]).on("change", browserSync.reload)
}

//--------------------------------- Tasks -----------------------------------//

exports.js        = compilajs;
exports.html      = compilapug;
exports.sass      = compilasass;
exports.clean     = clean;
exports.watch     = watchview;
exports.plugins   = pluginsJS;
exports.browser   =  browser;

const run = [
  this.clean, 
  this.sass,
  this.html,
  this.js,
  this.plugins
]

exports.default = gulp.series(run, gulp.parallel(this.watch, this.browser))
exports.build = gulp.series(run)