export default function cRoles($scope) {
  console.log("Role Controller Loaded");

  // ===============================
  // STATE UI
  // ===============================
  $scope.myModal = false;
  $scope.isDetailModal = false;
  $scope.showDeleteConfirm = false;

  $scope.formHeader = "";
  $scope.buttonLabel = "";

  $scope.tempData = null; // untuk edit
  $scope.tempDeleteId = null; // untuk delete confirmation
  let nextId = 4;

  // Dropdown state
  $scope.openDropdownId = null;

  $scope.toggleDropdown = function (rowId) {
    $scope.openDropdownId = $scope.openDropdownId === rowId ? null : rowId;
  };

  // ===============================
  // CLOSE MODAL
  // ===============================
  $scope.closeModal = function () {
    $scope.myModal = false;
    $scope.newData = [];
    $scope.isDetailModal = false;
  };

  // ===============================
  // DATA TABLE
  // Format:
  // [id, name, activeFlag, roleType, orgId, remark, additionalInfo]
  // ===============================
  $scope.content = [
    [1, "Admin", 1, 0, null, "System Administrator", {}],
    [2, "Guest", 1, 1, null, "Guest Role", {}],
    [3, "User", 0, 1, null, "Default User", {}],
  ];

  // ===============================
  // ADD ROLE (OPEN MODAL)
  // ===============================
  $scope.buttonAddNewRole = function () {
    $scope.tempData = null;

    $scope.formHeader = "Adding a new role...";
    $scope.buttonLabel = "Add Role";

    // IMPORTANT: array sesuai HTML
    $scope.newData = [
      "", // name
      "0", // activeFlag
      "0", // roleType
      "", // organizationId
      "", // remark
      "{}", // additionalInfo (JSON)
    ];

    $scope.myModal = true; // 🔥 INI KUNCI MODAL MUNCUL
  };

  // ===============================
  // DETAIL ROLE (READ-ONLY)
  // ===============================
  $scope.buttonDetailRole = function (row) {
    $scope.openDropdownId = null;
    $scope.tempData = row;
    $scope.isDetailModal = true;

    $scope.formHeader = "Role Details";
    $scope.buttonLabel = "";

    $scope.newData = [
      row[1],
      String(row[2]),
      String(row[3]),
      row[4] || "",
      row[5] || "",
      JSON.stringify(row[6] || {}, null, 2),
    ];

    $scope.myModal = true;
  };

  // ===============================
  // EDIT ROLE
  // ===============================
  $scope.buttonEditRole = function (row) {
    $scope.openDropdownId = null;
    $scope.tempData = row;
    $scope.isDetailModal = false;

    $scope.formHeader = "Edit Role";
    $scope.buttonLabel = "Update Role";

    $scope.newData = [
      row[1],
      String(row[2]),
      String(row[3]),
      row[4] || "",
      row[5] || "",
      JSON.stringify(row[6] || {}, null, 2),
    ];

    $scope.myModal = true;
  };

  // ===============================
  // SUBMIT (ADD / EDIT)
  // ===============================
  $scope.addDataRole = function () {
    if (!$scope.newData[0]) {
      alert("Role name is required");
      return;
    }

    let additionalInfo = {};
    try {
      additionalInfo = JSON.parse($scope.newData[5] || "{}");
    } catch (e) {
      alert("Additional Information must be valid JSON");
      return;
    }

    const payload = [
      $scope.newData[0],
      parseInt($scope.newData[1]),
      parseInt($scope.newData[2]),
      $scope.newData[3] || null,
      $scope.newData[4],
      additionalInfo,
    ];

    // ADD
    if (!$scope.tempData) {
      $scope.content.push([nextId++, ...payload]);
    }
    // EDIT
    else {
      const idx = $scope.content.findIndex((r) => r[0] === $scope.tempData[0]);
      if (idx !== -1) {
        $scope.content[idx] = [$scope.tempData[0], ...payload];
      }
    }

    $scope.myModal = false;
  };

  // ===============================
  // DELETE
  // ===============================
  $scope.deleteRole = function (id) {
    $scope.openDropdownId = null;
    $scope.tempDeleteId = id;
    $scope.showDeleteConfirm = true;
  };

  $scope.deleteConfirmed = function () {
    if ($scope.tempDeleteId) {
      $scope.content = $scope.content.filter(
        (r) => r[0] !== $scope.tempDeleteId
      );
    }
    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
  };

  $scope.cancelDelete = function () {
    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
  };
}

cRoles.$inject = ["$scope"];
