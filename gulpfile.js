var gulp = require("gulp");
var jade = require("gulp-jade");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minifyCss = require("gulp-minify-css");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
var minimist = require("minimist");
var gulpIf = require("gulp-if");
var clean = require("gulp-clean");
var sequence = require("gulp-sequence");
const imagemin = require("gulp-imagemin");
const data = require("gulp-data");
var envOptions = {
    string: "env",
    default: {
        env: "develop"
    }
};

var options = minimist(process.argv.slice(2), envOptions);

console.log(options);
gulp.task("jade", function() {
    return gulp
        .src("./source/**/*.jade")
        .pipe(plumber())
        .pipe(
            data(function() {
                var khData = require("./source/data/data.json");
                var menu = require("./source/data/menu.json");
                var source = {
                    khData: khData,
                    menu: menu
                };
                return source;
            })
        )
        .pipe(jade())
        .pipe(gulp.dest("./public/"));
});
gulp.task("copy", function() {
    return gulp.src("./source/**/*.html").pipe(gulp.dest("./public/"));
});
gulp.task("sass", function() {
    var plugins = [autoprefixer({ browsers: ["last 4 version"] })];
    return gulp
        .src("./source/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulpIf(options.env === "production", minifyCss()))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("watch", function() {
    gulp.watch("./source/scss/**/*.scss", ["sass"]);
});

gulp.task("default", ["sass", "babel", "watch"]);

gulp.task("babel", () =>
    gulp
        .src("./source/js/**/*.js")
        .pipe(
            babel({
                presets: ["env"]
            })
        )
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js"))
);

gulp.task("clean", function() {
    return gulp.src(["./.tmp", "./public"], { read: false }).pipe(clean());
});

gulp.task("build", sequence("clean", "sass"));

gulp.task("imagemin", () =>
    gulp
        .src("./source/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("./public/images"))
);
