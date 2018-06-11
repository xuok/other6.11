//引入模块
var gulp = require('gulp');
var server = require('gulp-webserver');
var url = require('url');
var path = require('path');
var fs = require('fs');
var scss = require('gulp-sass');
var babel = require('babel-preset-es2015');
var es5 = require('gulp-babel');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
//搭建服务
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            host: 'localhost',
            port: 8888,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                };
                var pathname = url.parse(req.url, true).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (pathname === '/week/lib') {
                    res.end("{ 'result': 'success' }");
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
//监听并编译scss
gulp.task('scss', function() {
    gulp.watch('src/scss/*.scss', function() {
        gulp.src('src/scss/*.scss')
            .pipe(scss())
            .pipe(gulp.dest('src/css'));
    })
});
//合并压缩js/css
gulp.task('all', function() {
    gulp.src('src/js/*.js')
        .pipe(es5({
            presets: 'es2015'
        }))
        .pipe(concat('all/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src('src/css/*.css')
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(concat('all/css'))
        .pipe(clean())
        .pipe(gulp.dest('dist/css'));
    //压缩html
    gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('dev', ['server']);
gulp.task('build', ['scss', 'all']);