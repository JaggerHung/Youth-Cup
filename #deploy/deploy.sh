#!/bin/bash
cd /var/www/taiwanhbl.com
git fetch
git reset origin/master --hard
./node_modules/webpack/bin/webpack.js -p
