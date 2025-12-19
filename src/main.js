import "./style.css";
import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import { appConfig } from "./config";

const app = angular.module("konsolku", [uiRouter]);

// --- REGISTER SERVICES (PENTING: Mocking G, A, Crypto agar Person.js tidak error) ---
app.factory("G", () => ({
  a: (k) => null, // Mock fungsi ambil attribut
}));

app.factory("A", () => ({
  g: async () => ({ data: { _: 0, $: [] } }), // Mock GET
  p: async () => ({ data: { _: 0, $: [] } }), // Mock POST
}));

app.factory("Crypto", () => ({
  encData: (d) => d, // Mock Encrypt (pass through)
  decData: (d) => d, // Mock Decrypt (pass through)
}));

// --- CONFIG ROUTING & AUTH CHECK ---
app.config(function ($stateProvider, $urlRouterProvider) {
  function getAllRoutes(items) {
    let routes = [];
    items.forEach((item) => {
      // Masukkan Login
      if (item.state === "login") {
        routes.push(item);
      }

      // Masukkan Children
      if (item.children) {
        routes = routes.concat(getAllRoutes(item.children));
      } else {
        // Masukkan route biasa (kecuali login yg sudah dihandle di atas)
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
      // Pass properti hideSidebar ke state data agar bisa dibaca di controller
      data: {
        hideSidebar: page.hideSidebar || false,
      },
    });
  });

  // Default Route Logic
  $urlRouterProvider.otherwise(function ($injector) {
    const $state = $injector.get("$state");
    // Jika ada token, ke home. Jika tidak, ke login.
    if (localStorage.getItem("token")) {
      return "/home";
    } else {
      return "/login";
    }
  });
});

// --- MAIN CONTROLLER ---
app.controller("mainController", function ($scope, $transitions, $state) {
  // Filter menuItems agar 'Login' tidak muncul di list Sidebar
  $scope.menuItems = appConfig.filter((item) => item.state !== "login");

  // --- LOGIKA DARK MODE ---
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

  // --- LOGIKA SIDEBAR & AUTH ---
  $scope.isLoginPage = false;

  // Deteksi setiap perpindahan halaman
  $transitions.onSuccess({}, function (trans) {
    const toState = trans.to();

    // 1. Cek apakah halaman ini butuh sidebar hidden (seperti login)
    $scope.isLoginPage =
      (toState.data && toState.data.hideSidebar === true) ||
      toState.name === "login";

    // 2. Proteksi Halaman: Jika tidak ada token dan user mencoba masuk ke halaman selain login
    if (!$scope.isLoginPage && !localStorage.getItem("token")) {
      $state.go("login");
    }

    // 3. Jika sudah login tapi mencoba akses halaman login, lempar ke home
    if ($scope.isLoginPage && localStorage.getItem("token")) {
      $state.go("home");
    }
  });

  // Fungsi Logout
  $scope.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    $state.go("login");
  };

  // --- LOGIKA MENU DROPDOWN ---
  $scope.toggleItem = function (item) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  };
});
