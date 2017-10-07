# Front-End

## Быстрый старт

* Установить [node.js](https://nodejs.org)

* Установить [git](https://git-for-windows.github.io/)

* Для [NPM](https://www.npmjs.com)
	- Обновите npm до последней версии
		Зайти в папку с установленной nodejs

		```bash
		cd "C:\Program Files\nodejs"
		```

		или

		```bash
		cd "C:\Program Files (x86)\nodejs"
		```

		в зависимости от того где у вас установленна nodejs, и выполнить

		```bash
		npm install npm@latest
		```

	- Установить `gulp` глобально (один раз!)

		```bash
		npm install gulp -g
		```
	- Установить `bower` глобально (один раз!)

		```bash
		npm install -g bower
		```

	- Установить зависимости (1 раз на проект)

		```bash
		npm install
		```

		```bash
		bower install
		```

* Запустить `gulp`

	```bash
	gulp develop
	```

* В браузере откроется страница с проектом, по адрессу [`http://localhost:3000/`](http://localhost:3000/)


## Основные таски

* `gulp develop`      - запускает вотчеры и сервер и отплавляет в папку `build` 
* `gulp sprite:retina`     - собирает retina sprite
* `gulp sprite:svg`        - собирает svg sprite
* `gulp sprite:default`    - собирает default sprite
* `gulp production`   - собирает проект и отплавляет в папку `build` 

## Генерация модулей


## Структура папок и файлов

```
template/                               # Корень проекта
├── build                               # Скомилированные файлы
├── src                                 # Исходные файлы
│   ├── modules                         # Простейшие модули
│   ├── pages                           # Страницы
│   └── static                          # Статичные файлы
│       ├── assets                      # Прочие файлы
│       ├── scripts                     # JavaScript файлы
│       │   ├── plugins                 # Папка с плагинами
│       │   ├── develop				    # Папка с скрптами
|				|	  ├── requare      # Папка с подключениями 
│       │   └── requare.js              # Точка сборки скриптов
│       └── styles                      # Статичные стили
│           ├── components              # Компоненты
│           ├── plugins                 # Стили плагинов
│           ├── _typography.scss        # Файл с типографией
│           ├── _variables.styl         # Переменные
│           └── main.styl               # Файл с подключениями стилей
├── package.json                        # Зависимости для node.js
├── bower.json                          # Зависимости для bower
├── gulpfile.js                         # Конфиг gulp.js
└── README.md                           # Файл который вы читаете
```
