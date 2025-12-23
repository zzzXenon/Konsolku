import "./style.css";
import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import { appConfig } from "./config";

const app = angular.module("konsolku", [uiRouter]);

app.factory("G", () => ({
  a: (k) => null,
}));

app.factory("A", () => ({
  g: async () => ({ data: { _: 0, $: [] } }),
  p: async () => ({ data: { _: 0, $: [] } }),
}));

app.factory("Crypto", () => ({
  encData: (d) => d,
  decData: (d) => d,
}));

// --- CONFIG ROUTING & AUTH CHECK ---
app.config(function ($stateProvider, $urlRouterProvider) {
  function getAllRoutes(items) {
    let routes = [];
    items.forEach((item) => {
      if (item.state === "login") {
        routes.push(item);
      }

      if (item.children) {
        routes = routes.concat(getAllRoutes(item.children));
      } else {
        if (item.state !== "login") routes.push(item);
      }
    });
    return routes;
  }

  const allRoutes = getAllRoutes(appConfig);

  allRoutes.forEach((page) => {
    $stateProvider.state(page.state, {
      url: page.url,
      template: page.template,
      controller: page.controller,
      data: {
        hideSidebar: page.hideSidebar || false,
      },
    });
  });

  // Default route logic
  $urlRouterProvider.otherwise(function ($injector) {
    const $state = $injector.get("$state");
    if (localStorage.getItem("token")) {
      return "/home";
    } else {
      return "/login";
    }
  });
});

app.controller("mainController", function ($scope, $transitions, $state) {
  // Filter menuItems agar 'Login' tidak muncul di list Sidebar
  $scope.menuItems = appConfig.filter((item) => item.state !== "login");

  // COLOR THEME-
  const userTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    $scope.isDarkMode = true;
    document.documentElement.classList.add("dark");
  } else {
    $scope.isDarkMode = false;
    document.documentElement.classList.remove("dark");
  }

  $scope.toggleTheme = function () {
    $scope.isDarkMode = !$scope.isDarkMode;
    if ($scope.isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  $scope.isLoginPage = false;

  $transitions.onSuccess({}, function (trans) {
    const toState = trans.to();

    $scope.isLoginPage =
      (toState.data && toState.data.hideSidebar === true) ||
      toState.name === "login";

    if (!$scope.isLoginPage && !localStorage.getItem("token")) {
      $state.go("login");
    }

    if ($scope.isLoginPage && localStorage.getItem("token")) {
      $state.go("home");
    }
  });

  $scope.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    $state.go("login");
  };

  $scope.toggleItem = function (item) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  };
});
