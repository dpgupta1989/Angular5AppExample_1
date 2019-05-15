var ItemAdjustmentControllers = angular.module('ItemAdjustmentController', []);

ItemAdjustmentControllers.controller('ItemAdjustmentController' ,function($scope,$http,$rootScope,$mdDialog,$routeParams,$interval,$filter,modal, $timeout,$element) {				
	
	
	if(modal.UserDetails != null && modal.UserDetails.userName != null ){
		$rootScope.$broadcast('username-update',modal.UserDetails.userName);
	} else{
		$scope.getUserDetails();
		$rootScope.$broadcast('username-update',modal.UserDetails.userName);
	}
	
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
		&& $scope.show === 'itemAdjustments' ){
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
	

	$scope.claimSubmitSucMsg = '';
	$rootScope.$on('claimSubmitSucMsg', function (evt, message) {
		$scope.claimSubmitSucMsg = message;
	});

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


	 $scope.initPage = function(){
		 $scope.serviceCallError = '';
		 $scope.upldCdStoreClaims = 12;
		 $scope.upldCdHandBill = 13;
		 $scope.upldCdDamageCredit = 14;
		 
		 if($scope.itemAdjustments===true){
			$scope.DisableAdd= true; 
			$scope.action = {type: 'StoreClaims'};
			$scope.headingText='Order Adjustment';
			$scope.storeClaim=true;
			$scope.showClaimsGrid=true;
			$scope.showDamagedGrid=false;
			$scope.showHandBillGrid=false;

			 } else {
				 if($scope.damagedCredit===true){
					 $scope.DisableAdd= true;
					 $scope.action = {type: 'DamageCredit'};
					 $scope.headingText='Damaged Credit';
						$scope.showClaimsGrid=false;
						$scope.showDamagedGrid=true;
						$scope.showHandBillGrid=false;
				 }
			 }
		 $scope.reqNbr='';
		 $scope.getAllSourceLoc();
		 $scope.getAllDestLoc();
	 }
	
		 	$scope.getAllSourceLoc= function(){
				$http({	
					method: 'GET',
					url: './services/sharedutil/getAllSourceLoc'}).then(
						function(getAllSourceLocResponse) {
							$scope.getAllSourceLocResponse = getAllSourceLocResponse.data;
							$scope.srcLocArray = $scope.getAllSourceLocResponse.locations;	
							
						},
						 function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
					    });
			};
			
		 	$scope.getAllDestLoc= function(){
				$http({	
					method: 'GET',
					url: './services/sharedutil/getAllDestLoc'}).then(
						function(getAllDestLocResponse) {
							$scope.getAllDestLocResponse = getAllDestLocResponse.data;
							$scope.destLocArray = $scope.getAllDestLocResponse.locations;	
						},
						 function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
					    });
			};
		
		$scope.validateForm= function(){
			$scope.claimSubmitSucMsg = '';
			$scope.serviceCallError = '';
			$scope.noSearchDataAvailable = false;
			if($scope.action.type==='StoreClaims' || $scope.action.type==='DamageCredit'){

				if($scope.srcLocNbrOpt != null && $scope.srcLocNbrOpt != '' && $scope.destLocNbrOpt != null && $scope.destLocNbrOpt != '' && $scope.reqNbr != null && $scope.reqNbr != ''){	
				$scope.DisableAdd = false;
			} else {
				$scope.DisableAdd= true;
			}
							}else{
								if($scope.action.type==='HandBill'){
									if($scope.srcLocNbrOpt != null && $scope.srcLocNbrOpt != '' && $scope.destLocNbrOpt != null && $scope.destLocNbrOpt != ''){	
									$scope.DisableAdd = false;
								} else {
									$scope.DisableAdd= true;
								}
								}
							}
		};
				 
  		$scope.loadUserNames = function(){
   			var userNameOption = {};
   			userNameOption.Name = modal.UserDetails.userName;
   			$scope.userNameArray.push(userNameOption);
   			
   			$scope.selectedUserName = modal.UserDetails.userName;
   	
   			
   		};
			   $scope.initPage();
			   $scope.srcLocNbrOpt='';	   
			   $scope.destLocNbrOpt='';
			   $scope.reqNbr='';
			   
		 $scope.DamageCredit = function(){
			 $scope.resetSearchAddPage();
			 $scope.DisableAdd= true; 
			 $scope.DisableReq= false;
				$scope.showClaimsGrid=false;
				$scope.showDamagedGrid=true;
				$scope.showHandBillGrid=false;			 
		 };
		 
		 $scope.StoreClaims = function(){
			 $scope.resetSearchAddPage();
			 $scope.DisableAdd= true; 
			 $scope.DisableReq= false;
			 $scope.reqHide=false;
			 $scope.showGrid= false;
			 $scope.storeClaim=true;
				$scope.showClaimsGrid=true;
				$scope.showDamagedGrid=false;
				$scope.showHandBillGrid=false;
		 };
		 
		 $scope.reqHide=false;
		 
		 $scope.HandBill = function(){
			 $scope.resetSearchAddPage();
			 $scope.DisableAdd= true;
			 $scope.DisableReq= true; 
			 $scope.reqHide=true;
			 $scope.showGrid= false;
			 $scope.storeClaim=false;
				$scope.showClaimsGrid=false;
				$scope.showDamagedGrid=false;
				$scope.showHandBillGrid=true;		 };
		 
		 $scope.resetSearchAddPage = function(){
			  $scope.DisableAdd= true;
			   $scope.srcLocNbrOpt='';	   
			   $scope.destLocNbrOpt='';
			   $scope.reqNbr='';
		 };
		 
		 $scope.search = function(){
			 $scope.claimSubmitSucMsg = '';
			 $scope.serviceCallError = '';
			 $scope.noSearchDataAvailable = false;
			 if ($scope.action.type === 'HandBill'){
					$scope.searchHeader='Handbill Search Results';
					$scope.searchRequest=[];
					$scope.searchResponse=[];
					$scope.searchRequest.src=$scope.srcLocNbrOpt.locNbr;
					$scope.searchRequest.dest=$scope.destLocNbrOpt.locNbr;
					$scope.searchRequest.req=$scope.reqNbr;
				 var formattedRequest = {
							src : $scope.searchRequest.src, 
							dest : $scope.searchRequest.dest,
							req : '',
							upldCd : $scope.upldCdHandBill
					};
					$http({	
						method: 'POST',
						url: './services/sharedutil/searchRecord',
						data: formattedRequest
							}).then(
							function(response) {
								$scope.searchResponse = response.data;	
								$scope.searchResponse = $scope.searchResponse.searchRecordResponseList;
								
								$scope.showGridFunction($scope.searchResponse.length);
								


						 }, function(error){
								 var exceptionInfoBean = error.data.exceptionInfoBean;
								 if (exceptionInfoBean){
								 	$scope.serviceCallError = exceptionInfoBean.errorText;
								 }
					    });
				 
				} else {
					if ($scope.action.type === 'StoreClaims'){
						$scope.searchHeader='Store Claims Search Results';
						$scope.searchRequest=[];
						$scope.searchResponse=[];
						$scope.searchRequest.src=$scope.srcLocNbrOpt.locNbr;
						$scope.searchRequest.dest=$scope.destLocNbrOpt.locNbr;
						$scope.searchRequest.req=$scope.reqNbr;
					 var formattedRequest = {
								src : $scope.searchRequest.src, 
								dest : $scope.searchRequest.dest,
								req : $scope.searchRequest.req,
								upldCd : $scope.upldCdStoreClaims
						};
						$http({	
							method: 'POST',
							url: './services/sharedutil/searchRecord',
							data: formattedRequest
								}).then(
								function(response) {
							$scope.searchResponse=response.data;	
							$scope.searchResponse = $scope.searchResponse.searchRecordResponseList;
							$scope.showGridFunction($scope.searchResponse.length);
							}, function(error){
								 var exceptionInfoBean = error.data.exceptionInfoBean;
								 if (exceptionInfoBean){
								 	$scope.serviceCallError = exceptionInfoBean.errorText;
								 }
						    });
						
					} else {
						if ($scope.action.type === 'DamageCredit'){
							$scope.searchHeader='Damaged Credit Search Results';
							$scope.searchRequest=[];
							$scope.searchResponse=[];
							$scope.searchRequest.src=$scope.srcLocNbrOpt.locNbr;
							$scope.searchRequest.dest=$scope.destLocNbrOpt.locNbr;
							$scope.searchRequest.req=$scope.reqNbr;
						 var formattedRequest = {
									src : $scope.searchRequest.src, 
									dest : $scope.searchRequest.dest,
									req : $scope.searchRequest.req,
									upldCd : $scope.upldCdDamageCredit
							};
							$http({	
								method: 'POST',
								url: './services/sharedutil/searchRecord',
								data: formattedRequest
									}).then(
									function(response) {
								$scope.searchResponse=response.data;	
								$scope.searchResponse = $scope.searchResponse.searchRecordResponseList;
								
								$scope.searchResponse.forEach(function(itm){
									 itm.creditAmt = parseFloat((itm.totCost - itm.salvVal).toFixed(2));
								 });
								
								$scope.showGridFunction($scope.searchResponse.length);
								}, function(error){
									 var exceptionInfoBean = error.data.exceptionInfoBean;
									 if (exceptionInfoBean){
									 	$scope.serviceCallError = exceptionInfoBean.errorText;
									 }
							    });
						}
					}
				}
		 }
		 
		 $scope.showGridFunction = function(rowCount){
		 	if (rowCount == 0){
					$scope.showGrid = false;
					$scope.noSearchDataAvailable = true;
				} else {
					$scope.showGrid = true;
					$scope.noSearchDataAvailable = false;
				}
		}
		 
			$scope.add = function(){
				$scope.noSearchDataAvailable = false;
				 $scope.claimSubmitSucMsg = '';
				 $scope.serviceCallError = '';
				if($scope.action.type==='StoreClaims' || $scope.action.type==='DamageCredit'){
					//ADD VALIDATION TREE HERE FOR VALIDATING REQ NUMBER IF STORE CLAIM OR DAMAGED CREDIT
					//ELSE ADD GET REQ NUMBER FOR HANDBILL
					//Also need to add a way to check if the headingText is set to Damaged Credit when running this function to give the proper header to the pop up for damaged credit
									
					$scope.isValidRequisition=[];
					$scope.validateReqRequest=[];
					$scope.validateReqRequest.src=$scope.srcLocNbrOpt.locNbr;
					$scope.validateReqRequest.dest=$scope.destLocNbrOpt.locNbr;
					$scope.validateReqRequest.req=$scope.reqNbr;
					
					 var formattedRequest = {
							src : $scope.validateReqRequest.src, 
							dest : $scope.validateReqRequest.dest,
							req : $scope.validateReqRequest.req
					};
					 
						$http({	
							method: 'PUT',
							url: './services/sharedutil/validateRequisition',
							data: formattedRequest
						}).then(function(response) {
										$scope.isValidRequisition=response.data;					
										if($scope.isValidRequisition.requisitionExist === true){
								              //THIS IS WHERE I WANT TO ADD IN $scope.noSearchDataAvailable = true; to show the search data is not available  
												var myModal = modal.getModal();
												modal.selectedPage = $scope.action;
												modal.selectedSrcLoc=$scope.srcLocNbrOpt;
												modal.selectedDestLoc=$scope.destLocNbrOpt;
												modal.enteredReqNbr=$scope.reqNbr;
												myModal.open();	
										} 
										else {
												if($scope.isValidRequisition.requisitionExist === false){
													$scope.noSearchDataAvailable = true;	
										         }
										}
						}, function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
					    });
				}else{
						if($scope.action.type==='HandBill'){
							 $scope.getNxtHndRequisition = function(){	 
								$http({	
									method: 'GET',
									url: './services/handbill/getNxtHndRequisition'}).then(
										function(reqResponse) {
											$scope.reqNbr=reqResponse.data;
			                                //TO ADD VALIDATION AROUND SUCCESS OF GETTING A REQUISITION NUMBER BEFORE LOADING MODAL
											var myModal = modal.getModal();
											modal.selectedPage = $scope.action;
											modal.selectedSrcLoc=$scope.srcLocNbrOpt;
											modal.selectedDestLoc=$scope.destLocNbrOpt;
											modal.enteredReqNbr=$scope.reqNbr.reqHndNbr;
											myModal.open();	
									    }, function(error){
											 var exceptionInfoBean = error.data.exceptionInfoBean;
											 if (exceptionInfoBean){
											 	$scope.serviceCallError = exceptionInfoBean.errorText;
											 }
								       });
							 };
							 $scope.getNxtHndRequisition();
						}
					}
			};
			
			 $scope.validateReq = function(request){
				 var formattedRequest = {
						src : request.src, 
						dest : request.dest,
						req : request.req
				};
				 
					$http({	
						method: 'PUT',
						url: './services/sharedutil/validateRequisition',
						data: formattedRequest
							}).then(
							    function(Response) {
							});			
					return Response.data;
				};
				
		 $scope.DisableAdd= true;
		 $scope.DisableReq= false;
		 $scope.DisableSearch= false;

			$scope.openOrderDetails = function(seqNbr) {
				var myDetailModal = modal.getDetailModal();
				modal.seqNbr=seqNbr;
				modal.selectedPage = $scope.action;
				myDetailModal.open();	
			};
			

			$scope.openDamagedCreditOrderDetails = function(seqNbr) {
				var myDamagedCreditDetailModal = modal.getDamagedDetailModal();
				modal.seqNbr=seqNbr;
				myDamagedCreditDetailModal.open();	
			};
			
			
			$scope.DamagedGrid = {
				    enableRowSelection: false,
				    enableSelectAll: false,
					enableSorting: true,
					paginationPageSizes: [100],
				    paginationPageSize: 100,
				    showGridFooter:true,
					enableColumnMenus: false,	
					isRowSelectable: function(row) {
						return false;
				},	
					columnDefs: [	
						 { field: 'seqNbr',
							    displayName: 'Upload ID',
							    cellTemplate :'<div style="padding-left:5px;padding-top:5px;padding-bottom:5px" ><a ng-click="grid.appScope.openOrderDetails(row.entity.seqNbr)">{{row.entity.seqNbr}}</a></div>',
							  },
						{ field: 'upldType',
							displayName: 'Type'
						  },
						  { field: 'req',
								displayName: 'Requisition'
							  },
					  { field: 'src',
						displayName: 'Source'
					  },
					  { 
						field: 'dest',
						displayName: 'Destination',
					  },
					  { 
						field: 'creditAmt',
						displayName: 'Total Credit',
						cellFilter: 'number: 2'
					  },
						  { field: 'usrId',
							    displayName: 'Submitted By'		
						  }
					],
					 data: 'searchResponse'
			};
			
			$scope.HandBillGrid = {
					 enableRowSelection: false,
					    enableSelectAll: false,
						enableSorting: true,
						paginationPageSizes: [100],
					    paginationPageSize: 100,
					    showGridFooter:true,
						enableColumnMenus: false,	
						isRowSelectable: function(row) {
							return false;
				},			
					columnDefs: [	
						
						 { field: 'seqNbr',
							    displayName: 'Upload ID',
							    cellTemplate :'<div style="padding-left:5px;padding-top:5px;padding-bottom:5px" ><a ng-click="grid.appScope.openOrderDetails(row.entity.seqNbr)">{{row.entity.seqNbr}}</a></div>',
						},
						{ field: 'upldType',
							displayName: 'Type'
						  },
						  { field: 'req',
								displayName: 'Requisition'
							  },
					  { field: 'src',
						displayName: 'Source'
					  },
					  { 
						field: 'dest',
						displayName: 'Destination',
					  },			
					  { field: 'totCost',
							displayName: 'Total Cost',
								cellFilter: 'number: 2'
					  },			  
						  { field: 'usrId',
							    displayName: 'Submitted By'		
						  }
					],
					 data: 'searchResponse'
			};	
			


			$scope.ClaimsGrid = {
					    enableRowSelection: false,
					    enableSelectAll: false,
						enableSorting: true,
						paginationPageSizes: [100],
					    paginationPageSize: 100,
					    showGridFooter:true,
						enableColumnMenus: false,		
						isRowSelectable: function(row) {
							return false;
					},	
						columnDefs: [	
							
							 { field: 'seqNbr',
								    displayName: 'Upload ID',
								    cellTemplate :'<div style="padding-left:5px;padding-top:5px;padding-bottom:5px" ><a ng-click="grid.appScope.openOrderDetails(row.entity.seqNbr)">{{row.entity.seqNbr}}</a></div>',
							},
							{ field: 'upldType',
								displayName: 'Type'
							  },
							  { field: 'req',
									displayName: 'Requisition'
								  },
						  { field: 'src',
							displayName: 'Source'
						  },
						  { field: 'srcI',
								displayName: 'Src I'
							  },
						  { 
							field: 'dest',
							displayName: 'Destination',
						  },	
						  { field: 'destI',
								displayName: 'Dest I'
							  },
						  { field: 'totCost',
								displayName: 'Total Cost',
									cellFilter: 'number: 2'
						  },			  
							  { field: 'usrId',
								    displayName: 'Submitted By'		
							  }
						],
						 data: 'searchResponse'
				};
			
});




