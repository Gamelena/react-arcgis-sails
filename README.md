# react-arcgis-sails

[![Build Status](https://travis-ci.org/Gamelena/react-arcgis-sails.svg?branch=master)](https://travis-ci.org/Gamelena/react-arcgis-sails) [![Coverage Status](https://coveralls.io/repos/github/Gamelena/react-arcgis-sails/badge.svg?branch=master)](https://coveralls.io/github/Gamelena/react-arcgis-sails?branch=master)

##  Simple Blood Donation Management System


##  Install
npm install -g bower grunt grunt-cli sails forever

npm install

bower install

##  Run Dev (this step is necesary on first deploy on production to generate mongodb constraints)
sails lift

##  Run Prod
sails lift --prod

##  Example: running with forever in port 80
forever start -ae errors.log app.js --prod --port 80




