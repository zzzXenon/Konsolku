export default function personController($scope, $filter) {
  console.log("Person Controller Loaded");

  // --- STATE VARIABLES ---
  $scope.title = "Person";
  $scope.isIdentityView = false;
  $scope.fsearch = "";

  // Modal Flags (State)
  $scope.showPersonModal = false;
  $scope.showIdentityModal = false;
  $scope.showConfirmModal = false; // Untuk Delete
  $scope.verifyEmailModal = false;

  // Data Models
  $scope.formData = {};
  $scope.formIdentityData = {};

  // Temp Data untuk Delete
  $scope.tempDeleteId = null;
  $scope.tempDeleteType = null; // 'person' atau 'identity'

  // --- DUMMY DATA ---
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
    { id: 1, name: "Personal" },
    { id: 2, name: "Office" },
    { id: 3, name: "Emergency" },
  ];

  $scope.persons = [
    {
      id: 101,
      nameType: 1,
      firstName: "Budi",
      middleName: "Santoso",
      lastName: "Wibowo",
      fullName: "Budi Santoso Wibowo",
      remark: "Manager IT",
      status: 1,
    },
    {
      id: 102,
      nameType: 1,
      firstName: "Siti",
      middleName: "Aminah",
      lastName: "",
      fullName: "Siti Aminah",
      remark: "HR Staff",
      status: 1,
    },
    {
      id: 103,
      nameType: 2,
      firstName: "Doe",
      middleName: "John",
      lastName: "",
      fullName: "Doe John",
      remark: "Consultant",
      status: 2,
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
  ];

  // ============================================
  // FUNGSI UTAMA: CLOSE MODAL (SOLUSI MASALAH)
  // ============================================
  $scope.closePersonModal = function () {
    $scope.showPersonModal = false;
  };

  $scope.closeIdentityModal = function () {
    $scope.showIdentityModal = false;
  };

  $scope.closeConfirmModal = function () {
    $scope.showConfirmModal = false;
    $scope.tempDeleteId = null;
    $scope.tempDeleteType = null;
  };

  $scope.closeVerifyModal = function () {
    $scope.verifyEmailModal = false;
  };

  // ============================================
  // CRUD PERSON
  // ============================================
  $scope.buttonAddNewPerson = function () {
    $scope.formHeader = "Add New Person";
    $scope.buttonLabel = "Save";
    $scope.isEdit = false;
    $scope.formData = {
      id: null,
      nameType: 1,
      firstName: "",
      middleName: "",
      lastName: "",
      fullName: "",
      remark: "",
      status: 1,
    };
    $scope.showPersonModal = true;
  };

  $scope.buttonEditPerson = function (person) {
    $scope.formHeader = "Edit Person";
    $scope.buttonLabel = "Update";
    $scope.isEdit = true;
    $scope.formData = angular.copy(person);
    $scope.showPersonModal = true;
  };

  $scope.submitPerson = function () {
    const { firstName, middleName, lastName } = $scope.formData;
    $scope.formData.fullName = `${firstName || ""} ${middleName || ""} ${
      lastName || ""
    }`.trim();

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
    $scope.closePersonModal(); // Panggil fungsi close
  };

  // Trigger Delete Person Modal
  $scope.buttonDeletePerson = function (id) {
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "person";
    $scope.deleteMessage = "Are you sure you want to delete this Person data?";
    $scope.showConfirmModal = true;
  };

  // ============================================
  // CRUD IDENTITY
  // ============================================
  $scope.buttonPersonIdentity = function (person) {
    $scope.activePerson = person;
    $scope.isIdentityView = true;
    $scope.loadIdentities(person.id);
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
    $scope.isEditIdentity = false;
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
    $scope.isEditIdentity = true;
    $scope.formIdentityData = angular.copy(identity);
    $scope.showIdentityModal = true;
  };

  $scope.submitIdentityPerson = function () {
    if ($scope.isEditIdentity) {
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
  };

  // Trigger Delete Identity Modal
  $scope.buttonDeletePersonIdentity = function (id) {
    $scope.tempDeleteId = id;
    $scope.tempDeleteType = "identity";
    $scope.deleteMessage = "Are you sure you want to delete this Identity?";
    $scope.showConfirmModal = true;
  };

  // ============================================
  // EKSEKUSI DELETE (KONFIRMASI)
  // ============================================
  $scope.confirmDelete = function () {
    if ($scope.tempDeleteType === "person") {
      $scope.persons = $scope.persons.filter(
        (p) => p.id !== $scope.tempDeleteId
      );
      $scope.allIdentities = $scope.allIdentities.filter(
        (i) => i.personId !== $scope.tempDeleteId
      );
    } else if ($scope.tempDeleteType === "identity") {
      $scope.allIdentities = $scope.allIdentities.filter(
        (i) => i.id !== $scope.tempDeleteId
      );
      $scope.loadIdentities($scope.activePerson.id);
    }
    $scope.closeConfirmModal();
  };

  // Verify Email
  $scope.buttonVerifyPersonIdentity = function (identity) {
    $scope.verifyEmailModal = true;
    $scope.tempEmailIdentity = identity.value;
  };

  // Helpers
  $scope.getStatusLabel = (status) => (status === 1 ? "Active" : "Inactive");
  $scope.getCategoryName = (id) =>
    ($scope.categoryOptions.find((c) => c.id === id) || {}).name || "-";
  $scope.getTypeName = (id) =>
    ($scope.typeOptions.find((t) => t.id === id) || {}).name || "-";
}

personController.$inject = ["$scope", "$filter"];
