export default function personController($scope, $filter) {
  console.log("Person Controller Loaded");

  // --- STATE VARIABLES ---
  $scope.title = "Person";
  $scope.isIdentityView = false; // False = List Person, True = List Identity

  // Modal Flags
  $scope.showPersonModal = false;
  $scope.showIdentityModal = false;
  $scope.showConfirmModal = false;
  $scope.verifyEmailModal = false;

  // Form Data Models
  $scope.formData = {};
  $scope.formIdentityData = {};
  $scope.fsearch = "";
  $scope.fsearchIdentity = "";

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

  // Data Person (Parent)
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

  // Data Identity (Child) - Terhubung via personId
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
      personId: 102,
      category: 1,
      type: 1,
      value: "siti.aminah@gmail.com",
      sequence: 1,
      remark: "Personal",
      verified: true,
    },
  ];

  // --- PERSON CRUD FUNCTIONS ---

  // 1. Add Person
  $scope.buttonAddNewPerson = function () {
    $scope.formHeader = "Add New Person";
    $scope.buttonLabel = "Save";
    $scope.isEdit = false;

    // Reset Form
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

  // 2. Edit Person
  $scope.buttonEditPerson = function (person) {
    $scope.formHeader = "Edit Person";
    $scope.buttonLabel = "Update";
    $scope.isEdit = true;

    // Copy data agar tidak reaktif langsung
    $scope.formData = angular.copy(person);

    $scope.showPersonModal = true;
  };

  // 3. Submit Person (Save/Update)
  $scope.submitPerson = function () {
    // Generate Fullname Simple
    const { firstName, middleName, lastName } = $scope.formData;
    $scope.formData.fullName = `${firstName || ""} ${middleName || ""} ${
      lastName || ""
    }`.trim();

    if ($scope.isEdit) {
      // Update Logic
      const index = $scope.persons.findIndex(
        (p) => p.id === $scope.formData.id
      );
      if (index !== -1) {
        $scope.persons[index] = $scope.formData;
        alert("✅ Person updated successfully!");
      }
    } else {
      // Create Logic
      const newId =
        $scope.persons.length > 0
          ? Math.max(...$scope.persons.map((p) => p.id)) + 1
          : 101;
      $scope.formData.id = newId;
      $scope.persons.push($scope.formData);
      alert("✅ Person added successfully!");
    }
    $scope.showPersonModal = false;
  };

  // 4. Delete Person
  $scope.buttonDeletePerson = function (id) {
    if (!confirm("Are you sure you want to delete this person?")) return;

    // Remove Person
    $scope.persons = $scope.persons.filter((p) => p.id !== id);

    // Remove related identities
    $scope.allIdentities = $scope.allIdentities.filter(
      (i) => i.personId !== id
    );

    alert("🗑️ Person deleted!");
  };

  // --- IDENTITY CRUD FUNCTIONS ---

  // 1. View Identities
  $scope.activePerson = null;
  $scope.currentIdentities = [];

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

  // 2. Add Identity
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

  // 3. Edit Identity
  $scope.buttonUpdatePersonIdentity = function (identity) {
    $scope.formHeader = "Edit Identity";
    $scope.buttonLabel = "Update";
    $scope.isEditIdentity = true;

    $scope.formIdentityData = angular.copy(identity);
    $scope.showIdentityModal = true;
  };

  // 4. Submit Identity
  $scope.submitIdentityPerson = function () {
    if ($scope.isEditIdentity) {
      // Update Global Array
      const index = $scope.allIdentities.findIndex(
        (i) => i.id === $scope.formIdentityData.id
      );
      if (index !== -1) {
        $scope.allIdentities[index] = $scope.formIdentityData;
        alert("✅ Identity updated!");
      }
    } else {
      // Add Global Array
      const newId =
        $scope.allIdentities.length > 0
          ? Math.max(...$scope.allIdentities.map((i) => i.id)) + 1
          : 1;
      $scope.formIdentityData.id = newId;
      $scope.allIdentities.push($scope.formIdentityData);
      alert("✅ Identity added!");
    }

    // Refresh local view
    $scope.loadIdentities($scope.activePerson.id);
    $scope.showIdentityModal = false;
  };

  // 5. Delete Identity
  $scope.buttonDeletePersonIdentity = function (id) {
    if (!confirm("Delete this identity?")) return;

    $scope.allIdentities = $scope.allIdentities.filter((i) => i.id !== id);
    $scope.loadIdentities($scope.activePerson.id);
  };

  // 6. Verify Email Dummy
  $scope.buttonVerifyPersonIdentity = function (identity) {
    $scope.verifyEmailModal = true;
    $scope.tempEmailIdentity = identity.value;
    $scope.verifyToken = "";
  };

  $scope.onConfirmEmail = function () {
    alert("✅ Email Verified (Dummy)!");
    $scope.verifyEmailModal = false;
  };

  // --- UTILS ---
  $scope.getStatusLabel = function (status) {
    return status === 1 ? "Active" : "Inactive";
  };

  $scope.getCategoryName = function (id) {
    const cat = $scope.categoryOptions.find((c) => c.id === id);
    return cat ? cat.name : "-";
  };

  $scope.getTypeName = function (id) {
    const type = $scope.typeOptions.find((t) => t.id === id);
    return type ? type.name : "-";
  };
}

personController.$inject = ["$scope", "$filter"];
