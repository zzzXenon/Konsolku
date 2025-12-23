export default function cOrgChart($scope, $q, $timeout) {
    console.log('load controller cOrgChart');

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

    //. INIT
    $scope.showFormOrgChartHeader = false;
    $scope.showFormOrgChartDetail = false;
    $scope.formOrgChartHeaderTitle = "";
    $scope.formOrgChartDetailTitle = "";
    $scope.btnFormOrgChartHeaderLabel = "";
    $scope.showConfirmModal = false;

    $scope.isLoading = false;
    $scope.chartRoots = [];
    $scope.currOrgId = null;
    $scope.arrOrgId = [];
    $scope.orgSelected = [];
    $scope.newDataHeader = [];
    $scope.newDataDetail = [];
    $scope.arrPersonList = [];
    $scope.targetOrgId = "";
    $scope.actionMode = "";
    
    let mockOrgs = [
        ['org-1', 'asix', 'ASIX', null, null, null, null, 'org-1'],
        ['org-2', 'ipm', 'IPM', null, null, null, null, 'org-2']
    ];

    let mockPersonsSource = [
        ['p1', 'Tian', 'org-1'],
        ['p2', 'Jopang', 'org-1'],
        ['p3', 'Roy', 'org-1'],
        ['p4', 'Fretty', 'org-2'],
        ['p5', 'Gogmazios', 'org-2']
    ];

    let mockHeaders = [
        ['h1', 'CEO', null, 'org-1'],
        ['h2', 'CTO', 'h1', 'org-1'],
        ['h3', 'CFO', 'h1', 'org-1'],
        ['h4', 'PM', 'h3', 'org-1'],
        ['h5', 'Lead Dev', 'h2', 'org-1']
    ];

    let mockDetails = [
        ['d1', 'p1', 'h1'],
        ['d2', 'p2', 'h3'],
        ['d3', 'p3', 'h2'],
        ['d4', 'p4', 'h4']
    ];

    const getOrganization = async () => {
        return new Promise(resolve => $timeout(() => resolve([...mockOrgs]), 200));
    };

    const getOrgPerson = async (organization_id) => {
        return new Promise(resolve => {
            const persons = mockPersonsSource.filter(p => p[2] === organization_id);
            const formatted = persons.map(p => [p[0], p[0], p[1]]);
            $timeout(() => resolve(formatted), 200);
        });
    };

    const getOrgChartHeaderV1 = async (organization_id) => {
        return new Promise(resolve => {
            const roots = mockHeaders.filter(h => h[3] === organization_id && h[2] === null);
            const result = roots.map(h => [h[0], h[1]]); 
            $timeout(() => resolve(result), 300);
        });
    };

    const getOrgChartHeaderV2 = async (organization_id, parent_id) => {
        return new Promise(resolve => {
            const children = mockHeaders.filter(h => h[3] === organization_id && h[2] === parent_id);
            const result = children.map(h => [h[0], h[1]]);
            $timeout(() => resolve(result), 300);
        });
    };

    const insertOrgChartHeader = async (data) => {
        return new Promise(resolve => {
            const newId = 'h-' + Math.floor(Math.random() * 10000);
            mockHeaders.push([newId, data[1], data[2], data[0]]);
            $timeout(() => resolve(true), 200);
        });
    };

    const updateOrgChartHeader = async (data) => {
        return new Promise(resolve => {
            const index = mockHeaders.findIndex(h => h[0] === data[0]);
            if (index !== -1) {
                mockHeaders[index][1] = data[2];
            }
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteOrgChartHeader = async (id) => {
        return new Promise(resolve => {
            mockHeaders = mockHeaders.filter(h => h[0] !== id && h[2] !== id); 
            $timeout(() => resolve(true), 200);
        });
    };

    const getOrgChartDetail = async (org_chart_header_id) => {
        return new Promise(resolve => {
            const details = mockDetails.filter(d => d[2] === org_chart_header_id);
            const result = details.map(d => {
                const person = mockPersonsSource.find(p => p[0] === d[1]);
                return [d[0], d[1], person ? person[1] : 'Unknown'];
            });
            $timeout(() => resolve(result), 200);
        });
    };

    const insertOrgChartDetail = async (data) => {
        return new Promise(resolve => {
            const newId = 'd-' + Math.floor(Math.random() * 10000);
            mockDetails.push([newId, data[1], data[0]]);
            $timeout(() => resolve(true), 200);
        });
    };

    const deleteOrgChartDetail = async (id) => {
        return new Promise(resolve => {
            mockDetails = mockDetails.filter(d => d[0] !== id);
            $timeout(() => resolve(true), 200);
        });
    };

    const actionOpts = Object.freeze({
        ADD: 0,
        EDIT: 1
    });

    //. PRIVATE FUNCTIONS
    $scope.confirmAction = (message) => {
        const deferred = $q.defer();
        $scope.showConfirmModal = true;
        $scope.confirmMessage = message;

        $scope.onConfirm = () => {
            $scope.showConfirmModal = false;
            deferred.resolve(true);
        };

        $scope.onCancel = () => {
            $scope.showConfirmModal = false;
            deferred.resolve(false);
        };

        return deferred.promise;
    };

    const filterData = (rawData, option) => {
        try {
            let indexToKeep = [];
            switch (option) {
                case 0:
                    $scope.filterMode = 0;
                    indexToKeep = [0, 2];
                    break;
                default: break;
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
            console.log("Error on filterData:", err);
            throw err;
        }
    };

    const getPersonIdList = (detail) => {
        let arrPersonId = [];
        if(detail) {
            detail.forEach((item) => {
                arrPersonId.push(item.person_id)
            });
        }
        return arrPersonId;
    }

    const transformHeader = (row) => {
        return {
            id: row[0],
            desc: row[1],
            children: [],
            detail: null,
            detailLoaded: false,
            isRoot: false,
            showHeaderMenu: false,
            showDetailMenu: false
        };
    }

    const transformDetail = (row) => {
        return {
            id: row[0],
            person_id: row[1], 
            fullname: row[2]
        };
    }

    // Sequential queue
    function processQueueInOrder(nodes) {
        var chain = $q.when();
        nodes.forEach(function(node) {
            chain = chain.then(function() {
                return traverseDFS(node);
            });
        });
        return chain;
    }

    // Node worker
    function traverseDFS(node) {
        var deferred = $q.defer();

        var promDetail = $q.when(getOrgChartDetail(node.id));
        var promChildren = $q.when(getOrgChartHeaderV2($scope.currOrgId, node.id));

        $q.all([promDetail, promChildren]).then(function(results) {
            var detailRows = results[0]; 
            
            if (Array.isArray(detailRows) && detailRows.length > 0) {
                node.detail = detailRows.map(transformDetail);
            } else {
                node.detail = [];
            }
            node.detailLoaded = true;

            var childrenRows = results[1];
            if (Array.isArray(childrenRows) && childrenRows.length > 0) {
                node.children = childrenRows.map(transformHeader);
                processQueueInOrder(node.children).then(function() {
                    deferred.resolve(); 
                });
            } else {
                deferred.resolve();
            }
        }).catch(function(err) {
            console.error("Error processing node " + node.id, err);
            deferred.resolve(); 
        });

        return deferred.promise;
    }

    //. PUBLIC FUNCTIONS
    $scope.showOrgChart = function(id) {
        if (!id) return;
        
        $scope.currOrgId = id;
        $scope.chartRoots = [];
        $scope.isLoading = true;

        try {
            $q.when(getOrgChartHeaderV1($scope.currOrgId))
            .then(function(rootRows) {
                
                var roots = (rootRows || []).map(function(row) {
                    var node = transformHeader(row);
                    node.isRoot = true;
                    return node;
                });
                
                $scope.chartRoots = roots;

                if (roots.length === 0) {
                    $scope.isLoading = false;
                    return;
                }

                processQueueInOrder(roots).then(function() {
                    $scope.isLoading = false;
                    $scope.toastOk("Chart complete.");
                });

            });
        } catch (err) {
            console.error("Root fetch error:", err);
            $scope.isLoading = false;
            $scope.toastErr("Error when fetching data.")
        }
    };

    ///. ACTIONS
    $scope.btnAddRoot = () => {
        $scope.formOrgChartHeaderTitle = "Add a New Root Node";
        $scope.btnFormOrgChartHeaderLabel = "Add Node";
        $scope.actionMode = actionOpts.ADD;
        $scope.newDataHeader = [null, "", null]; 
        $scope.showFormOrgChartHeader = true;
    };
    
    $scope.btnAddChildNode = (node) => {
        $scope.formOrgChartHeaderTitle = "Add a New Branch Node to " + node.desc;
        $scope.btnFormOrgChartHeaderLabel = "Add Node";
        $scope.actionMode = actionOpts.ADD;
        $scope.newDataHeader = [null, "", node.id];
        $scope.showFormOrgChartHeader = true;
    };
    
    $scope.btnUpdateHeader = (node) => {
        $scope.formOrgChartHeaderTitle = "Edit Node";
        $scope.btnFormOrgChartHeaderLabel = "Update Node";
        $scope.actionMode = actionOpts.EDIT;
        $scope.newDataHeader = [node.id, node.desc, null]; 
        $scope.showFormOrgChartHeader = true;
    };

    $scope.btnDeleteHeader = async(node) => { 
        node.showHeaderMenu = false;
        const message = (!node.children || node.children.length > 0) 
            ? "Are you sure you want to delete this node? This will also delete its branches!" 
            : "Are you sure you want to delete this node?";
        const isConfirmed = await $scope.confirmAction(message);

        if (isConfirmed) {
            try {
                await deleteOrgChartHeader(node.id);
                $scope.showOrgChart($scope.currOrgId);
                $scope.$apply();
            } catch (err) {
                $scope.toastErr("Failed to delete header.");
            }
        }
    };
    
    $scope.submitFormOrgChartHeader = function() {
        var payload = $scope.newDataHeader;
        
        if(!payload[1]) { 
            alert("Description is required"); 
            return; 
        }

        if ($scope.actionMode === actionOpts.ADD) {
            var insertData = [
                $scope.currOrgId,
                payload[1],
                payload[2]
            ];
            
            try {
                insertOrgChartHeader(insertData).then(function() {
                    $scope.showFormOrgChartHeader = false;
                    $scope.showOrgChart($scope.currOrgId);
                });
            } catch (err) {
                $scope.toastErr("Failed to add header");
            }
        } else {
            var updateData = [
                payload[0],
                $scope.currOrgId,
                payload[1],
                payload[2]
            ];

            try {
                updateOrgChartHeader(updateData).then(function() {
                    $scope.showFormOrgChartHeader = false;
                    $scope.showOrgChart($scope.currOrgId);
                });
            } catch (err) {
                $scope.toastErr("Failed to update header");
            }
        }
    };

    $scope.btnAddDetail = async function(node) {
        $scope.formOrgChartDetailTitle = "Assign Person to " + node.desc;
        $scope.btnFormOrgChartHeaderLabel = "Add Person";
        $scope.newDataDetail = [node.id, ""]; 
        $scope.currNode = node

        try {
            var people = await getOrgPerson($scope.currOrgId);
            $scope.arrPersonList = people || [];
            $scope.showFormOrgChartDetail = true;
            $scope.$apply();
        } catch (err) {
            console.error("Error loading person list:", err);
        }
    };

    $scope.submitFormOrgChartDetail = async function() {
        var payload = $scope.newDataDetail;

        if (!payload[1]) {
            $scope.toastWarn("Please select a person.")
            return;
        }

        const arrPersonId = getPersonIdList($scope.currNode.detail);
        for (const id of arrPersonId) {
            if (payload[1] === id) {
                $scope.toastWarn("Person already has that position.")
                return;
            }
        }

        try {
            var insertData = [
                payload[0],
                payload[1]
            ];

            await insertOrgChartDetail(insertData);
            
            $scope.showFormOrgChartDetail = false;
            $scope.showOrgChart($scope.currOrgId);
            $scope.$apply();

        } catch (err) {
            $scope.toastErr("Failed to add detail.");
        }
    };

    $scope.btnDeleteDetail = async(node, person) => {
        node.showHeaderMenu = false;
        
        const isConfirmed = await $scope.confirmAction(
            "Remove " + person.fullname + " from this position?"
        );

        if (isConfirmed) {
            try {
                await deleteOrgChartDetail(person.id);
                $scope.showOrgChart($scope.currOrgId);
                $scope.$apply();
            } catch (err) {
                $scope.toastErr("Failed to delete header.");
            }
        }
    };

    //. INIT APP
    const initApp = async () => {
        try {
            $scope.rawData = await getOrganization();
            $scope.arrOrganization = filterData($scope.rawData, 0);
        } catch (err) {
            $scope.toastErr("Failed to load initial data");
            throw err;
        } finally {
            $scope.$apply();
        }
    };

    initApp();
}

cOrgChart.$inject = ['$scope', '$q', '$timeout'];