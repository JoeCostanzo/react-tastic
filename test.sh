#!/usr/bin/env bash
eslint ${SRC_DIR-src}/ ${TEST_DIR-test}/ && ./node_modules/mocha/bin/mocha --compilers js:babel-core/register --reporter dot --recursive ${TEST_DIR-test}/**/*_test.js
