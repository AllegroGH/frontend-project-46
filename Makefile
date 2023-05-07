install: # установить зависимости
	npm ci

publish: # отладка публикации
	npm publish --dry-run

lint: # запуск линтера
	npx eslint .

test: # запуск тестов
	NODE_OPTIONS=--experimental-vm-modules npx jest 
