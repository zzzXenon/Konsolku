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
        [1, 0, 1, 1, 'EN', 'Gender', {}, null],
        [2, 1, 2, 0, 'EN', 'User Status', {}, null]
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
    $scope.flagSliderLabel = "Active";
    
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
            mockHeaders = mockHeaders.filter(row => !ids.includes(row[0]));
            $timeout(() => resolve(true), 200);
        });
    };
	
	///. DETAIL
	const getEnumDetail = async (headerId) => {
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

	const filterData = (rawData, option) => {
        try {
            let indexToKeep = [];
            switch (option) {
                case "header":
                    $scope.filterMode = 'header';
                    indexToKeep = [0, 1, 2, 3, 4, 5]; 
                    break;
                case "detail":
                    $scope.filterMode = 'detail';
                    indexToKeep = [0, 2, 3, 4, 5];
                    break;
				case "detailLang":
					$scope.filterMode = 'detailLang';
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

    // Update Slider Label Logic for Modal
    $scope.$watch('newDataEnumDetail[2]', function(newVal) {
        if (newVal === 1) $scope.flagSliderLabel = "Active";
        else $scope.flagSliderLabel = "Inactive";
    });

	$scope.liveUpdateFlagInHeader = async (row) => {
        const id = row[0];
        const index = mockHeaders.findIndex(r => r[0] === id);
        if(index !== -1) {
            mockHeaders[index][3] = mockHeaders[index][3] === 1 ? 0 : 1;
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
            row[1] = mockDetails[index][2];
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

    window.addEventListener('click', () => {
        if ($scope.activeMenuId !== null) {
            $scope.activeMenuId = null;
            $scope.$apply();
        }
    });

	$scope.confirmAction = (message) => {
		const deferred = $q.defer();
        
        $timeout(() => {
            $scope.confirmModal = true;
            $scope.confirmMessage = message;
        });

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
        let message = "";
        const count = $scope.checkedIds.length;

        if (count === 0) return;

        if (table === "header") {
            message = count > 1 
                ? "Are you sure you want to delete these enum headers?" 
                : "Are you sure you want to delete this enum header?";
        } else if (table === "detail") {
            message = count > 1 
                ? "Are you sure you want to delete these enum details?" 
                : "Are you sure you want to delete this enum detail?";
        } else if (table === "detailLang") {
            message = count > 1 
                ? "Are you sure you want to delete these enum detail languages?" 
                : "Are you sure you want to delete this enum detail language?";
        }

        const isConfirmed = await $scope.confirmAction(message);
        if (!isConfirmed) return;

		if (table === "header") {
			await deleteMultipleEnumHeader($scope.checkedIds);
            await initApp();
            $scope.toastOk(count > 1 ? "Enum headers deleted." : "Enum header deleted.");
		} else if (table === "detail") {
			await deleteMultipleEnumDetail($scope.checkedIds);
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
            $scope.toastOk(count > 1 ? "Enum details deleted." : "Enum detail deleted.");
            $scope.$apply();
		} else if (table === "detailLang") {
			await deleteMultipleEnumDetailLang($scope.checkedIds);
            const raw = await getEnumDetailLang($scope.currEnumDetailId);
            $scope.enumDetailLangContent = filterData(raw, "detailLang");
            $scope.toastOk(count > 1 ? "Enum detail languages deleted." : "Enum detail language deleted.");
            $scope.$apply();
		}
		$scope.clearSelection();
	};

	//. PUBLIC/TEMPLATE FUNCTIONS
	///. ENUM HEADER
	$scope.btnAddNewEnumHeader = () => {
        $scope.newDataEnumHeader = [0, 1, 1, 'EN', null, null, null]; 
        $scope.showModalFormEnumHeader = true;
        $scope.formEnumHeaderTitle = "Add New Enum";
        $scope.btnEnumHeaderLabel = "Save";
        $scope.tempData = [];
    };

	$scope.btnEditEnumHeader = (row) => {
        const id = row[0];
        const raw = mockHeaders.find(r => r[0] === id);
        $scope.newDataEnumHeader = [...raw];
        $scope.formEnumHeaderTitle = "Edit Header";
        $scope.btnEnumHeaderLabel = "Update";
        $scope.tempData = raw;
        $scope.showModalFormEnumHeader = true;
    };

    $scope.submitFormEnumHeader = async () => {
        const formData = $scope.newDataEnumHeader;
        if (!formData[5]) { $scope.toastWarn("Description Required"); return; }

        if ($scope.tempData.length === 0) {
            await addEnumHeader(formData.slice(1)); 
        } else {
            await updateEnumHeader(formData);
        }

        $scope.showModalFormEnumHeader = false;
        await initApp();
        $scope.toastOk("Saved Successfully");
    };

    $scope.btnDeleteEnumHeader = async (id) => {
        const isConfirmed = await $scope.confirmAction("Are you sure you want to delete this header?");
        if (isConfirmed) {
            await deleteEnumHeader(id);
            await initApp();
            $scope.toastOk("Header deleted.");
        }
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
        // [ID, HeaderID, Flag, Seq, Code, Desc, Unused]
        $scope.newDataEnumDetail = [0, $scope.currEnumHeaderId, 1, 0, "", "", null];
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
        if (!$scope.newDataEnumDetail[4]) { $scope.toastWarn("Code is required!"); return; }
        if (!$scope.newDataEnumDetail[5]) { $scope.toastWarn("Description is required!"); return; }

        try {
            if ($scope.tempData.length === 0) {
                await addEnumDetail($scope.newDataEnumDetail.slice(1)); 
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
        const isConfirmed = await $scope.confirmAction("Are you sure you want to delete this detail?");
        if (isConfirmed) {
            await deleteSingleEnumDetail(id);
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
            $scope.toastOk("Detail deleted.");
            $scope.$apply();
        }
    };

    ///. ENUM DETAIL LANG
    $scope.btnShowEnumDetailLang = async (row) => {
        $scope.currEnumDetailId = row[0];
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
        // [ID, DetailID, LangCode, Description]
        // Initialize with ID=0 to prevent index shifting on ADD
        $scope.newDataEnumDetailLang = [0, $scope.currEnumDetailId, "EN", ""];
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
        // Bindings: [2]=LangCode, [3]=Description
        if (!$scope.newDataEnumDetailLang[3]) { $scope.toastWarn("Description is required!"); return; }

        try {
            if ($scope.tempData.length === 0) {
                // Remove placeholder ID (Index 0) before adding
                await addEnumDetailLang($scope.newDataEnumDetailLang.slice(1));
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
        const isConfirmed = await $scope.confirmAction("Delete this translation?");
        if (isConfirmed) {
            await deleteSingleEnumDetailLang(id);
            const raw = await getEnumDetailLang($scope.currEnumDetailId);
            $scope.enumDetailLangContent = filterData(raw, "detailLang");
            $scope.toastOk("Translation deleted.");
            $scope.$apply();
        }
    };

    // --- NAVIGATION & UTILS ---
    $scope.gotoPreviousPage = async () => {
        $scope.clearSelection();
        if ($scope.showTableEnumDetailLang) {
            $scope.showTableEnumDetailLang = false;
            $scope.showTableEnumDetail = true;
            $scope.pageTitle = `Enum Detail: ${$scope.currEnumHeaderDesc}`;
            const raw = await getEnumDetail($scope.currEnumHeaderId);
            $scope.enumDetailContent = filterData(raw, "detail");
        } 
        else if ($scope.showTableEnumDetail) {
            $scope.showTableEnumDetail = false;
            $scope.showTableEnumHeader = true;
            $scope.pageTitle = "Enum Header";
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