export default function featureController($scope, $timeout, $filter) {
  console.log("Feature Controller Loaded");

  // ====== STATE VARIABLES ======
  $scope.title = "Feature Management";
  $scope.isMemproses = false;

  // UI State
  $scope.fsearch = "";
  $scope.filterLevel = "";

  // Modals
  $scope.showModalFormFeature = false;
  $scope.confirmModal = false;
  $scope.formFeatureTitle = "";
  $scope.btnFeatureLabel = "";

  // Form Models
  $scope.newFeature = {};
  $scope.newFeatureRoute = "{}";
  $scope.newFeatureAddInfo = "{}";

  // Options
  $scope.parentOptions = [];
  $scope.typeOptions = [
    { val: 1, label: "Menu" },
    { val: 2, label: "Page" },
    { val: 3, label: "Action" },
  ];

  // ====== DUMMY DATA LENGKAP ======
  // Struktur: id, name, code, route, icon, url, level, type, parent, rights, seq, remark
  $scope.rawData = [
    // 1. HOME (Level 0)
    {
      id: "1",
      name: "Home",
      code: "HOME",
      route: "{}",
      icon: "fa-solid fa-house",
      url: "/home",
      level: 0,
      type: 1,
      parent: "0",
      rights: 0,
      seq: 10,
      remark: "Halaman Utama",
    },

    // 2. ENUM & FLAG (Level 0)
    {
      id: "2",
      name: "Enum & Flag",
      code: "ENUM_FLAG",
      route: "{}",
      icon: "fa-solid fa-tags",
      url: "",
      level: 0,
      type: 1,
      parent: "0",
      rights: 0,
      seq: 20,
      remark: "Parent Menu",
    },
    // Anak dari Enum & Flag (Level 1)
    {
      id: "21",
      name: "Enum List",
      code: "ENUM_LIST",
      route: "{}",
      icon: "fa-solid fa-tag",
      url: "/enum",
      level: 1,
      type: 2,
      parent: "2",
      rights: 0,
      seq: 10,
      remark: "",
    },
    {
      id: "22",
      name: "Flag List",
      code: "FLAG_LIST",
      route: "{}",
      icon: "fa-solid fa-flag",
      url: "/flag",
      level: 1,
      type: 2,
      parent: "2",
      rights: 0,
      seq: 20,
      remark: "",
    },

    // 3. USER MANAGEMENT (Level 0)
    {
      id: "3",
      name: "User Management",
      code: "USER_MGT",
      route: "{}",
      icon: "fa-solid fa-users",
      url: "",
      level: 0,
      type: 1,
      parent: "0",
      rights: 0,
      seq: 30,
      remark: "Parent Menu",
    },
    // Anak dari User Management (Level 1)
    {
      id: "31",
      name: "User",
      code: "USER_PAGE",
      route: "{}",
      icon: "fa-solid fa-user",
      url: "/user",
      level: 1,
      type: 2,
      parent: "3",
      rights: 0,
      seq: 10,
      remark: "",
    },
    // Action dari User (Level 2)
    {
      id: "311",
      name: "Add User",
      code: "USER_ADD",
      route: "{}",
      icon: "",
      url: "",
      level: 2,
      type: 3,
      parent: "31",
      rights: 0,
      seq: 10,
      remark: "Button Action",
    },
    {
      id: "312",
      name: "Edit User",
      code: "USER_EDIT",
      route: "{}",
      icon: "",
      url: "",
      level: 2,
      type: 3,
      parent: "31",
      rights: 0,
      seq: 20,
      remark: "Button Action",
    },

    {
      id: "32",
      name: "Person",
      code: "PERSON_PAGE",
      route: "{}",
      icon: "fa-solid fa-people-group",
      url: "/person",
      level: 1,
      type: 2,
      parent: "3",
      rights: 0,
      seq: 20,
      remark: "",
    },

    {
      id: "33",
      name: "Role",
      code: "ROLE_PAGE",
      route: "{}",
      icon: "fa-solid fa-user-tag",
      url: "/role",
      level: 1,
      type: 2,
      parent: "3",
      rights: 0,
      seq: 30,
      remark: "",
    },

    {
      id: "34",
      name: "Feature",
      code: "FEAT_PAGE",
      route: "{}",
      icon: "fa-solid fa-list-check",
      url: "/feature",
      level: 1,
      type: 2,
      parent: "3",
      rights: 0,
      seq: 40,
      remark: "",
    },
    // Action dari Feature (Level 2)
    {
      id: "341",
      name: "Add Feature",
      code: "FEAT_ADD",
      route: "{}",
      icon: "",
      url: "",
      level: 2,
      type: 3,
      parent: "34",
      rights: 0,
      seq: 10,
      remark: "Action",
    },
    {
      id: "342",
      name: "Delete Feature",
      code: "FEAT_DEL",
      route: "{}",
      icon: "",
      url: "",
      level: 2,
      type: 3,
      parent: "34",
      rights: 0,
      seq: 20,
      remark: "Action",
    },

    // 4. SETTINGS (Level 0)
    {
      id: "4",
      name: "Settings",
      code: "SETTING",
      route: "{}",
      icon: "fa-solid fa-cogs",
      url: "/settings",
      level: 0,
      type: 1,
      parent: "0",
      rights: 0,
      seq: 99,
      remark: "App Config",
    },
  ];

  $scope.featureContent = [];
  const expanded = {};
  let _editingId = null;

  // ====== CORE FUNCTIONS ======

  // 1. Close Modals
  $scope.closeModal = function () {
    $scope.showModalFormFeature = false;
  };

  $scope.closeConfirm = function () {
    $scope.confirmModal = false;
  };

  // 2. Tree Logic Helper (Recursive Flatten)
  function ensureExpandedDefaults() {
    if (Object.keys(expanded).length === 0) {
      $scope.rawData.forEach((r) => {
        // Expand Level 0 by default agar terlihat rapi
        if (r.level === 0) expanded[r.id] = true;
        // Expand Level 1 User Management agar terlihat child-nya
        if (r.code === "USER_MGT") expanded[r.id] = true;
      });
    }
  }

  function getTypeLabel(val) {
    const t = $scope.typeOptions.find((x) => x.val === val);
    return t ? t.label : "-";
  }

  function flattenTreeFiltered() {
    const mapChildren = {};
    $scope.rawData.forEach((r) => {
      const pid = String(r.parent || "0");
      if (!mapChildren[pid]) mapChildren[pid] = [];
      mapChildren[pid].push(r);
    });

    // Sort by sequence
    Object.keys(mapChildren).forEach((pid) => {
      mapChildren[pid].sort((a, b) => (a.seq || 0) - (b.seq || 0));
    });

    const out = [];
    const q = ($scope.fsearch || "").toLowerCase();

    (function walk(list, level) {
      list.forEach((r) => {
        const id = r.id;
        const kids = mapChildren[id] || [];
        const dr = { ...r };

        dr._id = id;
        dr._level = level;
        dr._hasChildren = kids.length > 0;
        dr._expanded = !!expanded[id];
        dr._typeLabel = getTypeLabel(r.type);

        // Filter Search
        const hit =
          !q ||
          (r.name || "").toLowerCase().includes(q) ||
          (r.code || "").toLowerCase().includes(q);

        if (hit) out.push(dr);
        // Render anak jika parent di-expand ATAU sedang searching
        if ((dr._expanded || q) && kids.length) {
          walk(kids, level + 1);
        }
      });
    })(mapChildren["0"] || [], 0);

    return out;
  }

  function refreshTable() {
    ensureExpandedDefaults();
    $scope.featureContent = flattenTreeFiltered();
    $scope.$applyAsync();
  }

  // ====== CRUD ACTIONS ======

  // A. Add Feature
  $scope.btnAddNewFeature = function () {
    _editingId = null;
    $scope.formFeatureTitle = "Add Feature";
    $scope.btnFeatureLabel = "Save";

    // Reset Form
    $scope.newFeature = {
      name: "",
      code: "",
      icon: "",
      url: "",
      level: 0,
      type: 1,
      parent: null,
      rights: 0,
      seq: 10,
      remark: "",
    };
    $scope.newFeatureRoute = "{}";
    $scope.newFeatureAddInfo = "{}";

    $scope.updateParentOptions();
    $scope.showModalFormFeature = true;
  };

  // B. Edit Feature
  $scope.btnEditFeature = function (row) {
    const original = $scope.rawData.find((r) => r.id === row.id);
    if (!original) return;

    _editingId = row.id;
    $scope.formFeatureTitle = "Edit Feature";
    $scope.btnFeatureLabel = "Update";

    $scope.newFeature = angular.copy(original);
    $scope.newFeatureRoute = original.route || "{}";
    $scope.newFeatureAddInfo = original.add_info || "{}";

    $scope.updateParentOptions();
    $scope.showModalFormFeature = true;
  };

  // C. Submit (Save/Update)
  $scope.submitFormFeature = function () {
    if (!$scope.newFeature.name || !$scope.newFeature.code) {
      alert("Name and Code are required!");
      return;
    }

    if (_editingId) {
      // Update Logic
      const index = $scope.rawData.findIndex((r) => r.id === _editingId);
      if (index !== -1) {
        $scope.rawData[index] = {
          ...$scope.rawData[index],
          ...$scope.newFeature,
        };
        $scope.rawData[index].route = $scope.newFeatureRoute;
        alert("✅ Feature updated!");
      }
    } else {
      // Add Logic
      const newId = String(Date.now());
      const newItem = {
        ...$scope.newFeature,
        id: newId,
        route: $scope.newFeatureRoute,
        parent: $scope.newFeature.parent || "0",
      };
      $scope.rawData.push(newItem);
      alert("✅ Feature added!");
    }

    $scope.closeModal();
    refreshTable();
  };

  // D. Delete Feature
  $scope.deleteSingleFeature = function (id) {
    $scope.confirmMessage = "Are you sure you want to delete this feature?";
    $scope.tempDeleteId = id;
    $scope.confirmModal = true;
  };

  $scope.onConfirmDelete = function () {
    if ($scope.tempDeleteId) {
      // Filter Hapus Parent
      $scope.rawData = $scope.rawData.filter(
        (r) => r.id !== $scope.tempDeleteId
      );
      // Filter Hapus Anak (Cascade Delete Sederhana)
      $scope.rawData = $scope.rawData.filter(
        (r) => r.parent !== $scope.tempDeleteId
      );

      alert("🗑️ Feature deleted!");
      $scope.confirmModal = false;
      refreshTable();
    }
  };

  // ====== HELPERS ======
  $scope.toggleExpand = function (id) {
    expanded[id] = !expanded[id];
    refreshTable();
  };

  // Update Dropdown Parent (Hanya tampilkan parent dari level di atasnya)
  $scope.updateParentOptions = function () {
    const lvl = Number($scope.newFeature.level) || 0;
    if (lvl <= 0) {
      $scope.parentOptions = [];
      $scope.newFeature.parent = null;
      return;
    }
    const needLevel = lvl - 1;
    $scope.parentOptions = $scope.rawData
      .filter((r) => r.level === needLevel)
      .map((r) => ({ id: r.id, name: r.name, code: r.code }));
  };

  $scope.expandAll = function () {
    $scope.rawData.forEach((r) => (expanded[r.id] = true));
    refreshTable();
  };

  $scope.collapseAll = function () {
    $scope.rawData.forEach((r) => (expanded[r.id] = false));
    refreshTable();
  };

  // Initialize
  refreshTable();
}

featureController.$inject = ["$scope", "$timeout", "$filter"];
