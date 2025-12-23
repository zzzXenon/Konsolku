export default function personController($scope, $filter, $timeout) {
  console.log("Person Controller Loaded");

  // ====== STATE VARIABLES ======
  $scope.title = "Person";
  $scope.isIdentityView = false;
  $scope.fsearch = "";

  // -- Modal Flags --
  $scope.showPersonModal = false;
  $scope.showIdentityModal = false;
  $scope.showConfirmModal = false;
  $scope.verifyEmailModal = false;
  $scope.modalOrganization = false;

  // -- Logic Flags --
  $scope.isEdit = false;
  $scope.isDetail = false;

  // -- Data Models --
  $scope.formData = {};
  $scope.formIdentityData = {};
  $scope.verifyData = { token: "" };

  // -- Selection Models (Person) --
  $scope.checkboxes = {};
  $scope.checkedIds = [];
  $scope.selectAll = false;

  // -- Selection Models (Identity) --
  $scope.checkboxesIdentity = {};
  $scope.checkedIdsIdentity = [];
  $scope.selectAllIdentity = false;

  // -- Organization Models --
  $scope.tempPersonId = null;
  $scope.listOrg = [];
  $scope.listdataOrganization = [];

  // -- Temp Data for Delete --
  $scope.tempDeleteId = null;
  $scope.tempDeleteType = null;
  $scope.deleteMessage = "";
  $scope.tempEmailIdentity = "";
  $scope.tempIdentityId = null;

  // ====== DROPDOWN LOGIC ======
  $scope.openDropdownId = null;
  $scope.toggleDropdown = function (id) {
    $scope.openDropdownId = $scope.openDropdownId === id ? null : id;
  };
  $scope.closeAllDropdowns = function () {
    $scope.openDropdownId = null;
  };

  // ====== DUMMY DATA ======
  $scope.nameTypeOptions = [
    { id: 1, name: "First Middle Last" },
    { id: 2, name: "Surname First Middle" },
  ];
  $scope.categoryOptions = [
    { id: 1, name: "Email" },
    { id: 2, name: "Phone" },
    { id: 3, name: "Social Media" },
  ];
  $scope.typeOptions = [
    { id: 0, name: "Custom" },
    { id: 1, name: "Personal" },
    { id: 2, name: "Office" },
    { id: 3, name: "Emergency" },
  ];

  // Master Organization (ASIX & IPM)
  const dummyMasterOrg = [
    [1, "ASIX"],
    [2, "IPM"],
  ];

  $scope.persons = [
    {
      id: 101,
      nameType: 1,
      prefixTitle: "Mr.",
      firstName: "Budi",
      middleName: "Santoso",
      lastName: "Wibowo",
      suffixTitle: "S.Kom",
      fullName: "Mr. Budi Santoso Wibowo S.Kom",
      remark: "Manager IT",
      addInfo: "{}",
      status: 1,
    },
    {
      id: 102,
      nameType: 1,
      prefixTitle: "Ms.",
      firstName: "Siti",
      middleName: "Aminah",
      lastName: "",
      suffixTitle: "",
      fullName: "Ms. Siti Aminah",
      remark: "HR Staff",
      addInfo: "{}",
      status: 1,
    },
  ];

  $scope.allIdentities = [
    {
      id: 1,
      personId: 101,
      category: 1,
      type: 2,
      value: "budi.office@company.com",
      sequence: 1,
      remark: "Main Email",
      verified: true,
    },
    {
      id: 2,
      personId: 101,
      category: 2,
      type: 1,
      value: "08123456789",
      sequence: 2,
      remark: "WA",
      verified: false,
    },
    {
      id: 3,
      personId: 101,
      category: 2,
      type: 1,
      value: "ZXC",
      sequence: 6,
      remark: "Test",
      verified: false,
    },
  ];

  const dummyPersonOrgMap = { 101: [1], 102: [2] };

  // ====== WATCHERS ======
  $scope.$watchGroup(
    [
      "formData.prefixTitle",
      "formData.firstName",
      "formData.middleName",
      "formData.lastName",
      "formData.suffixTitle",
    ],
    function (newValues) {
      if (!$scope.formData || $scope.isDetail) return;
      const [prefix, first, middle, last, suffix] = newValues;
      const parts = [prefix, first, middle, last, suffix].filter(
        (p) => p && String(p).trim() !== ""
      );
      $scope.formData.fullName = parts.join(" ");
    }
  );

  // ====== CHECKBOX LOGIC (PERSON) ======
  function recalcSelection() {
    const filtered = $filter("filter")($scope.persons, $scope.fsearch);
    $scope.checkedIds = filtered
      .filter((p) => $scope.checkboxes[p.id])
      .map((p) => p.id);
    $scope.selectAll =
      filtered.length > 0 && $scope.checkedIds.length === filtered.length;
  }
  $scope.toggleSelectAll = function () {
    const filtered = $filter("filter")($scope.persons, $scope.fsearch);
    filtered.forEach((p) => {
      $scope.checkboxes[p.id] = $scope.selectAll;
    });
    recalcSelection();
  };
  $scope.oncheck = function () {
    recalcSelection();
  };

  // ====== CHECKBOX LOGIC (IDENTITY - FIX) ======
  function recalcSelectionIdentity() {
    const items = $scope.currentIdentities || [];
    $scope.checkedIdsIdentity = items
      .filter((i) => $scope.checkboxesIdentity[i.id])
      .map((i) => i.id);
    $scope.selectAllIdentity =
      items.length > 0 && $scope.checkedIdsIdentity.length === items.length;
  }
  $scope.toggleSelectAllIdentity = function () {
    const items = $scope.currentIdentities || [];
    items.forEach((i) => {
      $scope.checkboxesIdentity[i.id] = $scope.selectAllIdentity;
    });
    recalcSelectionIdentity();
  };
  $scope.oncheckIdentity = function () {
    recalcSelectionIdentity();
  };

  // ====== MODAL CLOSE FUNCTIONS ======
  $scope.closePersonModal = function () {
    $scope.showPersonModal = false;
  };
  $scope.closeIdentityModal = function () {
    $scope.showIdentityModal = false;
  };
  $scope.closeOrgModal = function () {
    $scope.modalOrganization = false;
  };
  $scope.closeConfirmModal = function () {
    $scope.showConfirmModal = false;
  };
  $scope.closeVerifyModal = function () {
    $scope.verifyEmailModal = false;
  };

  // ====== CRUD PERSON ======
  $scope.buttonAddNewPerson = function () {
    $scope.formHeader = "Add New Person";
    $scope.buttonLabel = "Add Person";
    $scope.isEdit = false;
    $scope.isDetail = false;
    $scope.formData = {
      id: null,
      nameType: 1,
      prefixTitle: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffixTitle: "",
      fullName: "",
      remark: "",
      addInfo: "{}",
      status: 1,
    };
    $scope.showPersonModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonEditPerson = function (person) {
    $scope.formHeader = "Edit Person";
    $scope.buttonLabel = "Update Person";
    $scope.isEdit = true;
    $scope.isDetail = false;
    $scope.formData = angular.copy(person);
    $scope.showPersonModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDetailPerson = function (person) {
    $scope.formHeader = "Person Details";
    $scope.buttonLabel = "";
    $scope.isEdit = false;
    $scope.isDetail = true;
    $scope.formData = angular.copy(person);
    $scope.showPersonModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.submitPerson = function () {
    if ($scope.isDetail) {
      $scope.closePersonModal();
      return;
    }

    const { prefixTitle, firstName, middleName, lastName, suffixTitle } =
      $scope.formData;
    const parts = [
      prefixTitle,
      firstName,
      middleName,
      lastName,
      suffixTitle,
    ].filter((p) => p && p.trim() !== "");
    $scope.formData.fullName = parts.join(" ");

    if ($scope.isEdit) {
      const index = $scope.persons.findIndex(
        (p) => p.id === $scope.formData.id
      );
      if (index !== -1) $scope.persons[index] = $scope.formData;
    } else {
      const newId =
        $scope.persons.length > 0
          ? Math.max(...$scope.persons.map((p) => p.id)) + 1
          : 101;
      $scope.formData.id = newId;
      $scope.persons.push($scope.formData);
    }
    $scope.closePersonModal();
    $scope.checkboxes = {};
    recalcSelection();
  };

  $scope.buttonDeletePerson = function (id) {
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "person";
    $scope.deleteMessage = "Are you sure you want to delete this Person data?";
    $scope.showConfirmModal = true;
    $scope.closeAllDropdowns();
  };

  $scope.buttonDeleteSelected = function () {
    if ($scope.checkedIds.length === 0) return;
    $scope.tempDeleteType = "multiple_person";
    $scope.deleteMessage = `Are you sure you want to delete ${$scope.checkedIds.length} selected person(s)?`;
    $scope.showConfirmModal = true;
  };

  // ====== CRUD IDENTITY ======
  $scope.buttonPersonIdentity = function (person) {
    $scope.activePerson = person;
    $scope.isIdentityView = true;
    $scope.loadIdentities(person.id);
    $scope.closeAllDropdowns();
    // Reset Identity Selection
    $scope.checkboxesIdentity = {};
    $scope.checkedIdsIdentity = [];
    $scope.selectAllIdentity = false;
  };
  $scope.loadIdentities = function (personId) {
    $scope.currentIdentities = $scope.allIdentities.filter(
      (i) => i.personId === personId
    );
  };
  $scope.buttonBackToPerson = function () {
    $scope.isIdentityView = false;
    $scope.activePerson = null;
  };
  $scope.buttonAddNewPersonIdentity = function () {
    $scope.formHeader = "Add Identity";
    $scope.buttonLabel = "Save";
    $scope.formIdentityData = {
      id: null,
      personId: $scope.activePerson.id,
      category: 1,
      type: 1,
      value: "",
      sequence: 1,
      remark: "",
      verified: false,
    };
    $scope.showIdentityModal = true;
  };
  $scope.buttonUpdatePersonIdentity = function (identity) {
    $scope.formHeader = "Edit Identity";
    $scope.buttonLabel = "Update";
    $scope.formIdentityData = angular.copy(identity);
    $scope.showIdentityModal = true;
    $scope.closeAllDropdowns();
  };
  $scope.submitIdentityPerson = function () {
    if ($scope.formIdentityData.id) {
      const index = $scope.allIdentities.findIndex(
        (i) => i.id === $scope.formIdentityData.id
      );
      if (index !== -1) $scope.allIdentities[index] = $scope.formIdentityData;
    } else {
      const newId =
        $scope.allIdentities.length > 0
          ? Math.max(...$scope.allIdentities.map((i) => i.id)) + 1
          : 1;
      $scope.formIdentityData.id = newId;
      $scope.allIdentities.push($scope.formIdentityData);
    }
    $scope.loadIdentities($scope.activePerson.id);
    $scope.closeIdentityModal();
    $scope.checkboxesIdentity = {};
    recalcSelectionIdentity();
  };
  $scope.buttonDeletePersonIdentity = function (id) {
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "identity";
    $scope.deleteMessage = "Are you sure you want to delete this Identity?";
    $scope.showConfirmModal = true;
    $scope.closeAllDropdowns();
  };
  $scope.buttonDeleteSelectedIdentity = function () {
    if ($scope.checkedIdsIdentity.length === 0) return;
    $scope.tempDeleteType = "multiple_identity";
    $scope.deleteMessage = `Are you sure you want to delete ${$scope.checkedIdsIdentity.length} selected identity(ies)?`;
    $scope.showConfirmModal = true;
  };

  // ====== ORGANIZATION LOGIC ======
  $scope.butttonDetailPersonOrganization = function (person) {
    $scope.tempPersonId = person.id;
    $scope.formHeader = "Person Organization";
    $scope.listOrg = dummyMasterOrg;
    const savedOrgs = dummyPersonOrgMap[person.id] || [];
    $scope.listdataOrganization = [...savedOrgs];
    $scope.modalOrganization = true;
    $scope.closeAllDropdowns();
  };
  $scope.toggleOrg = function (orgId) {
    const index = $scope.listdataOrganization.indexOf(orgId);
    if (index > -1) {
      $scope.listdataOrganization.splice(index, 1);
    } else {
      $scope.listdataOrganization.push(orgId);
    }
  };
  $scope.buttonUpdatePersonOrg = function () {
    dummyPersonOrgMap[$scope.tempPersonId] = [...$scope.listdataOrganization];
    alert("✅ Organization Updated Successfully!");
    $scope.closeOrgModal();
  };

  // ====== DELETE EXECUTION ======
  $scope.confirmDelete = function () {
    if ($scope.tempDeleteType === "person") {
      $scope.persons = $scope.persons.filter(
        (p) => p.id !== $scope.tempDeleteId
      );
      delete dummyPersonOrgMap[$scope.tempDeleteId];
    } else if ($scope.tempDeleteType === "multiple_person") {
      $scope.persons = $scope.persons.filter(
        (p) => !$scope.checkedIds.includes(p.id)
      );
      $scope.checkedIds.forEach((id) => delete dummyPersonOrgMap[id]);
      $scope.checkedIds = [];
      $scope.checkboxes = {};
      $scope.selectAll = false;
    } else if ($scope.tempDeleteType === "identity") {
      $scope.allIdentities = $scope.allIdentities.filter(
        (i) => i.id !== $scope.tempDeleteId
      );
      $scope.loadIdentities($scope.activePerson.id);
    } else if ($scope.tempDeleteType === "multiple_identity") {
      $scope.allIdentities = $scope.allIdentities.filter(
        (i) => !$scope.checkedIdsIdentity.includes(i.id)
      );
      $scope.loadIdentities($scope.activePerson.id);
      $scope.checkedIdsIdentity = [];
      $scope.checkboxesIdentity = {};
      $scope.selectAllIdentity = false;
    }
    $scope.closeConfirmModal();
  };

  // ====== VERIFY LOGIC ======
  $scope.buttonVerifyPersonIdentity = function (identity) {
    if (identity.verified) {
      alert("This identity is already verified!");
      return;
    }
    $scope.verifyEmailModal = true;
    $scope.tempEmailIdentity = identity.value;
    $scope.tempIdentityId = identity.id;
    $scope.verifyData.token = "";
    $scope.closeAllDropdowns();
  };
  $scope.submitVerify = function () {
    if (!$scope.verifyData.token) {
      alert("Please enter token code!");
      return;
    }
    const index = $scope.allIdentities.findIndex(
      (i) => i.id === $scope.tempIdentityId
    );
    if (index !== -1) {
      $scope.allIdentities[index].verified = true;
      $scope.loadIdentities($scope.activePerson.id);
      alert("✅ Verification Successful!");
    }
    $scope.closeVerifyModal();
  };

  // Helpers
  $scope.getStatusLabel = (status) => (status === 1 ? "Active" : "Inactive");
  $scope.getCategoryName = (id) =>
    ($scope.categoryOptions.find((c) => c.id === id) || {}).name || "-";
  $scope.getTypeName = (id) =>
    ($scope.typeOptions.find((t) => t.id === id) || {}).name || "-";
}

personController.$inject = ["$scope", "$filter", "$timeout"];
