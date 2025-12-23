export default function cUser($scope, $filter) {
  console.log("User Controller Loaded");

  // ===============================
  // UI STATE
  // ===============================
  $scope.title = "User";
  $scope.myModal = false;
  $scope.isDetailModal = false;
  $scope.showDeleteConfirm = false;
  $scope.searchUser = "";

  $scope.formHeader = "";
  $scope.buttonLabel = "";

  $scope.tempData = null; // row selected for edit/detail
  $scope.tempDeleteId = null;
  $scope.tempDeleteType = null; // 'single' | 'multiple'
  let nextId = 4;

  // Dropdown state
  $scope.openDropdownId = null;
  $scope.toggleDropdown = function (rowId) {
    $scope.openDropdownId = $scope.openDropdownId === rowId ? null : rowId;
  };
  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // Selection state
  $scope.checkboxes = {};
  $scope.checkedIds = [];
  $scope.selectAll = false;

  // ===============================
  // MASTER DATA (DUMMY)
  // personOptions: [id, name]
  // roleOptions: [id, name]
  // ===============================
  $scope.personOptions = [
    ["p-001", "Ahmad Fauzi"],
    ["p-002", "Siti Aisyah"],
    ["p-003", "Budi Santoso"],
  ];

  $scope.roleOptions = [
    ["r-admin", "Admin"],
    ["r-staff", "Staff"],
    ["r-guru", "Guru"],
    ["r-siswa", "Siswa"],
  ];

  const personMap = Object.fromEntries($scope.personOptions);
  const roleMap = Object.fromEntries($scope.roleOptions);

  // ===============================
  // TABLE DATA (LOCAL)
  // Format:
  // [0 id, 1 user_code, 2 active_flag, 3 user_type, 4 person_id, 5 role_ids[], 6 remark, 7 additional_info{}]
  // ===============================
  $scope.content = [
    [1, "ADMIN@DOMAIN.COM", 1, 0, "p-001", ["r-admin", "r-staff"], "System admin", { note: "seed" }],
    [2, "USER@DOMAIN.COM", 0, 1, "p-002", ["r-siswa"], "New user", {}],
    [3, "+6281234567890", 34, 1, "p-003", ["r-guru"], "Inactive by admin", { reason: "manual" }],
  ];

  // ===============================
  // LABEL HELPERS
  // ===============================
  $scope.userTypeLabel = function (t) {
    const v = typeof t === "string" ? parseInt(t, 10) : t;
    return v === 0 ? "System" : v === 1 ? "App" : String(t);
  };

  $scope.activeFlagLabel = function (f) {
    const v = typeof f === "string" ? parseInt(f, 10) : f;
    const map = {
      0: "New User",
      1: "Active",
      17: "Must Change PWD",
      33: "Inactive by System",
      34: "Inactive by Admin",
    };
    return map[v] || String(f);
  };

  $scope.personLabel = function (personId) {
    if (!personId) return "-";
    return personMap[personId] || personId;
  };

  $scope.rolesLabel = function (roleIds) {
    if (!roleIds) return "-";
    const ids = Array.isArray(roleIds) ? roleIds : [roleIds];
    return ids.map((id) => roleMap[id] || id).join(", ");
  };

  // ===============================
  // CHECKBOX LOGIC
  // ===============================
  function recalcSelection() {
    const filtered = $filter("filter")($scope.content, $scope.searchUser);
    $scope.checkedIds = filtered
      .filter((row) => $scope.checkboxes[row[0]])
      .map((row) => row[0]);

    $scope.selectAll =
      filtered.length > 0 && $scope.checkedIds.length === filtered.length;
  }

  $scope.toggleSelectAll = function () {
    const filtered = $filter("filter")($scope.content, $scope.searchUser);
    filtered.forEach((row) => {
      $scope.checkboxes[row[0]] = $scope.selectAll;
    });
    recalcSelection();
  };

  $scope.oncheck = function () {
    recalcSelection();
  };

  $scope.$watch("searchUser", function (n, o) {
    if (n !== o) recalcSelection();
  });

  // ===============================
  // MODAL
  // newData:
  // [0 user_code, 1 user_type, 2 active_flag, 3 person_id, 4 role_ids[], 5 remark, 6 additional_info_text]
  // ===============================
  $scope.closeModal = function () {
    $scope.myModal = false;
    $scope.newData = [];
    $scope.isDetailModal = false;
  };

  $scope.buttonAddNewUser = function () {
    $scope.tempData = null;
    $scope.isDetailModal = false;
    $scope.formHeader = "Add User";
    $scope.buttonLabel = "Save";
    $scope.newData = ["", "1", "0", "", [], "", "{}"];
    $scope.myModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDetailUser = function (row) {
    $scope.tempData = row;
    $scope.isDetailModal = true;
    $scope.formHeader = "User Details";
    $scope.buttonLabel = "";
    $scope.newData = [
      row[1],
      String(row[3]),
      String(row[2]),
      row[4] || "",
      Array.isArray(row[5]) ? [...row[5]] : [],
      row[6] || "",
      JSON.stringify(row[7] || {}, null, 2),
    ];
    $scope.myModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonEditUser = function (row) {
    $scope.tempData = row;
    $scope.isDetailModal = false;
    $scope.formHeader = "Edit User";
    $scope.buttonLabel = "Update";
    $scope.newData = [
      row[1],
      String(row[3]),
      String(row[2]),
      row[4] || "",
      Array.isArray(row[5]) ? [...row[5]] : [],
      row[6] || "",
      JSON.stringify(row[7] || {}, null, 2),
    ];
    $scope.myModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.saveUser = function () {
    const userCode = ($scope.newData[0] || "").trim();
    if (!userCode) return alert("User Code is required");

    const userType = parseInt($scope.newData[1], 10);
    if (![0, 1].includes(userType)) return alert("Invalid User Type");

    const activeFlag = parseInt($scope.newData[2], 10);
    if (![0, 1, 17, 33, 34].includes(activeFlag)) return alert("Invalid Status");

    const personId = ($scope.newData[3] || "").trim();
    if (!personId) return alert("Person is required");

    const roles = Array.isArray($scope.newData[4]) ? $scope.newData[4] : [];
    if (roles.length === 0) return alert("At least one Role is required");

    const remark = ($scope.newData[5] || "").trim();
    if (!remark) return alert("Remark is required");

    let additionalInfo = {};
    try {
      additionalInfo = JSON.parse($scope.newData[6] || "{}");
      if (
        additionalInfo === null ||
        typeof additionalInfo !== "object" ||
        Array.isArray(additionalInfo)
      ) {
        return alert("Additional Information must be a JSON object");
      }
    } catch (e) {
      return alert("Invalid JSON in Additional Information");
    }

    const payload = [userCode, activeFlag, userType, personId, roles, remark, additionalInfo];

    // ADD
    if (!$scope.tempData) {
      $scope.content.push([nextId++, ...payload]);
    }
    // UPDATE
    else {
      const id = $scope.tempData[0];
      const idx = $scope.content.findIndex((r) => r[0] === id);
      if (idx !== -1) $scope.content[idx] = [id, ...payload];
    }

    $scope.closeModal();
    $scope.checkboxes = {};
    recalcSelection();
  };

  // ===============================
  // DELETE
  // ===============================
  $scope.cancelDelete = function () {
    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
    $scope.tempDeleteType = null;
  };

  $scope.deleteUser = function (id) {
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
      $scope.content = $scope.content.filter((r) => r[0] !== $scope.tempDeleteId);
    } else if ($scope.tempDeleteType === "multiple") {
      $scope.content = $scope.content.filter((r) => !$scope.checkedIds.includes(r[0]));
      $scope.checkboxes = {};
      $scope.checkedIds = [];
      $scope.selectAll = false;
    }

    $scope.showDeleteConfirm = false;
    $scope.tempDeleteId = null;
    $scope.tempDeleteType = null;
    recalcSelection();
  };
}

cUser.$inject = ["$scope", "$filter"];
