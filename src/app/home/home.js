export default function cHome($scope) {
    $scope.refreshData = function() {
        alert('Refreshing data...');
    };
}

cHome.$inject = ['$scope'];