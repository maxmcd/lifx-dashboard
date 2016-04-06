var gulp = require('gulp'),
    gae = require('gulp-gae'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util')
    plumber = require('gulp-plumber')
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    connect = require('gulp-connect');
 

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    });
});
 
gulp.task('js', function() {
    return gulp.src('static-src/*.js*')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015','react']
        }))
        .on('error', (e) => {
            gutil.log(e.stack)
        })
        .pipe(concat('client.js'))
        .pipe(gulp.dest('static'))
        .pipe(connect.reload());
})

gulp.task('css', function() {
    return gulp.src('static-src/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('client.css'))
        .pipe(gulp.dest('static'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    watch('static-src/*.js*', function () {
        gulp.start('js');
    });
    watch('static-src/*.sass', function () {
        gulp.start('css');
    });
    watch('*.html', function () {
        connect.reload()
    });

});

gulp.task('default', [
    'js',
    'css',
    'watch',
    'connect',
]);