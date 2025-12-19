export default function loginController($scope, $state) {
  console.log("Login Controller Loaded");

  $scope.creds = {
    username: "",
    password: "",
  };

  // Fungsi Login Normal (Simulasi)
  $scope.login = function () {
    if ($scope.creds.username && $scope.creds.password) {
      // Set token pura-pura
      localStorage.setItem(
        "token",
        "XA-TOKEN-" + Math.random().toString(36).substr(2)
      );
      localStorage.setItem("user", $scope.creds.username);

      // Pindah ke home
      $state.go("home");
    } else {
      alert("Please fill username and password");
    }
  };

  // Fungsi Login Langsung (Bypass)
  $scope.loginDirect = function () {
    // Set token khusus bypass
    localStorage.setItem("token", "XA-BYPASS-TOKEN");
    localStorage.setItem("user", "SuperAdmin");

    // Pindah ke home
    $state.go("home");
  };
}

loginController.$inject = ["$scope", "$state"];
