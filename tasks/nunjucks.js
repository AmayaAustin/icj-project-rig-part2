const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const journalize = require('journalize');
const data = require('gulp-data');
const browserSync = require('browser-sync').create();
const config = require('../project.config');

module.exports = () => {
  // helper function for nunjucks render
  function getDataForFile(file) {
    return {
      example: 'data loaded for ' + file.relative
    };
  }

  // nunjucks environment setup
  const manageEnv = function(env) {
    // loop over config vars to add to nunjucks global env
    // which can be added to project.config.json
    for (var k in config) {
      if(config.hasOwnProperty(k)) {
        env.addGlobal(k, config[k]);
      }
    }

    // set up journalize
    for (let key in journalize) {
      let func = journalize[key];
      if (typeof func === 'function') {
        env.addFilter(key, func);
      }
    }
  }

  gulp.src('src/njk/*.html')
    .pipe(data(getDataForFile))
    .pipe(nunjucksRender({
      path: 'src/njk',
      manageEnv: manageEnv
    }))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream());
};
