var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util')
    plumber = require('gulp-plumber')
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
}); 

gulp.task('connect', function() {
    connect.server({
        root: './dist',
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
        .pipe(gulp.dest('./dist/static'))
        .pipe(connect.reload());
})

gulp.task('html', function() {
    return gulp.src('*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
})

gulp.task('css', function() {
    return gulp.src('static-src/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('client.css'))
        .pipe(gulp.dest('./dist/static'))
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
        gulp.start('html');
    });
});

gulp.task('default', [
    'js',
    'css',
    'html',
    'watch',
    'connect',
]);