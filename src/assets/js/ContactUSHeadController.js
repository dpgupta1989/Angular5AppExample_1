var ContactUSHeadController = angular.module('ContactUSHeadController', []);

ContactUSHeadController.controller('ContactUSController' ,function($scope,$http,$rootScope, $routeParams,$mdDialog,modal){
	
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
		&& $scope.show === 'ContactUs' ){
		$scope.getUserDetails();
	}
	
	$scope.params = $routeParams;
	$scope.show = $scope.params.show;	
	
	$scope.salesId = modal.UserDetails.salesId;
	$rootScope.$broadcast('username-update',modal.UserDetails.userName);
	
	$scope.submitDisabled = false;
	
	$scope.feedbackMessageChange = function(){

		if($scope.feedbackMessage != null && $scope.feedbackMessage != ''){
			if($scope.userEmail != null && $scope.userEmail != ''){					
				$scope.submitDisabled = false;
			} else {
				$scope.submitDisabled = true;
			}
		} else{
			$scope.submitDisabled = true;
		}
		
	};
	
	$scope.emailChange = function(){
		if($scope.userEmail != null && $scope.userEmail != ''){	
			if($scope.feedbackMessage != null && $scope.feedbackMessage != ' '){			
				$scope.submitDisabled = false;
			} else {
				$scope.submitDisabled = true;
			}
		} else {
			$scope.submitDisabled = true;
		}
		
	};
	
	$scope.getUserEmail = function(){
		
		var UserEmailRequest = {};
		UserEmailRequest.salesId = $scope.salesId ;
		
			$http({
				method: 'POST',
				url: './services/contactUs/getUserEmail',
				data: UserEmailRequest
			}).then(
				function(UserEmailResponse) {

					$scope.UserEmailResponse = UserEmailResponse.data;
					$scope.userEmail = $scope.UserEmailResponse.userEmail;			
					if($scope.userEmail != null && $scope.userEmail != ''){						
						$scope.emailTextBoxDisabled = true;
					} else {
						console.log("user email retrieved from the server is empty");
						$scope.emailTextBoxDisabled = false;
					}
				});					
	};
	
	
	$scope.result = function(comments,ev) {
		    
		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title(comments)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('OK!')
		        .targetEvent(ev)
		    );
		    if($scope.sendEmailResponse.emailContactStatus != null && $scope.sendEmailResponse.emailContactStatus === "0"){
		    	$scope.feedbackMessage = null;
		    	$scope.submitDisabled = true;

		    } 
	};
	
	$scope.submit = function(){
		
		var sendEmailRequest = {};
		sendEmailRequest.userEmail = $scope.userEmail;
		sendEmailRequest.userMsg =  $scope.feedbackMessage;
				
		$http({
			method: 'POST',
			url: './services/contactUs/sendEmail',
			data: sendEmailRequest
		}).then(
				function(sendEmailResponse) {

					$scope.sendEmailResponse = sendEmailResponse.data;
					if($scope.sendEmailResponse != null &&  $scope.sendEmailResponse.emailContactStatusMessage != null){
					    $scope.result($scope.sendEmailResponse.emailContactStatusMessage);
					    $scope.serverErrorHide = true;
					} else{
						$scope.serverErrorHide = false;
					}					
				});
	};
	
	$scope.submitDisabled = true;
	$scope.emailTextBoxDisabled = false;
	
	if($scope.show === 'ContactUs'){
		$scope.getUserEmail();
	}
});