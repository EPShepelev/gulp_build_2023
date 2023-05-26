const { src, dest, watch, parallel, series } = require('gulp')

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')

function styles() {
  return src([
    'app/scss/style.scss',
    'app/scss/**/*.scss',
  ])
    .pipe(autoprefixer({overrideBrowserslist: ['last 5 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/**/*.js',
    '!app/js/main.min.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function watching() {
  watch(['app/scss/style.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function browserLiveReload() {
  browserSync.init({
    server: {
        baseDir: "app/"
    }
  });
}

function cleanDist() {
  return src('dist')
  .pipe(clean())
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browserLiveReload = browserLiveReload

exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, browserLiveReload, watching)