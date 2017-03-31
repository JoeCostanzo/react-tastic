'use strict';
import gulp       from 'gulp';
import pug        from 'gulp-pug';
import clean      from 'gulp-rimraf';
import sass       from 'gulp-sass';
import browserify from 'browserify';
import source     from 'vinyl-source-stream';
import gutil      from 'gulp-util';
import babelify   from 'babelify';
import sourcemaps from 'gulp-sourcemaps';
import buffer     from 'vinyl-buffer';

const log = console.log;

// Explanation:
//
// App paths inherit from the 'srcDir' constant below, so it helps
// to set up appropriately for your own, unique project files; this way
// you are not developing 'on master' / against the shared code-base
// in 'src', but instead you will have custom/un-tracked code, in the directory
// you create as your main directory (which won't be influenced by new commits to 'src').

// To that end: an (optional) environment variable 'SRC_DIR' may be set,
// if you should wish to provide it, and that can be done using a '.env' file.
// Once set, that will in-turn override the 'srcDir' variable below, and everything else will follow.

// IMPORTANT: '.env' is a PRIVATE concept, which should not be tracked or distributed to
// VCS participants, because it may contain other sensitive info and/or important data, keys, etc.

// (TL;DR - you have 2 choices)
// Option 1: See '.env-example', create your own '.env' file from it, and
//           set 'SRC_DIR' in it to the path of a new directory you created (i.e. a copy of 'src').
// Option 2: Don't change anything. The app will work out-of-the-box,
//           with the default './src' directory already provided.
const srcDir  = process.env.SRC_DIR || './src';

const destDir = './web';

const conf = {
  // JavaScript
  entryName:    'index.js',
  destName:     'bundle.js',
  destJsDir:    `${destDir}/js`,

  // SASS
  srcSass:      `${srcDir}/sass`,
  destSass:     `${destDir}/css`,

  // HTML
  srcHtml:      `${srcDir}/**/*.pug`,
  cleanHtml:    './**/*.html'
};

gulp.task('html', () =>
  gulp.src([
    conf.srcHtml,
    '!node_modules/**/*.pug',
  ])
    .pipe(pug())
    .pipe(gulp.dest('./')));

gulp.task('private:watch-html', () =>
  gulp.watch([
    conf.srcHtml,
    '!node_modules/**/*.pug',
  ], ['html']));

gulp.task('html:clean', () =>
  gulp.src([
    conf.cleanHtml,
    '!node_modules/**/*.html'
  ])
    .pipe(clean({force: true})));

gulp.task('styles', () =>
  gulp.src(`${conf.srcSass}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(conf.destSass)));

gulp.task('styles:watch', ['styles'], () =>
  gulp.watch(`${conf.srcSass}/**/*.scss`, ['styles']));

gulp.task('html:watch', ['html'], () => gulp.start('private:watch-html'));

gulp.task('scripts', () => compile());

gulp.task('scripts:watch', ['scripts'], () => gulp.watch([`${srcDir}/**/*.js`], ['scripts']));

// When running 'gulp' on the terminal this task will fire.
gulp.task('default', ['html:clean'], () => gulp.start(['html', 'styles', 'scripts']));

gulp.task('watch', ['html:clean'], () => gulp.start(['html:watch', 'styles:watch', 'scripts:watch']));

function compile() {
  const bundler = browserify({entries: `${srcDir}/${conf.entryName}`, debug: true });

  function bundle() {
    // transform ES6 + JSX to ES5 with babelify
    bundler
      .transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .on('error', gutil.log)
      .pipe(source(conf.destName))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(conf.destJsDir));
  }
  log('-> bundling...');
  bundle();
  log('->Done');
}
/**
 * Created by joec on 3/31/2017.
 */
