import gulp from 'gulp';
const  series = gulp.series;
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';
import htmlmin from 'gulp-htmlmin';
import csso from 'gulp-csso';
import gulpuglify from 'gulp-uglify-es';
const uglify = gulpuglify.default
import filter from 'gulp-filter';
import del from 'del';
import eslint from 'gulp-eslint';

export function clean() {
  return del(['dist/**', '!dist'], {force:true});
}

function buildjs() {
  console.log('buildjs', uglify)
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}

function buildcss() {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
}

function buildhtml() {
  return gulp.src('predist/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('dist'));
}

function buildhtml2() {
  return gulp.src('predist/Blog/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('dist/Blog'));
}
function buildImg() {
  return gulp.src('src/img/**')
    .pipe(filter(['**/*.jpg', '**/*.png', '**/*.svg']))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
}
export function lint() {
  return gulp.src(['src/js/**','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

export default series(clean, buildjs, buildcss, buildhtml, buildhtml2, buildImg);
