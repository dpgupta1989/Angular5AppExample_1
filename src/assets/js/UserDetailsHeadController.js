var UserDetailsHeadController = angular.module('UserDetailsHeadController', []);

UserDetailsHeadController.controller('UserDetailsController' ,function($scope,$window) {
			
	$scope.$on('username-update', function(event, args) {
		$scope.userName = args;

	});

	$scope.logoff = function(){
		$window.close();
	};
});
