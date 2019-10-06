var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var minify = require('gulp-minify');
var replace = require('gulp-replace');
var fs = require('fs');
var rename = require('gulp-rename');

gulp.task('replace', function() {
  var css = fs.readFileSync("./dist/style.css", "utf8");
  var js = fs.readFileSync("./dist/app-min.js", "utf8");

  

  return gulp.src(['./src/template.html'])
    .pipe(replace('{{minifiedCSS}}', css))
    .pipe(replace('{{minifiedJS}}', js))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('dist'));

});

gulp.task('rename', function() {
var templatePHP = `<?php
/*
 * Template Name: Designer Launch Series
 * Template Post Type: post, page, product, event, ikit_event
 */
 ?>
<!doctype html>`;
  return gulp.src("./dist/index.html")
    .pipe(replace('<!doctype html>',templatePHP))
    .pipe(rename("designer-launch-series.php"))
    .pipe(gulp.dest("./dist"));
});


gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'));
});


gulp.task('js', function() {
  return gulp.src('./src/*.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});


gulp.task('build',gulp.series('sass','js','replace', 'rename', function(done){
  done();
}));


gulp.task('template:watch', gulp.series('build', function (done) {
  gulp.watch('./src/*', gulp.series('build'));
  done();
}));

gulp.task('watch',gulp.parallel('template:watch', function(done){
  done();
}));


gulp.task('default', gulp.series('watch','build', function(done) {    
  done();
}));