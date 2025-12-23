export default function cFlag($scope, $q, $timeout) {
   	console.log("start controller cFlag");
	
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
	
	let mockHeaders = [
        [1, 0, 1, 1, 0, 'EN', 'General Settings', '{}', 'System Default'],
        [2, 1, 1, 0, 5, 'EN', 'Account Types', '{}', 'User Defined']
    ];

	let mockDetails = [
        [101, 1, 1, 1, 'Enable Notifications', ''],
        [102, 1, 0, 2, 'Dark Mode', ''],
        [201, 2, 1, 1, 'Premium', 'Paid tier'],
        [202, 2, 1, 2, 'Basic', 'Free tier']
    ];

	let mockDetailLangs = [
        [1001, 101, 'ID', 'Aktifkan Notifikasi', ''],
        [1002, 102, 'ID', 'Mode Gelap', '']
    ];

	//. INITIALIZE
	$scope.pageTitle = "Flag Header";

	$scope.showTableFlagHeader = true;
	$scope.showTableFlagDetail = false;
	$scope.showTableFlagDetailLang = false;
	$scope.showModalFormFlagHeader = false;
	$scope.showModalFormFlagDetail = false;
	$scope.showModalFormFlagDetailLang = false;
	$scope.confirmModal = false;

	$scope.checkboxes = {};
	$scope.checkedIds = [];
	$scope.selectAll = false;
	$scope.sortColumn = "";
	$scope.reverseSort = false;
	$scope.fsearch = "";

	$scope.defaultLangOptions = ['EN', 'ID', 'JP'];
	$scope.newDataFlagHeader = [];
	$scope.newDataFlagDetail = [];
	$scope.newDataFlagDetailLang = [];
	$scope.tempData = [];
    
	$scope.flagHeaderHeader = ["Multi Lang", "Flag", "Is User", "Count", "Lang", "Description"];
	$scope.flagDetailHeader = ["Flag", "Sequence", "Description"];
	$scope.flagDetailLangHeader = ["Language", "Description"];

    //. API FUNCTIONS
	///. HEADER
	const getFlagHeader = async () => {
        return new Promise(resolve => $timeout(() => resolve([...mockHeaders]), 200));
    };

	const addFlagHeader = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 10000);
            const newRow = [newId, ...data];
            mockHeaders.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

	const updateFlagHeader = async (data) => {
        return new Promise(resolve => {
            const id = data[0];
            const index = mockHeaders.findIndex(row => row[0] === id);
            if (index !== -1) mockHeaders[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteFlagHeader = async (id) => {
		return new Promise(resolve => {
			mockHeaders = mockHeaders.filter(row => row[0] !== id);
			$timeout(() => resolve(true), 200);
		});
    };

	const deleteMultipleFlagHeader = async (ids) => {
        return new Promise(resolve => {
            mockHeaders = mockHeaders.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };
	
	///. DETAIL
	const getFlagDetail = async (headerId) => {
        const filtered = mockDetails.filter(row => row[1] === headerId);
        return new Promise(resolve => $timeout(() => resolve(filtered), 200));
    };

	const addFlagDetail = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 100000);
            const newRow = [newId, ...data]; 
            mockDetails.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

    const updateFlagDetail = async (data) => {
        return new Promise(resolve => {
            const index = mockDetails.findIndex(row => row[0] === data[0]);
            if (index !== -1) mockDetails[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteSingleFlagDetail = async (id) => {
        return new Promise(resolve => {
            mockDetails = mockDetails.filter(row => row[0] !== id);
            mockDetailLangs = mockDetailLangs.filter(row => row[1] !== id);
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteMultipleFlagDetail = async (ids) => {
        return new Promise(resolve => {
            mockDetails = mockDetails.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };

	///. DETAIL LANG
	const getFlagDetailLang = async (detailId) => {
        const filtered = mockDetailLangs.filter(row => row[1] === detailId);
        return new Promise(resolve => $timeout(() => resolve(filtered), 200));
    };

    const addFlagDetailLang = async (data) => {
        return new Promise(resolve => {
            const newId = Math.floor(Math.random() * 100000);
            const newRow = [newId, ...data];
            mockDetailLangs.push(newRow);
            $timeout(() => resolve(true), 200);
        });
    };

    const updateFlagDetailLang = async (data) => {
        return new Promise(resolve => {
            const index = mockDetailLangs.findIndex(row => row[0] === data[0]);
            if (index !== -1) mockDetailLangs[index] = data;
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteSingleFlagDetailLang = async (id) => {
        return new Promise(resolve => {
            mockDetailLangs = mockDetailLangs.filter(row => row[0] !== id);
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteMultipleFlagDetailLang = async (ids) => {
        return new Promise(resolve => {
            mockDetailLangs = mockDetailLangs.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };

    //. PRIVATE/INTERNAL FUNCTIONS
	const filterData = (rawData, option) => {
        try {
            let indexToKeep = [];
            switch (option) {
                case "header":
                    $scope.filterMode = 'header';
                    indexToKeep = [0, 1, 2, 3, 4, 5, 6]; 
                    break;
                case "detail":
                    $scope.filterMode = 'detail';
                    indexToKeep = [0, 2, 3, 4];
                    break;
				case "detLang":
					$scope.filterMode = 'detLang';
					indexToKeep = [0, 2, 3]; 
					break;
                default: return [];
            }
            
            let displayData = [];
            for (const row of rawData) {
                let newRow = [];
                for (const colIndex of indexToKeep) {
                    newRow.push(row[colIndex]);
                }
                displayData.push(newRow);
            }
            return displayData;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    ///. LISTENERS
    $scope.activeMenuId = null;
    $scope.toggleMenu = (id, event) => {
        if (event) event.stopPropagation();
        $scope.activeMenuId = $scope.activeMenuId === id ? null : id;
    };
    window.addEventListener('click', () => {
        if ($scope.activeMenuId !== null) {
            $scope.activeMenuId = null;
            $scope.$apply();
        }
    });

	window.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			$scope.showModalFormFlagHeader = false;
			$scope.showModalFormFlagDetail = false;
			$scope.showModalFormFlagDetailLang = false;
			$scope.confirmModal = false;
			$scope.$apply();
		}
	});

    $scope.liveUpdateFlagMultiLang = async (row) => {
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockHeaders[index][1] = mockHeaders[index][1] === 1 ? 0 : 1;
            row[1] = mockHeaders[index][1];
            $scope.toastOk("Multi-lang updated");
        }
    };

    $scope.liveUpdateFlagInHeader = async (row) => {
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockHeaders[index][2] = mockHeaders[index][2] === 1 ? 0 : 1;
            row[2] = mockHeaders[index][2];
            $scope.toastOk("Flag updated");
        }
    };
    
    $scope.liveUpdateFlagIsUser = async (row) => {
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockHeaders[index][3] = mockHeaders[index][3] === 1 ? 0 : 1;
            row[3] = mockHeaders[index][3];
            $scope.toastOk("Is User updated");
        }
    };

    $scope.liveUpdateFlagInDetail = async (row) => {
        const id = row[0];
        const index = mockDetails.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockDetails[index][2] = mockDetails[index][2] === 1 ? 0 : 1;
            row[1] = mockDetails[index][2];
            $scope.toastOk("Detail Flag updated");
        }
    };

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

    ///. Bulk delete
	$scope.deleteSelected = async function (table) {
        if(!confirm("Delete selected items?")) return;

		if (table === "header") {
			await deleteMultipleFlagHeader($scope.checkedIds);
            await initApp();
		} else if (table === "detail") {
			await deleteMultipleFlagDetail($scope.checkedIds);
            const raw = await getFlagDetail($scope.currFlagHeaderId);
            $scope.flagDetailContent = filterData(raw, "detail");
            $scope.$apply();
		} else if (table === "detLang") {
			await deleteMultipleFlagDetailLang($scope.checkedIds);
            const raw = await getFlagDetailLang($scope.currFlagDetailId);
            $scope.flagDetailLangContent = filterData(raw, "detLang");
            $scope.$apply();
		}
		$scope.clearSelection();
	};

	//. PUBLIC/TEMPLATE FUNCTIONS
    ///. HEADER
	$scope.btnAddNewFlagHeader = () => {
        $scope.newDataFlagHeader = [0, 1, 0, 0, "EN", "", "{}", ""]; 
        $scope.showModalFormFlagHeader = true;
        $scope.formFlagHeaderTitle = "Add New Flag Header";
        $scope.btnFormFlagHeaderLabel = "Save";
        $scope.tempData = [];
    };

	$scope.btnEditFlagHeader = (row) => {
        const id = row[0];
        const raw = mockHeaders.find(r => r[0] === id);
        $scope.newDataFlagHeader = [...raw].slice(1);
        
        $scope.formFlagHeaderTitle = "Edit Flag Header";
        $scope.btnFormFlagHeaderLabel = "Update";
        $scope.tempData = raw; 
        $scope.showModalFormFlagHeader = true;
    };

    $scope.submitFormFlagHeader = async () => {
        const formData = $scope.newDataFlagHeader;
        
        if (!formData[5]) { $scope.toastWarn("Description Required"); return; }

        if ($scope.tempData.length === 0) {
            await addFlagHeader(formData); 
        } else {
            const id = $scope.tempData[0];
            await updateFlagHeader([id, ...formData]);
        }

        $scope.showModalFormFlagHeader = false;
        await initApp();
        $scope.toastOk("Saved Successfully");
    };

	$scope.btnShowFlagDetail = async (row) => {
        $scope.currFlagHeaderId = row[0];
        $scope.currFlagHeaderDesc = row[6];
        $scope.pageTitle = `Flag Detail: ${row[6]}`;
        
        $scope.showTableFlagHeader = false;
        $scope.showTableFlagDetail = true;
        $scope.clearSelection();
        
        const raw = await getFlagDetail(row[0]);
        $scope.flagDetailContent = filterData(raw, "detail");
        $scope.$apply();
    };
    
    $scope.deleteFlagHeader = async (id) => {
        if (!confirm("Delete this header?")) return;
        await deleteFlagHeader(id);
        await initApp();
        $scope.toastOk("Deleted.");
    };

	///. DETAIL
	$scope.btnAddNewFlagDetail = () => {
        $scope.newDataFlagDetail = [$scope.currFlagHeaderId, 1, 0, "", ""];
        $scope.formFlagDetailTitle = "Add New Detail";
        $scope.btnFormFlagDetailLabel = "Add";
        $scope.tempData = [];
        $scope.showModalFormFlagDetail = true;
    };

    $scope.btnEditFlagDetail = (row) => {
        const id = row[0];
        const raw = mockDetails.find(r => r[0] === id);
        $scope.newDataFlagDetail = [...raw].slice(1);
        
        $scope.formFlagDetailTitle = "Edit Detail";
        $scope.btnFormFlagDetailLabel = "Update";
        $scope.tempData = raw;
        $scope.showModalFormFlagDetail = true;
    };

    $scope.submitFormFlagDetail = async () => {
        if (!$scope.newDataFlagDetail[3]) { $scope.toastWarn("Description is required!"); return; }

        if ($scope.tempData.length === 0) {
            await addFlagDetail($scope.newDataFlagDetail); 
        } else {
            const id = $scope.tempData[0];
            await updateFlagDetail([id, ...$scope.newDataFlagDetail]);
        }

        $scope.showModalFormFlagDetail = false;
        const raw = await getFlagDetail($scope.currFlagHeaderId);
        $scope.flagDetailContent = filterData(raw, "detail");
        $scope.toastOk("Saved.");
        $scope.$apply();
    };

    $scope.deleteFlagDetail = async (id) => {
        if (!confirm("Delete this detail?")) return;
        await deleteSingleFlagDetail(id);
        const raw = await getFlagDetail($scope.currFlagHeaderId);
        $scope.flagDetailContent = filterData(raw, "detail");
        $scope.toastOk("Deleted.");
        $scope.$apply();
    };

    ///. DETAIL LANG
    $scope.btnShowFlagDetailLang = async (row) => {
        $scope.currFlagDetailId = row[0]; 
        $scope.currFlagDetailDesc = row[3];
        
        $scope.pageTitle = `Flag Detail Language: ${row[3]}`;
        $scope.showTableFlagDetail = false;
        $scope.showTableFlagDetailLang = true;
        $scope.clearSelection();

        const raw = await getFlagDetailLang(row[0]);
        $scope.flagDetailLangContent = filterData(raw, "detLang");
        $scope.$apply();
    };

    $scope.btnAddNewFlagDetailLang = () => {
        $scope.newDataFlagDetailLang = [$scope.currFlagDetailId, "EN", "", ""];
        $scope.formFlagDetailLangTitle = "Add Translation";
        $scope.btnFormFlagDetailLangLabel = "Add";
        $scope.tempData = [];
        $scope.showModalFormFlagDetailLang = true;
    };

    $scope.btnEditFlagDetailLang = (row) => {
        const id = row[0];
        const raw = mockDetailLangs.find(r => r[0] === id);
        $scope.newDataFlagDetailLang = [...raw].slice(1);
        
        $scope.formFlagDetailLangTitle = "Edit Translation";
        $scope.btnFormFlagDetailLangLabel = "Update";
        $scope.tempData = raw;
        $scope.showModalFormFlagDetailLang = true;
    };

    $scope.submitFormFlagDetailLang = async () => {
        if (!$scope.newDataFlagDetailLang[2]) { $scope.toastWarn("Description is required!"); return; }

        if ($scope.tempData.length === 0) {
            await addFlagDetailLang($scope.newDataFlagDetailLang);
        } else {
            const id = $scope.tempData[0];
            await updateFlagDetailLang([id, ...$scope.newDataFlagDetailLang]);
        }

        $scope.showModalFormFlagDetailLang = false;
        const raw = await getFlagDetailLang($scope.currFlagDetailId);
        $scope.flagDetailLangContent = filterData(raw, "detLang");
        $scope.toastOk("Saved.");
        $scope.$apply();
    };

    $scope.deleteFlagDetailLang = async (id) => {
        if (!confirm("Delete this translation?")) return;
        await deleteSingleFlagDetailLang(id);
        const raw = await getFlagDetailLang($scope.currFlagDetailId);
        $scope.flagDetailLangContent = filterData(raw, "detLang");
        $scope.toastOk("Deleted.");
        $scope.$apply();
    };

    $scope.gotoPreviousPage = async () => {
        $scope.clearSelection();
        if ($scope.showTableFlagDetailLang) {
            $scope.showTableFlagDetailLang = false;
            $scope.showTableFlagDetail = true;
            $scope.pageTitle = `Flag Detail: ${$scope.currFlagHeaderDesc}`;
            const raw = await getFlagDetail($scope.currFlagHeaderId);
            $scope.flagDetailContent = filterData(raw, "detail");
        } 
        else if ($scope.showTableFlagDetail) {
            $scope.showTableFlagDetail = false;
            $scope.showTableFlagHeader = true;
            $scope.pageTitle = "Flag Header";
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
        if ($scope.filterMode === 'header') content = $scope.flagHeaderContent;
        else if ($scope.filterMode === 'detail') content = $scope.flagDetailContent;
        else if ($scope.filterMode === 'detLang') content = $scope.flagDetailLangContent;

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
			$scope.rawData = await getFlagHeader();
			$scope.displayData = filterData($scope.rawData, "header");
			$scope.flagHeaderContent = $scope.displayData;
		} catch (err) {
			$scope.toastErr("Failed to load initial data");
			throw err;
		} finally {
			$scope.$applyAsync();
		}
	};

	initApp();
}

cFlag.$inject = ['$scope', '$q', '$timeout'];