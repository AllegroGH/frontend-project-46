install: # установить зависимости
	npm ci

publish: # отладка публикации
	npm publish --dry-run

lint: # запуск линтера
	npx eslint .

test: # запуск тестов
	npm test

test-coverage: # запуск тестов с измерением покрытия
	npm test --  --coverage
