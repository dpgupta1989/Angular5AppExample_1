var ReportControllers = angular.module('ReportHEADController', []);


ReportControllers.directive('upldtpicker', function() {
	return {
		restrict: 'A',
		required: 'ngModel',
		link: function (scope, element, attrs, ReportController) {
			element.datepicker({
				dateFormat: 'mm-dd-yy',
				changeMonth: true,
				changeYear: true,
				onSelect: function (date) {
					scope.uploadDate = date;
					scope.$apply(scope.validateForm());
				}
			});
		}
	};
});

ReportControllers.controller('ReportController' ,function($scope,$http,$rootScope,$mdDialog,$routeParams,$interval,$filter,modal) {
				
	

	
//	$scope.loadLocStratScreen = function(){
//		
//		$scope.loadUserAuthentication().then(function(userAuthResponse) {
            // promise fulfilled
	
			if(modal.UserDetails != null && modal.UserDetails.userName != null ){
				$rootScope.$broadcast('username-update',modal.UserDetails.userName);
			} else{
				$scope.getUserDetails();
				$rootScope.$broadcast('username-update',modal.UserDetails.userName);
			}
	          

//            if (userAuthResponse != null) {
//            	$scope.userAuthResponse = userAuthResponse.data ;
//				$scope.userAuth = $scope.userAuthResponse.UserAuth;
//				
//			    $scope.userAnyAccessState = $scope.userAuth.userAnyAccessState;
//				
//				$scope.userViewAccessState = $scope.userAuth.userViewAccessState;
//				$scope.userViewAccessMessage = $scope.userAuth.userViewAccessMessage;
//				console.log("$scope.userViewAccessState is " + $scope.userViewAccessState);
//				console.log("$scope.userAnyAccessState is " + $scope.userAnyAccessState);
//						
//				$scope.userEditAccessState = $scope.userAuth.userEditAccessState;
//				$scope.userDeleteAccessState = $scope.userAuth.userDeleteAccessState;	
//				$scope.userAddAccessState = $scope.userAuth.userAddAccessState;
//		
//				if($scope.userAnyAccessState)
//				{ 
					
//					if($scope.userViewAccessState)
//					{ 
//						$scope.userAuthorised = true;
//						$scope.getLocationType();
//						
//					} else {
//						$scope.userAuthorised = false;
//						$scope.authMessage = $scope.userViewAccessMessage ;
//					}
//	
//					
//                } else {
//                	console.log("User doesnt have any acess");
//					$scope.userAuthorised = false;
//                	$scope.authMessage = $scope.userViewAccessMessage ;
//                }
//				console.log("Logged in UserName is " + modal.UserDetails.userName + " userid is " + modal.UserDetails.userId + 
//						" userViewAccessState is " + $scope.userViewAccessState);				       					
//            
//        }, function(error) {
//            // promise rejected;
//            console.log("promise rejected");
//			  $scope.userAuthorised = false;
//            $scope.authMessage = $scope.staticServerErrorMessage; 
//        });
//	};
//	
//	$scope.loadUserAuthentication = function(){
//		console.log("inside loadUserAuthentication ");
//		return $http({	
//			method: 'GET',
//			url: './services/locationStratification/getLocationStratificationUserAuthorization'}).then(
//				function(userAuthResponse) {
//	            	console.log("response from location auth is " + JSON.stringify(userAuthResponse) );
//					return userAuthResponse;
//		});			
//		
//	};

   $scope.getUserDetails = function(){
	
	 $http({	
		method: 'GET',
		url: './services/home/getUserDetails'}).then(
			function(HomePageUserDetailsResponse) {

				$scope.HomePageUserDetailsResponse = HomePageUserDetailsResponse.data;
				if($scope.HomePageUserDetailsResponse != null && $scope.HomePageUserDetailsResponse.HomePageUserDetails != null && 
						$scope.HomePageUserDetailsResponse.HomePageUserDetails.userDetails != null){
					modal.UserDetails = $scope.HomePageUserDetailsResponse.HomePageUserDetails.userDetails; 
					$rootScope.$broadcast('username-update',modal.UserDetails.userName);
					$scope.serverErrorHide = true;
					console.log("%cLogged in UserName in Location Stratification Page is " + modal.UserDetails.userName + " userid is " + modal.UserDetails.userId,'color:#0000FF ');
					$scope.loadUserNames();
				} else {
					$scope.serverErrorHide = false;
				}
			});					
	};	
	
	
	

	
	$scope.clear = function(){
		

	};
	

    
    
    $scope.show = false;
    $scope.params = $routeParams;
	$scope.show = $scope.params.show;	
	   	
	$scope.userAnyAccessState = true; 
	$scope.userAnyAccessMessage = true;
	$scope.userViewAccessState = true;
	$scope.userViewAccessMessage = true;
	
	$scope.userEditAccessState = true;
	$scope.userDeleteAccessState = true;	
	$scope.userAddAccessState = true;
	

	$scope.staticServerErrorMessage = 'The application has experienced a technical issue. Please logoff and re-launch the application. ';
	$scope.dynamicServerErrorMessage = '';
	$scope.serverErrorMessage = null;
	$scope.noSearchDataAvailable = false;						
	$scope.userAuthorised = true;

	$scope.SearchGrid = {
		    enableRowSelection: false,
		    enableSelectAll: false,
			enableSorting: true,
			paginationPageSizes: [100],
		    paginationPageSize: 100,
		    showGridFooter:true,
			enableColumnMenus: false,		
			isRowSelectable: function(row) {
				
				//if($scope.userEditAccessState || $scope.userDeleteAccessState)
				//{
		        	return true;
				//} else{
				//	return false;
				//}	          
		          
			},			
			columnDefs: [			
			  { field: 'locationTypeDescription',
				displayName: 'Batch ID'
			  },
			  { field: 'productGroup',
				displayName: 'Downloaded By'
			  },
			  { 
				field: 'defaultIndicator',
				displayName: 'Report Type',
			  },			  
			  { field: 'Download Date',
				displayName: 'Download Date'		
			  },
			  { field: 'Total Records',
				displayName: 'Total Records'
			  },
			  { field: 'Records Downloaded',
				displayName: 'Records Downloaded'
			  },
			  { field: 'Request Status',
				displayName: 'Request Status'
			  },
			  { field: 'Export',
				displayName: 'Export'
			  }
			],
			 data: 'serviceLevelSearchResponseData'
	};	
    
	$scope.setForecastSalesCode = function(forecastSalesTypeCode,ev) {	
		
		if(forecastSalesTypeCode === 'B'){
			return "Both";
		} else {
			if(forecastSalesTypeCode === 'D'){
				return "Dollars";
			} else{
				if(forecastSalesTypeCode === 'U')
				{
					return "Units";
				}
			}
		}	
	};


	
	$scope.SearchGrid.multiSelect = true;
	
	$scope.SearchGrid.onRegisterApi = function(gridApi,grid){
	
	  $scope.gridApi = gridApi;

	  $scope.SearchGrid = gridApi.grid;
	  $scope.SearchGrid.selection.selectedCount = 0;
	  $scope.SearchGrid.selection.selectAll = false;
	  
      gridApi.selection.on.rowSelectionChanged($scope,function(row){

    	  var grid = $scope.SearchGrid;

    	  var selectedRow = row.entity;
		  var selectedlocationTypeCode = selectedRow.locationTypeNumber;
	      var selectedlocationSubTypeCode = selectedRow.locationSubTypeNumber;
	      var selectedproductGroup = selectedRow.productGroup;
	      
	      var LocationStratRow = {}; 
	      
	      for(i=0;i<$scope.serviceLevelSearchResponseData.length;i++){				
				if( ($scope.serviceLevelSearchResponseData[i].locationTypeNumber === selectedlocationTypeCode) &&
					($scope.serviceLevelSearchResponseData[i].locationSubTypeNumber === selectedlocationSubTypeCode) &&
					($scope.serviceLevelSearchResponseData[i].productGroup === selectedproductGroup))
				{
					LocationStratRow = $scope.serviceLevelSearchResponseData[i];	
					break;
				}				
			};
			
		  
      });
	 
      
      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
    	var grid = $scope.SearchGrid;

		if(!grid.selection.selectAll){
			$scope.LocationStratRowsSelected = [];
			$scope.LocationStratRowsSelected = $scope.serviceLevelSearchResponseData;
			 $scope.showDeleteButton = true;
			 $scope.showEditButton = false;

		} else {
			$scope.LocationStratRowsSelected = [];
			$scope.showEditButton = false;
			$scope.showDeleteButton = false;
		}
		
      });
	 	 
	};
	
//	
//------------------------------------------------------------		
//
	
	 $scope.Go = function(){
		 
		 if ($scope.SearchReport === true){
			 searchOptions = {};
			 searchOptions.Type = $scope.reportTypeSelectedOption.reportTypeTxt;
			 searchOptions.UserName = $scope.selectedUserName.Name;
			 searchOptions.DownloadDate = $scope.uploadDate;
			 
			 console.log(searchOptions);
			 
			 //Call Search Service here:
			 
			 //enable grid
			 //if logic here:
			 $scope.showSearchGrid= true;
			   
		 }else if ($scope.DownloadReport === true){
			 downloadOptions = {};
			 downloadOptions.Type = $scope.reportTypeSelectedOption.reportTypeTxt;
			 downloadOptions.UserName = $scope.selectedUserName.Name;
			 downloadOptions.DownloadDate = $scope.uploadDate;
			 downloadOptions.Duration = $scope.durationSelectedOption.durationTxt;
			
			 console.log(downloadOptions);
			 
			//Call Download Service here:
			 
			 $scope.showSearchGrid= true;
			 
		 }
	 }
	 
	 $scope.initReportPage = function(){
		 $scope.action = {type: 'search'};
		 $scope.Search();
	 }
	
	$scope.Search = function(){
		 $scope.SearchReport  = true;
		 $scope.DownloadReport = false;
		 $scope.validateForm();
		 
    };
    
    $scope.Download = function(){
		 $scope.SearchReport = false;
		 $scope.DownloadReport = true;
		 $scope.validateForm();
   };
    
		$scope.loadDuration = function(){
		   	
   			var durationOption = {};
   			durationOption.durationTxt = "1 Week";
   	
   			$scope.durationArray.push(durationOption);
   	
   			durationOption = {};
   			durationOption.durationTxt = "1 Month";
   	
   			$scope.durationArray.push(durationOption);
   			
   		};
   		
  		$scope.loadUserNames = function(){
  			
   			var userNameOption = {};
   			userNameOption.Name = modal.UserDetails.userName;
   			$scope.userNameArray.push(userNameOption);
   			
   			$scope.selectedUserName = modal.UserDetails.userName;
   	
   			
   		};
	   
	   $scope.loadReportTypes = function(){
	    	
	    	var reportTypeOption = {};
	    	reportTypeOption.reportTypeTxt = "IO New Item";
	    	
	    	$scope.reportTypeArray.push(reportTypeOption);
	    	
	    	reportTypeOption = {};
	    	reportTypeOption.reportTypeTxt = "IO Schedule Info";
	    	
	    	$scope.reportTypeArray.push(reportTypeOption);
	    	reportTypeOption = {};
	    	reportTypeOption.reportTypeTxt = "IO Segmentaion Attribute";
	    	
	    	$scope.reportTypeArray.push(reportTypeOption);
	    	  	
	    };
	    
	    
	    $scope.validateFormDate = function(){
	    	$scope.validateForm();
		    };
		    
		   $scope.validateForm = function(){
			   $scope.GoButton = false;
			   if ($scope.SearchReport  === true && 
					   ($scope.reportTypeSelectedOption !== null || $scope.uploadDate !== null || $scope.selectedUserName !== undefined)){
				   $scope.GoButton = true;
			   } else {
				   if ($scope.DownloadReport  === true && $scope.durationSelectedOption !== null 
						   && $scope.reportTypeSelectedOption !== null && $scope.uploadDate !== null && $scope.selectedUserName !== undefined){
				   $scope.GoButton = true;  
				   }   
				   
			   }
				
		    };
	    
	    
	    $scope.resetPage = function(){
	    	   $scope.getUserDetails();
	    	   $scope.SearchReport = true;
			   $scope.DownloadReport = true;
			   $scope.GoButton = false;
			   $scope.showSearchGrid= false;
			   
			   $scope.reportTypeArray = [];
			   $scope.userNameArray = [];
			   $scope.durationArray = [];
			   $scope.loadReportTypes();
			   $scope.loadDuration();
			   
			   $scope.durationSelectedOption = null;
			   $scope.reportTypeSelectedOption = null;
			   $scope.uploadDate = null;
			   
			   $scope.initReportPage();
			   
			  // $scope.validateForm();
			   
		 };
		 
		 
		 $scope.showSearchGrid= false;
		 
		 $scope.resetPage();
	
});

