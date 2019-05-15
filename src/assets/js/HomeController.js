var HomeControllers = angular.module('HomeControllers', []);

HomeControllers.controller('HomeController' ,function($scope,$http,$rootScope, $routeParams,$window,modal) {
		
	$scope.params = $routeParams;
	$scope.show = $scope.params.show;		
	
	$scope.itemAdjustments=false;
	$scope.cycleCount=false;
	$scope.damaged=false;
	$scope.handBill=false;
	$scope.home=false;
	$scope.contactUshow = false;
	$scope.AboutUs = false;

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
	
	if (modal.UserDetails == null || modal.UserDetails == undefined || modal.UserDetails == ''){
		$scope.getUserDetails();
	}
	
	
	$scope.getUserAuth = function(){
		
		$http({	
			method: 'GET',
			url: './services/security/getUserAuthorization'})
			.then(function(response) {
				$scope.uauth = response.data;
				});			
	};	
	
	if ($scope.uauth == null || $scope.uauth == undefined || $scope.uauth == ''){
		$scope.getUserAuth();
	} 
	
	
	if ($scope.show === 'itemAdjustments'){
		$scope.itemAdjustments=true;
		$scope.cycleCount=false;
		$scope.damagedCredit=false;
		$scope.handBill=false;
		$scope.home=false;
		$scope.contactUshow = false;
		$scope.AboutUs = false;
	} else {
	if ($scope.show === 'cycleCount'){
		$scope.itemAdjustments=false;
		$scope.cycleCount=false;
		$scope.damagedCredit=false;
		$scope.handBill=false;
		$scope.home=false;
		$scope.contactUshow = false;
		$scope.AboutUs = false;
	} else {
	if ($scope.show === 'damagedCredit'){
		$scope.itemAdjustments=false;
		$scope.cycleCount=false;
		$scope.damagedCredit=true;
		$scope.handBill=false;
		$scope.home=false;
		$scope.contactUshow = false;
		$scope.AboutUs = false;
	} else {
	if ($scope.show === 'handBill'){
		$scope.itemAdjustments=false;
		$scope.cycleCount=false;
		$scope.damagedCredit=false;
		$scope.handBill=true;
		$scope.home=false;
		$scope.contactUshow = false;
		$scope.AboutUs = false;
	} else {
	if ($scope.show === 'ContactUs'){
		$scope.itemAdjustments=false;
		$scope.cycleCount=false;
		$scope.damagedCredit=false;
		$scope.handBill=false;
		$scope.home=false;
		$scope.contactUshow = true;
		$scope.AboutUs = false;
	} else {
	if ($scope.show === 'AboutUs'){
		$scope.itemAdjustments=false;
		$scope.cycleCount=false;
		$scope.damagedCredit=false;
		$scope.handBill=false;
		$scope.home=false;
		$scope.contactUshow = false;
		$scope.AboutUs = true;
	} else {
	$scope.itemAdjustments=false;
	$scope.cycleCount=false;
	$scope.damagedCredit=false;
	$scope.handBill=false;
	$scope.home=true;
	$scope.contactUshow = false;
	$scope.AboutUs = false;
	}}}}}}

			
	$scope.serverErrorHide = true;
	
	$scope.toggleMenu = function(){
		if ($scope.openedMenu === false){
			$scope.openedMenu=true;
			$scope.closedMenu=false;
		}else{
			$scope.openedMenu=false;
			$scope.closedMenu=true;
		}
	}
	
	
	$scope.openedMenu=true;
	$scope.closedMenu=false;
		
});
