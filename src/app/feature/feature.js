export default function featureController($scope, $timeout, $filter) {
  console.log("Feature Controller Loaded");

  // ====== STATE VARIABLES ======
  $scope.title = "Feature";
  $scope.isMemproses = false;
  $scope.fsearch = "";

  // Modals
  $scope.showModalFormFeature = false;
  $scope.confirmModal = false;
  $scope.formFeatureTitle = "";
  $scope.btnFeatureLabel = "";
  $scope.disableAll = false;

  // Form Models
  $scope.newFeature = {};
  $scope.newFeatureRoute = "{}";
  $scope.newFeatureAddInfo = "{}";

  // Selection Models
  $scope.checkboxes = {};
  $scope.checkedIds = [];
  $scope.selectAll = false;

  // -- Temp Data for Delete --
  $scope.tempDeleteId = null;
  $scope.tempDeleteType = null; // 'single', 'multiple'
  $scope.deleteMessage = "";

  // Drag & Drop Variables
  let _dragId = null;

  // Options
  $scope.parentOptions = [];
  $scope.typeOptions = [
    { val: 1, label: "Menu" },
    { val: 2, label: "Page" },
    { val: 3, label: "Action" },
  ];

  // --- DROPDOWN LOGIC ---
  $scope.openDropdownId = null;
  $scope.toggleDropdown = function (id) {
    $scope.openDropdownId = $scope.openDropdownId === id ? null : id;
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

  // Recursive search for parent visibility
  function getAncestors(nodeId, allData, resultSet) {
    const node = allData.find((r) => r.id === nodeId);
    if (node && node.parent && node.parent !== "0") {
      resultSet.add(node.parent);
      getAncestors(node.parent, allData, resultSet);
    }
  }

  function flattenTreeFiltered() {
    const q = ($scope.fsearch || "").toLowerCase();
    const matchedIds = new Set();

    if (q) {
      $scope.rawData.forEach((r) => {
        if (
          (r.name || "").toLowerCase().includes(q) ||
          (r.code || "").toLowerCase().includes(q)
        ) {
          matchedIds.add(r.id);
          getAncestors(r.id, $scope.rawData, matchedIds);
        }
      });
    }

    const mapChildren = {};
    $scope.rawData.forEach((r) => {
      const pid = String(r.parent || "0");
      if (!mapChildren[pid]) mapChildren[pid] = [];
      mapChildren[pid].push(r);
    });

    Object.keys(mapChildren).forEach((pid) => {
      mapChildren[pid].sort(
        (a, b) => (Number(a.seq) || 0) - (Number(b.seq) || 0)
      );
    });

    const out = [];
    (function walk(list, level) {
      list.forEach((r) => {
        const id = r.id;
        const isVisible = !q || matchedIds.has(id);

        if (isVisible) {
          const kids = mapChildren[id] || [];
          const dr = { ...r };
          dr._id = id;
          dr._level = level;
          dr._hasChildren = kids.length > 0;
          dr._expanded = q ? true : !!expanded[id];
          dr._typeLabel = getTypeLabel(r.type);

          out.push(dr);
          if (dr._expanded && kids.length) {
            walk(kids, level + 1);
          }
        }
      });
    })(mapChildren["0"] || [], 0);

    return out;
  }

  function refreshTable() {
    ensureExpandedDefaults();
    $scope.featureContent = flattenTreeFiltered();
    recalcSelection();
    $scope.$applyAsync();

    // Re-bind Drag & Drop
    $timeout(function () {
      bindDnDPerRow();
    }, 200);
  }

  // ====== CHECKBOX LOGIC ======
  function recalcSelection() {
    const visibleItems = $scope.featureContent || [];
    $scope.checkedIds = visibleItems
      .filter((r) => $scope.checkboxes[r.id])
      .map((r) => r.id);
    $scope.selectAll =
      visibleItems.length > 0 &&
      $scope.checkedIds.length === visibleItems.length;
  }

  $scope.toggleSelectAll = function () {
    const visibleItems = $scope.featureContent || [];
    visibleItems.forEach((r) => {
      $scope.checkboxes[r.id] = $scope.selectAll;
    });
    recalcSelection();
  };

  $scope.oncheck = function () {
    recalcSelection();
  };

  $scope.$watch("fsearch", function (newVal, oldVal) {
    if (newVal !== oldVal) refreshTable();
  });

  // ====== DRAG & DROP LOGIC ======
  function bindDnDPerRow() {
    const container = document.querySelector("[data-feature-root]");
    if (!container) return;

    const rows = container.querySelectorAll("tr[data-id]");
    rows.forEach((row) => {
      row.setAttribute("draggable", "true");

      row.ondragstart = function (e) {
        _dragId = this.getAttribute("data-id");
        e.dataTransfer.effectAllowed = "move";
        this.classList.add("opacity-50");
      };

      row.ondragend = function (e) {
        this.classList.remove("opacity-50");
        _dragId = null;
        rows.forEach((r) => (r.style.borderTop = ""));
      };

      row.ondragover = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        this.style.borderTop = "2px solid #0d9488"; // Teal-600 color
      };

      row.ondragleave = function (e) {
        this.style.borderTop = "";
      };

      row.ondrop = function (e) {
        e.preventDefault();
        this.style.borderTop = "";
        const targetId = this.getAttribute("data-id");
        if (_dragId && targetId && _dragId !== targetId) {
          $scope.$apply(() => {
            handleReorder(_dragId, targetId);
          });
        }
      };
    });
  }

  function handleReorder(dragId, targetId) {
    const draggedItem = $scope.rawData.find((r) => r.id === dragId);
    const targetItem = $scope.rawData.find((r) => r.id === targetId);

    if (!draggedItem || !targetItem) return;

    // Validasi: Hanya boleh pindah di parent yang sama
    if (draggedItem.parent !== targetItem.parent) {
      alert(
        "⚠️ Hanya diperbolehkan mengubah urutan dalam level/parent yang sama!"
      );
      return;
    }

    const siblings = $scope.rawData
      .filter((r) => r.parent === draggedItem.parent)
      .sort((a, b) => (a.seq || 0) - (b.seq || 0));

    const dragIndex = siblings.findIndex((r) => r.id === dragId);
    const targetIndex = siblings.findIndex((r) => r.id === targetId);
    let newSeq = 0;

    if (dragIndex < targetIndex) {
      // Drag ke bawah
      const nextSibling = siblings[targetIndex + 1];
      newSeq = nextSibling
        ? (targetItem.seq + nextSibling.seq) / 2
        : targetItem.seq + 10;
    } else {
      // Drag ke atas
      const prevSibling = siblings[targetIndex - 1];
      newSeq = prevSibling
        ? (prevSibling.seq + targetItem.seq) / 2
        : targetItem.seq / 2;
    }

    draggedItem.seq = newSeq;
    refreshTable();
  }

  // ====== CRUD ACTIONS ======
  $scope.btnAddNewFeature = function () {
    _editingId = null;
    $scope.formFeatureTitle = "Tambah Feature";
    $scope.btnFeatureLabel = "Simpan";
    $scope.disableAll = false;
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
    $scope.formFeatureTitle = "Ubah Feature";
    $scope.btnFeatureLabel = "Perbarui";
    $scope.disableAll = false;
    $scope.newFeature = angular.copy(original);
    $scope.newFeatureRoute = original.route || "{}";
    $scope.newFeatureAddInfo = original.add_info || "{}";
    $scope.updateParentOptions();
    $scope.showModalFormFeature = true;
    $scope.closeAllDropdowns();
  };

  $scope.btnDetailFeature = function (row) {
    const original = $scope.rawData.find((r) => r.id === row.id);
    if (!original) return;
    _editingId = row.id;
    $scope.formFeatureTitle = "Detail Feature";
    $scope.btnFeatureLabel = "";
    $scope.disableAll = true; // Read Only
    $scope.newFeature = angular.copy(original);
    $scope.newFeatureRoute = original.route || "{}";
    $scope.newFeatureAddInfo = original.add_info || "{}";
    $scope.updateParentOptions();
    $scope.showModalFormFeature = true;
    $scope.closeAllDropdowns();
  };

  $scope.submitFormFeature = function () {
    if ($scope.disableAll) {
      $scope.closeModal();
      return;
    }

    if (!$scope.newFeature.name || !$scope.newFeature.code) {
      alert("Nama dan Kode wajib diisi!");
      return;
    }

    if (_editingId) {
      const index = $scope.rawData.findIndex((r) => r.id === _editingId);
      if (index !== -1) {
        // Validasi Parent Self
        const finalParent =
          $scope.newFeature.level === 0 ? "0" : $scope.newFeature.parent || "0";
        if (finalParent === _editingId) {
          alert("Tidak bisa menjadikan diri sendiri sebagai parent!");
          return;
        }

        $scope.rawData[index] = {
          ...$scope.rawData[index],
          ...$scope.newFeature,
        };
        $scope.rawData[index].route = $scope.newFeatureRoute;
        alert("✅ Feature berhasil diperbarui!");
      }
    } else {
      const newId = String(Date.now());
      const finalParent =
        $scope.newFeature.level === 0 ? "0" : $scope.newFeature.parent || "0";
      const newItem = {
        ...$scope.newFeature,
        id: newId,
        route: $scope.newFeatureRoute,
        parent: finalParent,
      };
      $scope.rawData.push(newItem);
      alert("✅ Feature berhasil ditambahkan!");
    }
    $scope.closeModal();
    refreshTable();
  };

  // ====== DELETE LOGIC ======
  $scope.deleteSingleFeature = function (id) {
    $scope.confirmMessage = "Apakah Anda yakin ingin menghapus feature ini?";
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "single";
    $scope.confirmModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDeleteSelected = function () {
    if ($scope.checkedIds.length === 0) return;
    $scope.tempDeleteType = "multiple";
    $scope.confirmMessage = `Apakah Anda yakin ingin menghapus ${$scope.checkedIds.length} feature yang dipilih?`;
    $scope.confirmModal = true;
  };

  $scope.onConfirmDelete = function () {
    if ($scope.tempDeleteType === "single") {
      const idsToDelete = [$scope.tempDeleteId];
      $scope.rawData.forEach((r) => {
        if (r.parent === $scope.tempDeleteId) idsToDelete.push(r.id);
      });
      $scope.rawData = $scope.rawData.filter(
        (r) => !idsToDelete.includes(r.id)
      );
    } else if ($scope.tempDeleteType === "multiple") {
      $scope.rawData = $scope.rawData.filter(
        (r) => !$scope.checkedIds.includes(r.id)
      );
      $scope.checkboxes = {};
      $scope.checkedIds = [];
      $scope.selectAll = false;
    }

    alert("🗑️ Feature berhasil dihapus!");
    $scope.confirmModal = false;
    refreshTable();
  };

  // ====== HELPERS ======
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
