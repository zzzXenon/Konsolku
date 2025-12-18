import './style.css';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { appConfig } from './config';

const app = angular.module('konsolku', [uiRouter]);

app.config(function($stateProvider, $urlRouterProvider) {
  
  // Use config to create routes
  appConfig.forEach(page => {
    $stateProvider.state(page.state, {
      url: page.url,
      template: page.template,
      controller: page.controller
    });
  });

  // Default to home
  $urlRouterProvider.otherwise('/home');
});

// Sidebar
app.controller('mainController', function($scope) {
  $scope.menuItems = appConfig;
});