// to gererate poduction build
// run in command " export NODE_ENV=production " then
// run gulp

// for windows user run in command "echo NODE_ENV=production" then
// run gulp

var gulp = require("gulp"),
  newer = require("gulp-newer"),
  size = require("gulp-size"),
  compass = require("gulp-compass"),
  jshint = require("gulp-jshint"),
  cleancss = require("gulp-clean-css"),
  rtlcss = require("gulp-rtlcss"),
  rename = require("gulp-rename"),
  typescript = require("gulp-typescript"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  nunjucksRender = require("gulp-nunjucks-render"),
  browsersync = require("browser-sync"),
  pkg = require("./package.json")

var devBuild =
    (process.env.NODE_ENV || "development").trim().toLowerCase() !==
    "production",
  source = "dev/",
  dest = "build/",
  syncOpts = {
    server: {
      baseDir: dest,
      index: "index.html"
    },
    open: true,
    notify: true
  },
  nunjucks = {
    templates: source + "templates",
    pages: source + "pages",
    watch: [
      source + "templates/**/*.+(html|js|css)",
      source + "pages/**/*.+(html|js|css)"
    ],
    out: dest
  },
  images = {
    in: source + "images/**/*",
    out: dest + "images/"
  },
  imguri = {
    in: source + "images/inline/*",
    out: source + "sass/images/",
    filename: "_datauri.scss",
    namespace: "images"
  },
  css = {
    in: [source + "sass/style.scss"],
    watch: [source + "sass/**/*", "!" + imguri.out + imguri.filename],
    out: dest + "css/",
    compassOpts: {
      sass: source + "sass",
      image: "images",
      fonts: "fonts",
      js: "js",
      style: "expanded",
      sourcemap: true,
      css: dest + "css",
      require: ["susy", "breakpoint"]
    }
  },
  fonts = {
    in: source + "fonts/**/*",
    out: dest + "fonts/"
  },
  js = {
    in: [source + "scripts/app.ts"],
    out: dest + "js/",
    filename: "app.js"
  }

console.log(
  pkg.name +
    " " +
    pkg.version +
    ", " +
    (devBuild ? "Development" : "Production") +
    " Build"
)

/// nunjucks task
function nunjucksTask() {
  return gulp
    .src(nunjucks.pages + "/**/*.+(html|js|css)")
    .pipe(
      nunjucksRender({
        path: [nunjucks.templates],
        data: {
          devBuild: devBuild,
          author: pkg.author,
          version: pkg.version
        }
      })
    )
    .pipe(gulp.dest(nunjucks.out))
}

//// images copy to build
function imagesTask() {
  return gulp.src(images.in).pipe(gulp.dest(images.out))
}

/// imguri
function imacssTask() {
  return (
    gulp
      .src(imguri.in)
      .pipe(newer(images.out))
      //  .pipe(imagemin())
      .pipe(gulp.dest(imguri.out))
  )
}

/// css with sass and pleeease tasks
function sassTask() {
  return gulp
    .src(css.in)
    .pipe(compass(css.compassOpts))
    .pipe(gulp.dest(css.out))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleancss())
    .pipe(gulp.dest(css.out))
    .pipe(browsersync.reload({ stream: true }))
}

/// css with sass and pleeease tasks
function sassRtlTask() {
  return gulp
    .src(css.in)
    .pipe(compass(css.compassOpts))
    .pipe(rtlcss())
    .pipe(rename({ suffix: "-ltr" }))
    .pipe(gulp.dest(css.out))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleancss())
    .pipe(gulp.dest(css.out))
    .pipe(browsersync.reload({ stream: true }))
}
// gulp.task(
//   "sass-ltr",
//   gulp.series("imacss", function () {
//     return gulp
//       .src(css.in)
//       .pipe(compass(css.compassOpts))
//       .pipe(rtlcss())
//       .pipe(rename({ suffix: "-ltr" }))
//       .pipe(gulp.dest(css.out))
//       .pipe(rename({ suffix: ".min" }))
//       .pipe(cleancss())
//       .pipe(gulp.dest(css.out))
//       .pipe(browsersync.reload({ stream: true }))
//   })
// )

///// js task
function jsTask() {
  return (
    gulp
      .src(js.in)
      .pipe(typescript())
      //.pipe(newer(js.out))
      .pipe(jshint.reporter("default"))
      .pipe(jshint.reporter("fail"))
      .pipe(concat(js.filename))
      .pipe(gulp.dest(js.out))
      .pipe(size({ title: "js before..." }))
      .pipe(rename({ suffix: ".min" }))
      // .pipe(stripdebug())
      .pipe(uglify())
      .pipe(size({ title: "js after..." }))
      .pipe(gulp.dest(js.out))
  )
}

///// fonts task
function fontsTask() {
  return gulp.src(fonts.in).pipe(newer(fonts.out)).pipe(gulp.dest(fonts.out))
}

/// sync
function browsersyncServe(cb) {
  browsersync.init(syncOpts)
  cb()
}

function browsersyncReload(cb) {
  browsersync.reload()
  cb()
}

function watchTask() {
//   gulp.watch(nunjucks.watch).on("change", browsersyncReload)
  gulp.watch(nunjucks.watch, gulp.series(nunjucksTask, browsersyncReload))
  // reload browsersync when `dist` changes
  gulp.watch(images.in, gulp.series(imagesTask, browsersyncReload))
  gulp.watch(js.in, gulp.series(jsTask, browsersyncReload))
  gulp.watch(css.watch, gulp.series(sassTask, sassRtlTask, browsersyncReload))
  gulp.watch(fonts.in, gulp.series(fontsTask, browsersyncReload))
}

exports.default = gulp.series(
  nunjucksTask,
  fontsTask,
  sassTask,
  sassRtlTask,
  imagesTask,
  jsTask,
  browsersyncServe,
  watchTask
)
