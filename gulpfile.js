var gulp           = require('gulp'), // Подключение Gulp
		gutil          = require('gulp-util' ), // Подключение пакета gulp-util (полезных функций для gulp плагинов)
		sass           = require('gulp-sass'), // Подключение Sass пакета
		browserSync    = require('browser-sync'), // Подключение Browser Sync
		concat         = require('gulp-concat'), // Подключение gulp-concat (для конкатенации файлов)
		uglify         = require('gulp-uglify'), // Подключение gulp-ugligy (для сжатия JS)
		cleanCSS       = require('gulp-clean-css'), // Подключение пакета для минификации CSS
		rename         = require('gulp-rename'), // Подключение библиотеки для переименования файлов
		del            = require('del'), // Подключение библиотеки для удаления файлов и папок
		imagemin       = require('gulp-imagemin'), // Подключение библиотеки для работы с изображениями
		cache          = require('gulp-cache'), // Подключение библиотеки кеширования
		autoprefixer   = require('gulp-autoprefixer'), // Подключение библиотеки для автоматического добавления префиксов
		notify         = require("gulp-notify");
		
gulp.task('browser-sync', function() { // Таск browser-sync
	browserSync({ // Выполняется browserSync
		server: { // Определение параметров сервера
			baseDir: 'src' // Директория для сервера - src
		},
		notify: false // Отключение уведомлений
	});
});	

gulp.task('sass', function() { // Таск Sass
	return gulp.src('src/sass/**/*.scss') // Берётся источник
		.pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError())) // Преобразование в CSS посредством gulp-sass; если возникает ошибка, уведомляет
		.pipe(rename({suffix: '.min', prefix : ''})) // Добавление суффикса .min к именам CSS файлов
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'])) // Создание префиксов
		.pipe(cleanCSS()) // Минификация CSS файлов
		.pipe(gulp.dest('src/css')) // Выгрузка результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновление CSS на странице при изменении
});	

// Таск для конкатенации и минификации JS файлов в один файл scripts.min.js
gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/jquery-1.12.4.min.js',
		'src/libs/parallax.js-1.4.2/parallax.min.js',
		'src/libs/jquery.scrollTo-2.1.2/jquery.scrollTo.min.js',
		'src/libs/sticky/jquery.sticky.js',
		'src/libs/waypoints/jquery.waypoints.min.js',
		'src/libs/magnific-popup/jquery.magnific-popup.min.js',
		'src/js/main.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch(['libs/**/*.js', 'src/js/main.js'], ['scripts']); // Наблюдение за JS файлами в папках libs и js
	gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*') // Берутся все изображения из src/img
		.pipe(cache(imagemin())) // Сжатие изображений с наилучшими настройками с учётом кэширования
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('removedist', function() {
	return del.sync('dist'); // Удаление папки dist перед сборкой
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([ // Перенос html файлов и файла с правилами для кэширования файлов на сервере .htaccess в продакшен
		'src/*.html',
		'src/.htaccess'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([ // Перенос CSS файлов в продакшен
		'src/css/main.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js' // Перенос скриптов в продакшен
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*' // Перенос шрифтов в продакшен
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('clearcache', function () { // Таск очистки кэша
	return cache.clearAll();
});

gulp.task('default', ['watch']); // Таск по умолчанию