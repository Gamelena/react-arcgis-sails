TESTS = $(shell find test -type f -name "*test.js")
TEST_TIMEOUT = 5000
MOCHA_REPORTER = spec
NPM_REGISTRY="--registry=https://registry.npm.taobao.org/"

install:
	@npm install $(NPM_REGISTRY)

test:
	NODE_ENV=unit_test ./node_modules/.bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

coverage:
	NODE_ENV=unit_test grunt coverage

.PHONY: install test coverage


