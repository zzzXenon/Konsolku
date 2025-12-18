export default function cHome($scope) {
    // 1. Data Logic
    $scope.stats = {
        users: 150,
        revenue: '$12,000',
        active: true
    };

    // 2. Action Logic (Button clicks, etc)
    $scope.refreshData = function() {
        alert('Refreshing data for Dashboard...');
        $scope.stats.users += 1; // Simulate an update
    };
}

// CRITICAL: Protect against minification!
// This tells Angular exactly what to inject, even if variables get renamed.
cHome.$inject = ['$scope'];