export default function featureController($scope, $timeout, $filter) {
  console.log("Feature Controller Loaded");

  // ====== STATE VARIABLES ======
  $scope.title = "Feature Management";
  $scope.isMemproses = false;
  $scope.fsearch = "";

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

  // --- DROPDOWN LOGIC (NEW) ---
  $scope.openDropdownId = null;

  $scope.toggleDropdown = function (id) {
    if ($scope.openDropdownId === id) {
      $scope.openDropdownId = null;
    } else {
      $scope.openDropdownId = id;
    }
  };

  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // ====== DUMMY DATA ======
  $scope.rawData = [
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
  ];

  $scope.featureContent = [];
  const expanded = {};
  let _editingId = null;

  // ====== CORE FUNCTIONS ======
  $scope.closeModal = function () {
    $scope.showModalFormFeature = false;
  };
  $scope.closeConfirm = function () {
    $scope.confirmModal = false;
  };

  function ensureExpandedDefaults() {
    if (Object.keys(expanded).length === 0) {
      $scope.rawData.forEach((r) => {
        if (r.level === 0) expanded[r.id] = true;
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

        const hit =
          !q ||
          (r.name || "").toLowerCase().includes(q) ||
          (r.code || "").toLowerCase().includes(q);

        if (hit) out.push(dr);
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
  $scope.btnAddNewFeature = function () {
    _editingId = null;
    $scope.formFeatureTitle = "Add Feature";
    $scope.btnFeatureLabel = "Save";
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
    $scope.closeAllDropdowns();
  };

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
    $scope.closeAllDropdowns();
  };

  $scope.submitFormFeature = function () {
    if (_editingId) {
      const index = $scope.rawData.findIndex((r) => r.id === _editingId);
      if (index !== -1) {
        $scope.rawData[index] = {
          ...$scope.rawData[index],
          ...$scope.newFeature,
        };
        $scope.rawData[index].route = $scope.newFeatureRoute;
      }
    } else {
      const newId = String(Date.now());
      const newItem = {
        ...$scope.newFeature,
        id: newId,
        route: $scope.newFeatureRoute,
        parent: $scope.newFeature.parent || "0",
      };
      $scope.rawData.push(newItem);
    }
    $scope.closeModal();
    refreshTable();
  };

  $scope.deleteSingleFeature = function (id) {
    $scope.confirmMessage = "Are you sure you want to delete this feature?";
    $scope.tempDeleteId = id;
    $scope.confirmModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.onConfirmDelete = function () {
    if ($scope.tempDeleteId) {
      $scope.rawData = $scope.rawData.filter(
        (r) => r.id !== $scope.tempDeleteId
      );
      $scope.rawData = $scope.rawData.filter(
        (r) => r.parent !== $scope.tempDeleteId
      );
      $scope.confirmModal = false;
      refreshTable();
    }
  };

  $scope.toggleExpand = function (id) {
    expanded[id] = !expanded[id];
    refreshTable();
  };

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

  refreshTable();
}

featureController.$inject = ["$scope", "$timeout", "$filter"];
