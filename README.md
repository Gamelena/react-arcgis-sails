# react-arcgis-sails

[![Build Status](https://travis-ci.org/Gamelena/react-arcgis-sails.svg?branch=master)](https://travis-ci.org/Gamelena/react-arcgis-sails)

Simple Blood Donation Management System
=======================================

Tested With
===========
Node.js 0.10
NPM 3.7 
MongoDB 2.4
Sails 0.12
Bower 1.73
Grunt 0.4.5


Install
=======
npm install -g bower grunt grunt-cli sails forever
npm install
bower install

Run Dev (this step is necesary on first deploy on production to generate mongodb constraints)
=======
sails lift

Run Prod
========
sails lift --prod

Example: running with forever in port 80
========================================
forever start -ae errors.log app.js --prod --port 80




