export default function roleController($scope, $filter) {
  console.log("Role Controller Loaded");

  // ===============================
  // STATE UI
  // ===============================
  $scope.title = "Role";
  $scope.myModal = false;
  $scope.isDetailModal = false;
  $scope.showDeleteConfirm = false;
  $scope.searchRole = "";

  $scope.formHeader = "";
  $scope.buttonLabel = "";

  $scope.tempData = null;
  $scope.tempDeleteId = null;
  $scope.tempDeleteType = null; // 'single', 'multiple'
  let nextId = 4;

  // Dropdown state
  $scope.openDropdownId = null;
  $scope.toggleDropdown = function (rowId) {
    $scope.openDropdownId = $scope.openDropdownId === rowId ? null : rowId;
  };
  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // Selection State
  $scope.checkboxes = {};
  $scope.checkedIds = [];
  $scope.selectAll = false;

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
  // CHECKBOX LOGIC
  // ===============================
  function recalcSelection() {
    const filtered = $filter("filter")($scope.content, $scope.searchRole);
    // Map filtered item to its ID (index 0)
    $scope.checkedIds = filtered
      .filter((row) => $scope.checkboxes[row[0]])
      .map((row) => row[0]);
    $scope.selectAll =
      filtered.length > 0 && $scope.checkedIds.length === filtered.length;
  }

  $scope.toggleSelectAll = function () {
    const filtered = $filter("filter")($scope.content, $scope.searchRole);
    filtered.forEach((row) => {
      $scope.checkboxes[row[0]] = $scope.selectAll;
    });
    recalcSelection();
  };

  $scope.oncheck = function () {
    recalcSelection();
  };

  // Watcher for search to update selection capability
  $scope.$watch("searchRole", function (newVal, oldVal) {
    if (newVal !== oldVal) recalcSelection();
  });

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
  // CRUD FUNCTIONS
  // ===============================
  $scope.buttonAddNewRole = function () {
    $scope.tempData = null;
    $scope.isDetailModal = false;
    $scope.formHeader = "Add Role";
    $scope.buttonLabel = "Save";
    $scope.newData = ["", "1", "1", "", "", "{}"];
    $scope.myModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDetailRole = function (row) {
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
    $scope.closeAllDropdowns();
  };

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

  $scope.addDataRole = function () {
    if (!$scope.newData[0]) {
      alert("Role name is required");
      return;
    }
    let additionalInfo = {};
    try {
      additionalInfo = JSON.parse($scope.newData[5] || "{}");
    } catch (e) {
      alert("Invalid JSON");
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

    if (!$scope.tempData) {
      $scope.content.push([nextId++, ...payload]);
    } else {
      const idx = $scope.content.findIndex((r) => r[0] === $scope.tempData[0]);
      if (idx !== -1) {
        $scope.content[idx] = [$scope.tempData[0], ...payload];
      }
    }
    $scope.closeModal();
    // Reset checkbox if any update
    $scope.checkboxes = {};
    recalcSelection();
  };

  // ===============================
  // DELETE
  // ===============================
  $scope.deleteRole = function (id) {
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "single";
    $scope.showDeleteConfirm = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDeleteSelected = function () {
    if ($scope.checkedIds.length === 0) return;
    $scope.tempDeleteType = "multiple";
    $scope.showDeleteConfirm = true;
  };

  $scope.deleteConfirmed = function () {
    if ($scope.tempDeleteType === "single") {
      if ($scope.tempDeleteId) {
        $scope.content = $scope.content.filter(
          (r) => r[0] !== $scope.tempDeleteId
        );
      }
    } else if ($scope.tempDeleteType === "multiple") {
      $scope.content = $scope.content.filter(
        (r) => !$scope.checkedIds.includes(r[0])
      );
      $scope.checkboxes = {};
      $scope.checkedIds = [];
      $scope.selectAll = false;
    }
    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
  };
}

roleController.$inject = ["$scope", "$filter"];
