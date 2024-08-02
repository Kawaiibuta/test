#!/bin/bash
nohup redis-server &
node ./dist/index.js
