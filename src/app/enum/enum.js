export default function cEnum($scope, $q, $timeout) {
   	console.log("start controller cEnum");
	
	const showToast = (msg, type) => {
        const color = type === 'error' ? 'bg-red-600' : 'bg-teal-600';
        const div = document.createElement('div');
        div.className = `fixed top-5 right-5 ${color} text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-500`;
        div.innerText = msg;
        document.body.appendChild(div);
        setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 3000);
    };

	$scope.toastOk = (msg) => showToast(msg, 'success');
    $scope.toastErr = (msg) => showToast(msg, 'error');
    $scope.toastWarn = (msg) => showToast(msg, 'error');
    $scope.toastInfo = (msg) => showToast(msg, 'success');
	
	let mockHeaders = [
        [1, 0, 1, 1, 'EN', 'Gender', {}, null, {}, 1],
        [2, 1, 2, 0, 'EN', 'User Status', {}, null, {}, 1]
    ];

	let mockDetails = [
        [101, 1, 1, 1, 'M', 'Male', null],
        [102, 1, 1, 2, 'F', 'Female', null],
        [201, 2, 1, 1, 'ACT', 'Active', null],
        [202, 2, 0, 2, 'BAN', 'Banned', null]
    ];

	let mockDetailLangs = [];

	//. INITIALIZE
	$scope.showTableEnumHeader = true;
	$scope.showTableEnumDetail = false;
	$scope.showTableEnumDetailLang = false;
	$scope.showModalFormEnumHeader = false;
	$scope.showModalFormEnumDetail = false;
	$scope.showModalFormEnumDetailLang = false;
	$scope.confirmModal = false;
	$scope.pageTitle = "Enum Header";

	$scope.checkboxes = {};
	$scope.checkedIds = [];
	$scope.selectAll = false;
	$scope.sortColumn = "";
	$scope.reverseSort = false;
	$scope.fsearch = "";

	$scope.defaultLangOptions = ['EN', 'ID', 'JP'];
	$scope.newDataEnumHeader = [];
	$scope.newDataEnumDetail = [];
	$scope.newDataEnumDetailLang = [];
	$scope.tempData = [];
    
    // Header definitions
	$scope.enumHeaderHeader = ["Multi Language", "Enum Type", "Flag", "Default Language", "Description"];
	$scope.enumDetailHeader = ["Flag", "Sequence", "Code", "Description"];
	$scope.enumDetailLangHeader = ["Language Code", "Description"];

	const enumTypeOptions = [
		{ val: 1, label: "Use Code" },
		{ val: 2, label: "Use ID" },
	];

	//. API FUNCTIONS
	///. HEADER
	const getEnumHeader = async () => {
        return new Promise(resolve => $timeout(() => resolve([...mockHeaders]), 200));
    };

	const addEnumHeader = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 10000);
            const newRow = [newId, ...data];
            mockHeaders.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

	const updateEnumHeader = async (data) => {
        return new Promise(resolve => {
            const id = data[0];
            const index = mockHeaders.findIndex(row => row[0] === id);
            if (index !== -1) mockHeaders[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteEnumHeader = async (id) => {
		return new Promise(resolve => {
			mockHeaders = mockHeaders.filter(row => row[0] !== id);
			$timeout(() => resolve(true), 200);
		});
    };

	const deleteMultipleEnumHeader = async (ids) => {
        return new Promise(resolve => {
            // FIX: Was mockDetails, changed to mockHeaders
            mockHeaders = mockHeaders.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };
	
	///. DETAIL
	const getEnumDetail = async (headerId) => {
        // Filter by HeaderID (index 1)
        const filtered = mockDetails.filter(row => row[1] === headerId);
        return new Promise(resolve => $timeout(() => resolve(filtered), 200));
    };

	const addEnumDetail = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 100000);
            const newRow = [newId, ...data]; 
            mockDetails.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

    const updateEnumDetail = async (data) => {
        return new Promise(resolve => {
            const index = mockDetails.findIndex(row => row[0] === data[0]);
            if (index !== -1) mockDetails[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteSingleEnumDetail = async (id) => {
        return new Promise(resolve => {
            mockDetails = mockDetails.filter(row => row[0] !== id);
            // Cascade delete languages
            mockDetailLangs = mockDetailLangs.filter(row => row[1] !== id);
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteMultipleEnumDetail = async (ids) => {
        return new Promise(resolve => {
            mockDetails = mockDetails.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };

	///. DETAIL LANG
	const getEnumDetailLang = async (detailId) => {
        // Filter by DetailID (index 1)
        const filtered = mockDetailLangs.filter(row => row[1] === detailId);
        return new Promise(resolve => $timeout(() => resolve(filtered), 200));
    };

    const addEnumDetailLang = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 100000);
            const newRow = [newId, ...data];
            mockDetailLangs.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

    const updateEnumDetailLang = async (data) => {
        return new Promise(resolve => {
            const index = mockDetailLangs.findIndex(row => row[0] === data[0]);
            if (index !== -1) mockDetailLangs[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteSingleEnumDetailLang = async (id) => {
        return new Promise(resolve => {
            mockDetailLangs = mockDetailLangs.filter(row => row[0] !== id);
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteMultipleEnumDetailLang = async (ids) => {
        return new Promise(resolve => {
            mockDetailLangs = mockDetailLangs.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };

	//. PRIVATE/INTERNAL FUNCTIONS
    const getEnumTypeLabel = (val) => {
        const option = enumTypeOptions.find(option => option.val === val);
        return option ? option.label : 'Unknown';
    };

	const stringifyAdditionalInfo = (data) => JSON.stringify(data || {}, null, 2);

	const filterData = (rawData, option) => {
        try {
            let indexToKeep = [];
            switch (option) {
                case "header":
                    $scope.filterMode = 'header';
                    // FIX: Updated indices to match mockHeaders: [ID, Multi, Type, Flag, Lang, Desc]
                    indexToKeep = [0, 1, 2, 3, 4, 5]; 
                    break;
                case "detail":
                    $scope.filterMode = 'detail';
                    // Match mockDetails: [ID, HeaderID, Flag, Seq, Code, Desc]
                    // Display: [ID, Flag, Seq, Code, Desc]
                    indexToKeep = [0, 2, 3, 4, 5];
                    break;
				case "detailLang":
					$scope.filterMode = 'detailLang';
                    // Match mockDetailLangs: [ID, DetailID, Code, Desc]
                    // Display: [ID, Code, Desc]
					indexToKeep = [0, 2, 3]; 
					break;
                default: return [];
            }
            
            let displayData = [];
            for (const row of rawData) {
                let newRow = [];
                for (const colIndex of indexToKeep) {
                    let val = row[colIndex];
                    if ($scope.filterMode === 'header' && colIndex === 2) {
                        val = getEnumTypeLabel(val);
                    }
                    newRow.push(val);
                }
                displayData.push(newRow);
            }
            return displayData;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

	///. Listeners
	window.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			$scope.showModalFormEnumHeader = false;
			$scope.showModalFormEnumDetail = false;
			$scope.showModalFormEnumDetailLang = false;
			$scope.confirmModal = false;
			$scope.$apply();
		}
	});

	$scope.liveUpdateFlagInHeader = async (row) => {
        // row[3] is the Flag index in display data (check filterData)
        // Note: 'row' here is a reference to the display object. 
        // We need to update the source of truth (mockHeaders).
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            // Toggle the flag (index 3 in mockHeaders)
            mockHeaders[index][3] = mockHeaders[index][3] === 1 ? 0 : 1;
            // Update the display row manually to reflect instant change
            row[3] = mockHeaders[index][3]; 
            $scope.toastOk("Flag updated");
        }
    };

    $scope.liveUpdateFlagMultiLang = async (row) => {
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockHeaders[index][1] = mockHeaders[index][1] === 1 ? 0 : 1;
            row[1] = mockHeaders[index][1];
            $scope.toastOk("Multi-lang updated");
        }
    };

    $scope.liveUpdateFlagInDetail = async (row) => {
        const id = row[0];
        const index = mockDetails.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockDetails[index][2] = mockDetails[index][2] === 1 ? 0 : 1;
            row[1] = mockDetails[index][2]; // row[1] is Flag in display
            $scope.toastOk("Detail Flag updated");
        }
    };

	$scope.activeMenuId = null;

    $scope.toggleMenu = (id, event) => {
        if (event) event.stopPropagation();
        if ($scope.activeMenuId === id) {
            $scope.activeMenuId = null;
        } else {
            $scope.activeMenuId = id;
        }
    };

    // Close menu when clicking anywhere else
    window.addEventListener('click', () => {
        if ($scope.activeMenuId !== null) {
            $scope.activeMenuId = null;
            $scope.$apply();
        }
    });

	// CONFIRMATION MODAL
	$scope.confirmAction = (message) => {
		const deferred = $q.defer();
		$scope.confirmModal = true;
		$scope.confirmMessage = message;

		$scope.onConfirm = () => {
			$scope.confirmModal = false;
			deferred.resolve(true);
		};

		$scope.onCancel = () => {
			$scope.confirmModal = false;
			deferred.resolve(false);
		};

		return deferred.promise;
	};

	$scope.deleteSelected = async function (table) {
        if(!confirm("Delete selected items?")) return;

		if (table === "header") {
			await deleteMultipleEnumHeader($scope.checkedIds);
            await initApp();
		} else if (table === "detail") {
			await deleteMultipleEnumDetail($scope.checkedIds);
            // Refresh detail view
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
            $scope.$apply();
		} else if (table === "detailLang") {
			await deleteMultipleEnumDetailLang($scope.checkedIds);
            // Refresh lang view
            const raw = await getEnumDetailLang($scope.currEnumDetailId);
            $scope.enumDetailLangContent = filterData(raw, "detailLang");
            $scope.$apply();
		}
		$scope.clearSelection();
	};

	//. PUBLIC/TEMPLATE FUNCTIONS
	///. ENUM HEADER
	$scope.btnAddNewEnumHeader = () => {
        // [Multi, Type, Flag, DefaultLang, Desc, JSON, Remark]
        $scope.newDataEnumHeader = [0, 1, 1, "EN", "", "{}", ""]; 
        $scope.showModalFormEnumHeader = true;
        $scope.formEnumHeaderTitle = "Add New Enum";
        $scope.btnEnumHeaderLabel = "Save";
        $scope.tempData = [];
    };

	$scope.btnEditEnumHeader = (row) => {
        // row is display data. We need raw data for editing.
        const id = row[0];
        const raw = mockHeaders.find(r => r[0] === id);
        
        // Copy raw data to form model
        $scope.newDataEnumHeader = [...raw]; // Index 0 is ID
        
        $scope.formEnumHeaderTitle = "Edit Header";
        $scope.btnEnumHeaderLabel = "Update";
        $scope.tempData = raw; // Use raw as temp to signal 'edit mode'
        $scope.showModalFormEnumHeader = true;
    };

    $scope.submitFormEnumHeader = async () => {
        // newDataEnumHeader contains [ID, Multi, Type, Flag, Lang, Desc, JSON, Remark]
        const formData = $scope.newDataEnumHeader;
        
        if (!formData[5]) { $scope.toastWarn("Description Required"); return; }

        if ($scope.tempData.length === 0) {
            await addEnumHeader(formData); 
        } else {
            await updateEnumHeader(formData);
        }

        $scope.showModalFormEnumHeader = false;
        await initApp();
        $scope.toastOk("Saved Successfully");
    };

	$scope.btnShowEnumDetail = async (row) => {
        $scope.currEnumHeaderId = row[0];
        $scope.currEnumHeaderDesc = row[5];
        $scope.pageTitle = `Enum Detail: ${row[5]}`;
        
        $scope.showTableEnumHeader = false;
        $scope.showTableEnumDetail = true;
        $scope.clearSelection();
        
        const raw = await getEnumDetail(row[0]);
        $scope.enumDetailContent = filterData(raw, "detail");
        $scope.$apply();
    };

	///. ENUM DETAIL
	$scope.btnAddNewEnumDetail = () => {
        // [HeaderID, Flag, Seq, Code, Desc, Unused]
        $scope.newDataEnumDetail = [$scope.currEnumHeaderId, 1, 0, "", "", null];
        $scope.formEnumDetailTitle = "Add New Detail";
        $scope.btnEnumDetailLabel = "Add";
        $scope.tempData = [];
        $scope.showModalFormEnumDetail = true;
    };

    $scope.btnEditEnumDetail = (row) => {
        const id = row[0];
        const raw = mockDetails.find(r => r[0] === id);
        $scope.newDataEnumDetail = [...raw]; 
        
        $scope.formEnumDetailTitle = "Edit Detail";
        $scope.btnEnumDetailLabel = "Update";
        $scope.tempData = raw;
        $scope.showModalFormEnumDetail = true;
    };

    $scope.submitFormEnumDetail = async () => {
        // [ID, HeaderID, Flag, Seq, Code, Desc, Unused]
        if (!$scope.newDataEnumDetail[4]) { $scope.toastWarn("Code is required!"); return; }
        if (!$scope.newDataEnumDetail[5]) { $scope.toastWarn("Description is required!"); return; }

        try {
            if ($scope.tempData.length === 0) {
                // Add mode: remove undefined ID if present, pass rest
                await addEnumDetail($scope.newDataEnumDetail); 
                $scope.toastOk("Detail added.");
            } else {
                await updateEnumDetail($scope.newDataEnumDetail);
                $scope.toastOk("Detail updated.");
            }

            $scope.showModalFormEnumDetail = false;
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
            $scope.$apply();

        } catch (err) {
            console.error(err);
            $scope.toastErr("Failed to save detail.");
        }
    };

    $scope.deleteEnumDetail = async (id) => {
        if (!confirm("Are you sure you want to delete this detail?")) return;

        await deleteSingleEnumDetail(id);
        
        const raw = await getEnumDetail($scope.currEnumHeaderId);
        $scope.enumDetailContent = filterData(raw, "detail");
        $scope.toastOk("Detail deleted.");
        $scope.$apply();
    };

    ///. ENUM DETAIL LANG
    $scope.btnShowEnumDetailLang = async (row) => {
        $scope.currEnumDetailId = row[0]; // Detail ID
        // Note: row[4] is Description in Detail view
        $scope.currEnumDetailDesc = row[4]; 
        
        $scope.pageTitle = `Enum Detail Language: ${row[4]}`;
        $scope.showTableEnumDetail = false;
        $scope.showTableEnumDetailLang = true;
        $scope.clearSelection();

        const raw = await getEnumDetailLang(row[0]);
        $scope.enumDetailLangContent = filterData(raw, "detailLang");
        $scope.$apply();
    };

    $scope.btnAddNewEnumDetailLang = () => {
        // [DetailID, LangCode, Desc]
        $scope.newDataEnumDetailLang = [$scope.currEnumDetailId, "EN", ""];
        $scope.formEnumDetailLangTitle = "Add Translation";
        $scope.btnEnumDetailLangLabel = "Add";
        $scope.tempData = [];
        $scope.showModalFormEnumDetailLang = true;
    };

    $scope.btnEditEnumDetailLang = (row) => {
        const id = row[0];
        const raw = mockDetailLangs.find(r => r[0] === id);
        $scope.newDataEnumDetailLang = [...raw];
        
        $scope.formEnumDetailLangTitle = "Edit Translation";
        $scope.btnEnumDetailLangLabel = "Update";
        $scope.tempData = raw;
        $scope.showModalFormEnumDetailLang = true;
    };

    $scope.submitFormEnumDetailLang = async () => {
        // [ID, DetailID, Code, Desc]
        if (!$scope.newDataEnumDetailLang[3]) { $scope.toastWarn("Description is required!"); return; }

        try {
            if ($scope.tempData.length === 0) {
                await addEnumDetailLang($scope.newDataEnumDetailLang);
            } else {
                await updateEnumDetailLang($scope.newDataEnumDetailLang);
            }

            $scope.showModalFormEnumDetailLang = false;
            const raw = await getEnumDetailLang($scope.currEnumDetailId);
            $scope.enumDetailLangContent = filterData(raw, "detailLang");
            $scope.toastOk("Translation saved.");
            $scope.$apply();

        } catch (err) {
            console.error(err);
            $scope.toastErr("Failed to save translation.");
        }
    };

    $scope.deleteEnumDetailLang = async (id) => {
        if (!confirm("Delete this translation?")) return;

        await deleteSingleEnumDetailLang(id);
        
        const raw = await getEnumDetailLang($scope.currEnumDetailId);
        $scope.enumDetailLangContent = filterData(raw, "detailLang");
        $scope.toastOk("Translation deleted.");
        $scope.$apply();
    };

    $scope.gotoPreviousPage = async () => {
        $scope.clearSelection();
        if ($scope.showTableEnumDetailLang) {
            // Level 3 -> Level 2
            $scope.showTableEnumDetailLang = false;
            $scope.showTableEnumDetail = true;
            $scope.pageTitle = `Enum Detail: ${$scope.currEnumHeaderDesc}`;
            
            // Refresh Level 2 Data
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
        } 
        else if ($scope.showTableEnumDetail) {
            // Level 2 -> Level 1
            $scope.showTableEnumDetail = false;
            $scope.showTableEnumHeader = true;
            $scope.pageTitle = "Enum Header";
            
            // Refresh Level 1 Data
            await initApp();
        }
        $scope.$apply();
    };

		$scope.clearSelection = function () {
			$scope.checkedIds = [];
			$scope.selectAll = false;
			$scope.checkboxes = {};
        };

    $scope.oncheck = function (id, checkedState) {
        if (checkedState) $scope.checkboxes[id] = true;
        else delete $scope.checkboxes[id];
        $scope.syncSelection();
    };

	$scope.toggleSelectAll = function () {
        let content = [];
        if ($scope.filterMode === 'header') content = $scope.enumHeaderContent;
        else if ($scope.filterMode === 'detail') content = $scope.enumDetailContent;
        else if ($scope.filterMode === 'detailLang') content = $scope.enumDetailLangContent;

        if (!content) return;
        
        content.forEach(item => {
            if ($scope.selectAll) $scope.checkboxes[item[0]] = true;
            else delete $scope.checkboxes[item[0]];
        });
        $scope.syncSelection();
    };

	$scope.syncSelection = function () {
        $scope.checkedIds = Object.keys($scope.checkboxes).map(Number);
    };

    $scope.$watch("checkboxes", (newVal, oldVal) => {
        if (newVal !== oldVal) $scope.syncSelection();
    }, true);

    // Sorting
    $scope.sortData = function (colIndex) {
        if ($scope.sortColumn === colIndex) $scope.reverseSort = !$scope.reverseSort;
        else {
            $scope.sortColumn = colIndex;
            $scope.reverseSort = false;
        }
    };

	$scope.getSortValue = function (item) {
        return item[$scope.sortColumn];
    };

	//. INIT APP
	const initApp = async () => {
		try {
			$scope.rawData = await getEnumHeader();
			$scope.displayData = filterData($scope.rawData, "header");
			$scope.enumHeaderContent = $scope.displayData;
		} catch (err) {
			$scope.toastErr("Failed to load initial data");
			throw err;
		} finally {
			$scope.$applyAsync();
		}
	};

	initApp();
}

cEnum.$inject = ['$scope', '$q', '$timeout'];