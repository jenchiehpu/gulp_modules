const gulp = require("gulp");
const jade = require("gulp-jade");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const minifyCss = require("gulp-minify-css");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const minimist = require("minimist");
const gulpIf = require("gulp-if");
const clean = require("gulp-clean");
const sequence = require("gulp-sequence");
const imagemin = require("gulp-imagemin");
const data = require("gulp-data");

gulp.task("jade", function() {
    gulp.src("./src/**/*.jade")
        .pipe(plumber())
        .pipe(
            data(function() {
                let data = require("./src/data/data.json");
                let menu = require("./src/data/menu.json");
                let source = {
                    khdata: data,
                    menu: menu
                };
                return source;
            })
        )
        .pipe(
            jade({
                pretty: true
            })
        )
        .pipe(gulp.dest("./public/"));
});
