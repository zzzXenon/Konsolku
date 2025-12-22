export default function featureController($scope, $timeout, $filter) {
  console.log("Feature Controller Loaded");

  // ====== STATE VARIABLES ======
  $scope.title = "Feature";
  $scope.isMemproses = false;

  // UI State
  $scope.fsearch = "";
  $scope.filterLevel = "";

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

  // Options
  $scope.parentOptions = [];
  $scope.typeOptions = [
    { val: 1, label: "Menu" },
    { val: 2, label: "Page" },
    { val: 3, label: "Action" },
  ];

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
      remark: "Main",
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
      remark: "Parent",
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
      remark: "Parent",
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
      remark: "Btn",
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
      remark: "Config",
    },
  ];

  $scope.featureContent = [];
  const expanded = {};
  let _editingId = null;
  let _dragId = null; // Variable global untuk menyimpan ID item yg di-drag

  // ====== CORE FUNCTIONS ======
  $scope.closeModal = function () {
    $scope.showModalFormFeature = false;
  };
  $scope.closeConfirm = function () {
    $scope.confirmModal = false;
  };

  $scope.openDropdownId = null;
  $scope.toggleDropdown = function (id) {
    $scope.openDropdownId = $scope.openDropdownId === id ? null : id;
  };
  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // ====== TREE LOGIC ======
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
          if (dr._expanded && kids.length) walk(kids, level + 1);
        }
      });
    })(mapChildren["0"] || [], 0);

    return out;
  }

  function refreshTable() {
    ensureExpandedDefaults();
    $scope.featureContent = flattenTreeFiltered();
    $scope.$applyAsync();

    // PENTING: Re-bind Drag & Drop setelah tabel dirender ulang
    $timeout(function () {
      bindDnDPerRow();
    }, 200);
  }

  $scope.$watch("fsearch", function (newVal, oldVal) {
    if (newVal !== oldVal) refreshTable();
  });

  // ====== DRAG & DROP LOGIC (FIXED) ======

  function bindDnDPerRow() {
    // Cari container utama
    const container = document.querySelector("[data-feature-root]");
    if (!container) return;

    // Cari semua baris yang memiliki atribut data-id
    const rows = container.querySelectorAll("tr[data-id]");

    rows.forEach((row) => {
      // Pastikan draggable aktif
      row.setAttribute("draggable", "true");

      // --- DRAG START ---
      row.ondragstart = function (e) {
        _dragId = this.getAttribute("data-id");
        e.dataTransfer.effectAllowed = "move";
        // Style saat di-drag (opsional)
        this.style.opacity = "0.4";
      };

      // --- DRAG END ---
      row.ondragend = function (e) {
        this.style.opacity = "1";
        _dragId = null;
        // Bersihkan garis border
        rows.forEach((r) => (r.style.borderTop = ""));
      };

      // --- DRAG OVER ---
      row.ondragover = function (e) {
        e.preventDefault(); // Wajib agar bisa drop
        e.dataTransfer.dropEffect = "move";

        // Visual feedback: Garis biru di atas row target
        this.style.borderTop = "2px solid #3b82f6"; // Blue-500
      };

      // --- DRAG LEAVE ---
      row.ondragleave = function (e) {
        this.style.borderTop = "";
      };

      // --- DROP ---
      row.ondrop = function (e) {
        e.preventDefault();
        this.style.borderTop = "";

        const targetId = this.getAttribute("data-id");

        // Jika drag ID ada, dan bukan drop ke diri sendiri
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

    // Validasi: Hanya boleh pindah jika Parent SAMA
    if (draggedItem.parent !== targetItem.parent) {
      alert("⚠️ Hanya bisa memindahkan urutan dalam level/parent yang sama!");
      refreshTable(); // Reset visual
      return;
    }

    // Ambil semua saudara dalam parent yang sama
    const siblings = $scope.rawData
      .filter((r) => r.parent === draggedItem.parent)
      .sort((a, b) => (a.seq || 0) - (b.seq || 0));

    const dragIndex = siblings.findIndex((r) => r.id === dragId);
    const targetIndex = siblings.findIndex((r) => r.id === targetId);

    let newSeq = 0;

    if (dragIndex < targetIndex) {
      // Pindah ke BAWAH target
      const nextSibling = siblings[targetIndex + 1];
      if (nextSibling) {
        // Ambil nilai tengah antara target dan adiknya
        newSeq = (targetItem.seq + nextSibling.seq) / 2;
      } else {
        // Jika paling bawah, tambah 10
        newSeq = targetItem.seq + 10;
      }
    } else {
      // Pindah ke ATAS target
      // Ambil nilai tengah antara target dan kakaknya (atau target - 5)
      newSeq = targetItem.seq - 0.1; // Simple logic: geser sedikit ke atas target

      // Logic lebih presisi:
      const prevSibling = siblings[targetIndex - 1];
      if (prevSibling) {
        newSeq = (prevSibling.seq + targetItem.seq) / 2;
      } else {
        newSeq = targetItem.seq / 2;
      }
    }

    // Update data
    draggedItem.seq = newSeq;

    console.log(`Moved ${draggedItem.name} to seq: ${newSeq}`);

    // Refresh tabel
    refreshTable();
  }

  // ====== CRUD ACTIONS ======
  $scope.btnAddNewFeature = function () {
    _editingId = null;
    $scope.disableAll = false;
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
    $scope.disableAll = false;
    $scope.formFeatureTitle = "Edit Feature";
    $scope.btnFeatureLabel = "Update";
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
    $scope.disableAll = true; // Read Only
    $scope.formFeatureTitle = "Detail Feature";
    $scope.btnFeatureLabel = "";
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
      alert("Name and Code required!");
      return;
    }

    const finalParent =
      $scope.newFeature.level === 0 ? "0" : $scope.newFeature.parent || "0";

    if (_editingId) {
      const index = $scope.rawData.findIndex((r) => r.id === _editingId);
      if (index !== -1) {
        if (finalParent === _editingId) {
          alert("Cannot set parent to self!");
          return;
        }
        $scope.rawData[index] = {
          ...$scope.rawData[index],
          ...$scope.newFeature,
          parent: finalParent,
          route: $scope.newFeatureRoute,
        };
        alert("✅ Feature updated!");
      }
    } else {
      const newId = String(Date.now());
      const newItem = {
        ...$scope.newFeature,
        id: newId,
        parent: finalParent,
        route: $scope.newFeatureRoute,
      };
      $scope.rawData.push(newItem);
      alert("✅ Feature added!");
    }
    $scope.closeModal();
    refreshTable();
  };

  $scope.deleteSingleFeature = function (id) {
    $scope.confirmMessage = "Delete this feature and its children?";
    $scope.tempDeleteId = id;
    $scope.confirmModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.onConfirmDelete = function () {
    if ($scope.tempDeleteId) {
      const idsToDelete = [$scope.tempDeleteId];
      $scope.rawData.forEach((r) => {
        if (r.parent === $scope.tempDeleteId) idsToDelete.push(r.id);
      });
      $scope.rawData = $scope.rawData.filter(
        (r) => !idsToDelete.includes(r.id)
      );
      alert("🗑️ Feature deleted!");
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
      .filter((r) => r.level === needLevel && r.id !== _editingId)
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

  // Init
  refreshTable();
}

featureController.$inject = ["$scope", "$timeout", "$filter"];
