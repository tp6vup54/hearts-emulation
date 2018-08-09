import path from 'path';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';

const plugins = gulpLoadPlugins({
  overridePattern: false,
  pattern: [
    'webpack-stream',
    'gulp-sass'
  ],
  rename: {
    'webpack-stream': 'webpack',
    'gulp-sass': 'sass'
  },
});

gulp.task('default', ['js', 'css']);

gulp.task('clean', () => {
  console.log('Clean.');
  return gulp.src('./build')
    .pipe(plugins.clean());
});

gulp.task('js', () => {
  return gulp.src(`./src/js/index.js`)
    .pipe(plugins.webpack(require('./webpack.config.js')))
    .pipe(plugins.webpack({
      resolve: {
        modules: [
          path.resolve(__dirname, '.'),
          'node_modules',
        ],
      },
    }, webpack))
    .pipe(plugins.rename(`bundle.js`))
    .pipe(gulp.dest('./build'));
});

gulp.task('css', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(plugins.sass())
    .pipe(plugins.concat('style.css'))
    .pipe(gulp.dest('./build'));
});
