#!/bin/bash
CURR_DIR="$(dirname "$0")"
cd $CURR_DIR
echo "RUNNING BROWSERIFY AND MINIFY"
browserify src/script.js -o assets/script.js
uglifyjs assets/script.js > assets/script.min.js
echo "FINISHED BUILD"
