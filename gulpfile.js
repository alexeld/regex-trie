"use strict";

var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    watch  = require('gulp-watch'),
    yuidoc = require('gulp-yuidoc');

gulp.task('lint', function () {
    gulp.src(['lib/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
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

gulp.task('default', ['watch']);
