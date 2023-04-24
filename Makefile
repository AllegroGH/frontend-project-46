install: # установить зависимости
	npm ci

publish: # отладка публикации
	npm publish --dry-run

lint: # запуск линтера
	npx eslint .
