#!/bin/bash
cd .
echo "copying .npmrc file for OC"
yes | cp -rf /test/.npmrc .
echo "installing dependencies without scripts"
npm config list 
npm install --ignore-scripts=true
echo "copying pre-built node fibers"
cp -R /test/node_modules/fibers/bin/* ./node_modules/fibers/bin/
echo "Installing chromedriver"
npm install chromedriver
echo "dependencies installation complete"
