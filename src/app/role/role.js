export default function roleController($scope) {
  console.log("Role Controller Loaded");

  // ===============================
  // STATE UI
  // ===============================
  $scope.title = "Role";
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
    if ($scope.openDropdownId === rowId) {
      $scope.openDropdownId = null;
    } else {
      $scope.openDropdownId = rowId;
    }
  };

  // Fungsi untuk menutup dropdown saat klik di luar (dipanggil di HTML root)
  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // ===============================
  // CLOSE MODAL
  // ===============================
  $scope.closeModal = function () {
    $scope.myModal = false;
    $scope.newData = [];
    $scope.isDetailModal = false;
  };

  $scope.cancelDelete = function () {
    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
  };

  // ===============================
  // DATA TABLE
  // Format: [id, name, activeFlag, roleType, orgId, remark, additionalInfo]
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
    $scope.isDetailModal = false;

    $scope.formHeader = "Add Role";
    $scope.buttonLabel = "Save";

    // Reset Form
    $scope.newData = [
      "", // 0: name
      "1", // 1: activeFlag (Default Active)
      "1", // 2: roleType (Default App)
      "", // 3: organizationId
      "", // 4: remark
      "{}", // 5: additionalInfo (JSON)
    ];

    $scope.myModal = true;
    $scope.closeAllDropdowns();
  };

  // ===============================
  // DETAIL ROLE (READ-ONLY)
  // ===============================
  $scope.buttonDetailRole = function (row) {
    $scope.tempData = row;
    $scope.isDetailModal = true; // Mode Read-Only

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
    $scope.closeAllDropdowns();
  };

  // ===============================
  // EDIT ROLE
  // ===============================
  $scope.buttonEditRole = function (row) {
    $scope.tempData = row;
    $scope.isDetailModal = false;

    $scope.formHeader = "Edit Role";
    $scope.buttonLabel = "Update";

    $scope.newData = [
      row[1],
      String(row[2]),
      String(row[3]),
      row[4] || "",
      row[5] || "",
      JSON.stringify(row[6] || {}, null, 2),
    ];

    $scope.myModal = true;
    $scope.closeAllDropdowns();
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

    // ADD Logic
    if (!$scope.tempData) {
      $scope.content.push([nextId++, ...payload]);
    }
    // EDIT Logic
    else {
      const idx = $scope.content.findIndex((r) => r[0] === $scope.tempData[0]);
      if (idx !== -1) {
        $scope.content[idx] = [$scope.tempData[0], ...payload];
      }
    }

    $scope.closeModal();
  };

  // ===============================
  // DELETE
  // ===============================
  $scope.deleteRole = function (id) {
    $scope.tempDeleteId = id;
    $scope.showDeleteConfirm = true;
    $scope.closeAllDropdowns();
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
}

roleController.$inject = ["$scope"];