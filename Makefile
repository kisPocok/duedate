help:
	@echo "Available commands:"
	@echo "  install	Install dependencies"
	@echo "  tests		Run mocha tests"
	@echo "  nyan		Run mocha tests with style"
	@echo "  complexity	Show codebase health"
	@echo "  help		Show this message"

install:
	npm install

tests:
	npm test

nyan:
	./node_modules/mocha/bin/mocha --reporter nyan

complexity:
	./node_modules/complexity-report/src/index.js duedate.js