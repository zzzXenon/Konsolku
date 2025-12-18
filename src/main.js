import './style.css';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { appConfig } from './config';

const app = angular.module('konsolku', [uiRouter]);

app.config(function($stateProvider, $urlRouterProvider) {
  
  // Helper to extract all routes (parents + children) into a flat list
  function getAllRoutes(items) {
    let routes = [];
    items.forEach(item => {
      if (item.children) {
        // If it has children, dig down and get their routes
        routes = routes.concat(getAllRoutes(item.children));
      } else {
        // If it's a normal page, add it
        routes.push(item);
      }
    });
    return routes;
  }

  // Register all routes found
  const allRoutes = getAllRoutes(appConfig);
  
  allRoutes.forEach(page => {
    $stateProvider.state(page.state, {
      url: page.url,
      template: page.template,
      controller: page.controller
    });
  });

  $urlRouterProvider.otherwise('/home');
});

// Update Controller to handle the toggle click
app.controller('mainController', function($scope) {
  $scope.menuItems = appConfig;

  // Function to toggle the dropdown
  $scope.toggleItem = function(item) {
    if (item.children) {
      item.isOpen = !item.isOpen; // Flip the true/false switch
    }
  };
});