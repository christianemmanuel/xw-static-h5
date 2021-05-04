// 获取 gulp
var gulp = require('gulp');// 基础库
var uglify = require('gulp-uglify');// 获取 uglify 模块（用于压缩 JS）
var rev = require('gulp-rev');// 更改版本名
var revCollector = require('gulp-rev-collector'); // gulp-rev的插件，用于更改页面引用路径
var minifyCSS = require('gulp-minify-css');//  获取 minify-css 模块（用于压缩 CSS）
var imagemin = require('gulp-imagemin');//  获取 gulp-imagemin 模块
var clean = require('gulp-clean');//  清空文件夹
var zip = require('gulp-zip');
var rename = require("gulp-rename");
var fileinclude = require('gulp-file-include');
var gulpSequence = require('gulp-sequence');

//清空文件夹，避免资源冗余
gulp.task('clean',function(){
    return gulp.src('dist',{read:false,force:true}).pipe(clean());
});

gulp.task('bspcss', function() {                                //- 创建一个名为 concat 的 task
    return gulp.src(['H5/style/css/*.css'])    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(minifyCSS())                                      //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest('dist/XW-H5/style/css'))                               //- 输出文件本地
        .pipe(rev.manifest({
            merge: true
        }))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('dist/rev/css'));                              //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('bspjs',function(){
    return gulp.src('H5/style/js/*.js')
        .pipe(uglify())//压缩文件
        .pipe(rev())
        .pipe(gulp.dest('dist/XW-H5/style/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'));
});
gulp.task('rev' ,['bspjs','bspcss'], function () {
    return gulp
        .src(['dist/rev/**/*.json', 'H5/**/*.html'])
        .pipe( revCollector({ replaceReved: true }) )
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './H5/wap/include'
        }))
        .pipe(gulp.dest('dist/XW-H5'));
});
// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    return gulp.src('H5/images/**').pipe(gulp.dest('dist/XW-H5/images'))
});
// move
gulp.task('movefont', function () {
    return gulp.src(
        ['H5/style/font/**']
    ).pipe(gulp.dest('dist/XW-H5/style/font'));
});
gulp.task('movemui', function() {
    return gulp.src(
        ['H5/mui/**']
    ).pipe(gulp.dest('dist/XW-H5/mui'));
});
gulp.task('movedropload', function() {
    return gulp.src(
        ['H5/style/dropload/**']
    ).pipe(gulp.dest('dist/XW-H5/style/dropload'));
});
gulp.task('movelayer', function() {
    return gulp.src(
        ['H5/style/layer/**']
    ).pipe(gulp.dest('dist/XW-H5/style/layer'));
});
gulp.task('moveplugins', function() {
    return gulp.src(
        ['H5/style/plugins/**']
    ).pipe(gulp.dest('dist/XW-H5/style/plugins'));
});
gulp.task('zip',['rev','images','movemui','movedropload','movelayer','moveplugins'], function() {
    return gulp.src('dist/XW-H5/**/*.*')
        .pipe(zip('H5.zip'))
        .pipe(gulp.dest('dist'));
});
gulp.task('move404',['moveLive'],function () {
    return gulp.src(['dist/XW-H5/index.html'])
        .pipe(rename('404.html'))
        .pipe(gulp.dest('dist/XW-H5/'));
});

gulp.task('moveLive', function () {
    return gulp.src(['H5/live'])
        .pipe(gulp.dest('dist/XW-H5/'));
});
gulp.task('package',function () {
    gulpSequence('clean',['rev','images','movemui','movedropload','movelayer','moveplugins'],'move404',function () {
        console.log('success');
    });

});
// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 css 任务和 auto 任务
gulp.task('default',['package'], function () {});