"use strict";

var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    watch  = require('gulp-watch'),
    mocha  = require('gulp-mocha'),
    yuidoc = require('gulp-yuidoc');

gulp.task('lint', function () {
    gulp.src(['lib/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    gulp.src('./test/*.js').pipe(mocha());
});

gulp.task('docs', function () {

    gulp.src('./lib/*.js')
        .pipe(yuidoc())
        .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function () {
    gulp.watch(['lib/*.js', 'test/**/*.js'], function () {
        gulp.run('lint');
    });
});

gulp.task('continuous', function () {

    gulp.watch(['lib/*.js', 'test/**/*.js'], function () {
        gulp.run(['lint', 'test']);
    });
});

gulp.task('default', ['watch']);
