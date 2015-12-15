/**
 * Created by wujianbo on 15/12/14.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var webpack = require("gulp-webpack");
var watch = require('gulp-watch');
var liverload = require('gulp-livereload');
var babel = require('gulp-babel');
gulp.task('watch', function() {
    liverload.listen();
    gulp.watch('./dev/**.js', ['pack']);
});
gulp.task('pack', function() {
    return gulp.src('./dev/MingGe_1.6.js')
        .pipe(webpack())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename = "index";
        }))
        .pipe(gulp.dest('./'));
});
gulp.task('default', ['pack', 'watch']);