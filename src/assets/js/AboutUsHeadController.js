var AboutUsHeadController = angular.module('AboutUsHeadController', []);

AboutUsHeadController.controller('AboutUsController' ,function($scope,$http,$rootScope, $routeParams,$mdDialog,modal){
	
$scope.getUserDetails = function(){
		
		$http({	
			method: 'GET',
			url: './services/security/getUserDetails'}).then(
				function(HomePageUserDetailsResponse) {

					$scope.HomePageUserDetailsResponse = HomePageUserDetailsResponse.data;
					if($scope.HomePageUserDetailsResponse != null && $scope.HomePageUserDetailsResponse.HomePageUserDetails != null && 
							$scope.HomePageUserDetailsResponse.HomePageUserDetails.userDetails != null){
						$scope.userName=$scope.HomePageUserDetailsResponse.HomePageUserDetails.userDetails.userName
						modal.UserDetails = $scope.HomePageUserDetailsResponse.HomePageUserDetails.userDetails; 
						$rootScope.$broadcast('username-update',modal.UserDetails.userName);
						console.log("%cLogged in UserName is " + modal.UserDetails.userName + " userid is " + modal.UserDetails.userId,'color:#0000FF ');
						
					} 
				});					
	};	
	
	if (modal.UserDetails === null || modal.UserDetails === undefined || modal.UserDetails === ''
		&& $scope.show === 'AboutUs'){
		$scope.getUserDetails();
	}
		

	
	
	$scope.params = $routeParams;
	$scope.show = $scope.params.show;	
		
	$scope.getAboutInfo = function(){
		
		$http({
			method: 'GET',
			url: './services/about/getAboutInfo'
		}).then(
			function(AboutResponse) {

				$scope.AboutResponse = AboutResponse.data.About;
				if($scope.AboutResponse != null){
					$scope.serverErrorHide = true;
				} else {
					$scope.serverErrorHide = false;	
				}
			});					
	};
	
	$scope.serverErrorHide = true;
	
	if($scope.show === 'AboutUs'){
		$scope.getAboutInfo();
	}
	
	$scope.username = modal.UserDetails.userName;
	$scope.userId = modal.UserDetails.userId;
	$scope.salesId = modal.UserDetails.salesId;
	
});