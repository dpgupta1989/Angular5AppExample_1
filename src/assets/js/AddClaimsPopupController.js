
var UpdateAddControllers = angular.module('AddClaimsPopupController', []);



UpdateAddControllers.directive('fileReader', function() {
	  return {
	    scope: {
	      fileReader:"="
	    },
	    link: function(scope, element, attr, ItemAdjustmentController) {
	      
	    	$(element).on('change', function(changeEvent) {
	    		
	        var files = changeEvent.target.files;
	        if (files.length) {
	          var r = new FileReader();
	          r.onload = function(e) {
	              scope.$emit('notification', e.target.result);
	              scope.$apply(function () {
	              });
	          };
	          r.readAsText(files[0]);
	        }
	      });
	    }
	  };
});

//UpdateAddControllers.directive('ngConfirmClick', [
//    function(){
//        return {
//            link: function (scope, element, attr) {
//                var msg = attr.ngConfirmClick || "Are you sure?";
//                var clickAction = attr.confirmedClick;
//                element.bind('click',function (event) {
//                    if ( window.confirm(msg) ) {
//                        scope.$eval(clickAction)
//                    }
//                });
//            }
//        };
//}]);

UpdateAddControllers.controller('UpdateAddController' ,function($scope,$http,$rootScope,$mdDialog,$routeParams,modal,$interval,$filter,$element) {
	
	$scope.downloadTemplate = function () {
		$scope.toJSON = '';
		$scope.toJSON = angular.toJson($scope.data);
		var data = '';
		var sheetName = '';
		if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill'){
			sheetName = 'OrderAdjustmentsTemplate.csv';
			data = 'Item,Quantity';
		} else {
			if ($scope.page.type === 'DamageCredit'){
				sheetName = 'DamagedCreditTemplate.csv';
				data = 'Item,Quantity,ValueType(D=Dollar or P=Percent),Amount';
			}
		}
		var blob = new Blob([data], { type:"text/plain;" });
		if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, sheetName);
        }
		else{
			var downloadLink = angular.element('<a></a>');
	                    downloadLink.attr('href',window.URL.createObjectURL(blob));
	                    downloadLink.attr('download', sheetName);
			downloadLink[0].click();
		}
	};
	
	
	
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
						console.log(" in popup Logged in UserName is " + modal.UserDetails.userName + " userId is " + modal.UserDetails.userId,'color:#0000FF ');
						
					} 
				});					
	};	
	
	if (modal.UserDetails === null || modal.UserDetails === undefined || modal.UserDetails === ''){
		$scope.getUserDetails();
	}
	
	$scope.params = $routeParams;
	$scope.show = $scope.params.show;	
	
	$scope.salesId = modal.UserDetails.salesId;
	$rootScope.$broadcast('username-update',modal.UserDetails.userName);
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
	
	// modal.UserDetails.userId='DEVBXH1';
	
	var fileData = {};
	$scope.fileHeaderValidErrorMsg = '';
	$scope.fileEmtyErrMsg = '';
	$scope.fileDataErrMsg = '';
	$scope.fileAmtErrMsg = '';
	$scope.duplicateDataError = '';
	$scope.itemLengthErrMsg = '';
	$scope.claimSubmitErrMsg = '';
	$scope.claimSubmitSucMsg = '';
	$scope.$on('notification', function (evt, contents) {
		 
        var allTextLines = contents.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for ( var i = 1; i < allTextLines.length; i++) {
            // split content based on comma
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                var tarr = [];
                for ( var j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }
        fileData = lines;
        
//		$scope.fileInError = true;
        $scope.resetSpreadsheetErrors();
        $scope.validateUploadHeaderLength(headers);

   });
	 
	 
	  $scope.resetSpreadsheetErrors = function(){
		  $scope.itemLengthError = '' ;
		  $scope.itemFormatError = '' ;
		  $scope.qtyLengthError = '' ;
		  $scope.qtyFormatError = '' ;
		  $scope.qtyDamagedFormatError = '' ;
		  $scope.valueTypeError = '' ;
		  $scope.amountError = '' ;
		  $scope.percentAmountError = '' ;
		  $scope.zeroAmountError = '' ;
		  $scope.emptyCellError = '';
		  $scope.claimSubmitErrMsg = '';
		  $scope.serviceCallError = '';
		  $scope.duplicateDataError = '';
		  
		  $scope.fileInError = false;
		  
		  
		 
	  };
	  	  
	 $scope.validateUploadHeaderLength = function(headers){
//		 $scope.resetSpreadsheetErrors();
			if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill'){
				 if (headers.length !== 2 || headers[0].trim() !== 'Item' || headers[1].trim() !== 'Quantity'){
					 $scope.fileHeaderValidErrorMsg = 'Invalid Header, Please Upload Correct File...!';
					 $scope.fileEmtyErrMsg = '';
					 $scope.fileDataErrMsg = '';
					 $scope.fileAmtErrMsg = '';
					 $scope.duplicateDataError = '';
					 angular.element("input[type='file']").val(null);
					 $scope.addButtonDisabled = true;
				  }
				 else{
					 $scope.fileHeaderValidErrorMsg = '';
					 $scope.validateRows();
				 }
			} else {
				if ($scope.page.type === 'DamageCredit'){
					if (headers.length !== 4 || headers[0].trim() !== "Item" || headers[1].trim() !== "Quantity"
						|| headers[2].trim() !== "ValueType(D=Dollar or P=Percent)" || headers[3].trim() !== "Amount"){
						$scope.fileHeaderValidErrorMsg = 'Invalid Header, Please Upload Correct File...!';
						$scope.fileEmtyErrMsg = '';
						$scope.fileDataErrMsg = '';
						$scope.fileAmtErrMsg = '';
						$scope.duplicateDataError = '';
						angular.element("input[type='file']").val(null);
						$scope.addButtonDisabled = true;
					 }
					 else{
						
						$scope.fileHeaderValidErrorMsg = '';
						$scope.validateRows();
					}
			    }
	       }
	 }
	 
	 $scope.validateRows = function(){
//		 $scope.resetSpreadsheetErrors();
		 var rowCount = fileData.length;
			if (rowCount >= 1){
				if (rowCount <= 1000){
					$scope.fileEmtyErrMsg = '';
					$scope.fileDataDuplicateCheck();
				}
				else {
					$scope.fileEmtyErrMsg = "File is too long!";
					$scope.fileDataErrMsg = '';
					$scope.fileAmtErrMsg = '';
					angular.element("input[type='file']").val(null);
					$scope.fileInError = true;
				}
			} 
			else {
				$scope.fileEmtyErrMsg = "File is Empty!";
				$scope.fileDataErrMsg = '';
				$scope.fileAmtErrMsg = '';
				angular.element("input[type='file']").val(null);
				$scope.fileInError = true;
			}
	  };
	  
	  $scope.confirmAdd= function(ev){
		  var sumTotCost = 0;
		  var sumNetCost = 0;
		  if($scope.page.type === 'StoreClaims'){
			  $scope.LocStratGrid.data.forEach(function(item) {					
					sumTotCost = sumTotCost + Math.abs(item.totCost);
					sumNetCost = sumNetCost + item.totCost;
					});
		 
			  var confirm = $mdDialog.confirm()
              .title('Would you like to submit the Store Claims Record(s)?')
              .htmlContent('Transactions Total : $' + sumTotCost.toFixed(2) + '<br/>' + 
            		  'Transactions Net Total : $' + sumNetCost.toFixed(2))
              .targetEvent(ev)
              .ok('OK')
              .cancel('Cancel');
        
			$mdDialog.show(confirm).then(function() {
				$scope.submit();
			}, function() {
				console.log(" submit confirmed");
			});
			  
		  }else{
			  if($scope.page.type === 'HandBill'){
				  $scope.LocStratGrid.data.forEach(function(item) {			
						sumNetCost = sumNetCost + item.totCost;
						});  
				  
				  var confirm = $mdDialog.confirm()
	              .title('Would you like to submit the Hand Bill Record(s)?')
	              .htmlContent('Transactions Total : $' + sumNetCost.toFixed(2))
	              .targetEvent(ev)
	              .ok('OK')
	              .cancel('Cancel');
	        
				$mdDialog.show(confirm).then(function() {
					$scope.submit();
				}, function() {
					console.log(" submit confirmed");
				});
				  
		  }else{
			  if($scope.page.type === 'DamageCredit'){
				  $scope.LocStratGrid2.data.forEach(function(item) {
						sumNetCost = sumNetCost + (item.totalCost - item.salvVal);
						});  
				  
				  var confirm = $mdDialog.confirm()
	              .title('Would you like to submit the Damaged Credit Record(s)?')
	              .htmlContent('Transactions Total Credit Amount : $' + sumNetCost.toFixed(2))
	              .targetEvent(ev)
	              .ok('OK')
	              .cancel('Cancel');
	        
				$mdDialog.show(confirm).then(function() {
					$scope.submit();
				}, function() {
					console.log(" submit confirmed");
				});
			  }
	    }}};


	  /*Comparison of data in the same file*/ 
	  $scope.fileDataDuplicateCheck = function(){
//		  $scope.resetSpreadsheetErrors();
		  var itemId = [];
		  var isUnique = true;
	      for(var i=0;i<fileData.length;i++){
	      	if(!itemId.includes(fileData[i][0])){
	      		if(fileData[i][0].trim()){
	      	       itemId.push(fileData[i][0]);
	      		}
	      	}
	      	else{
	      		isUnique = false;
	      		break;
	      	}
	      }
	      if(isUnique){
	    	    $scope.duplicateDataError = '';
				$scope.validateFileData();
			}
			else{
				   $scope.duplicateDataError = "File Contains Duplicate record !";
				   $scope.fileDataErrMsg = '';
				   $scope.fileAmtErrMsg = '';
				   $scope.fileInError = true;
				   angular.element("input[type='file']").val(null);
			}
	  }
	  
	  /*Comparison data of two different files*/
	  $scope.filesDataDuplicateCompare = function(){
//		  $scope.resetSpreadsheetErrors();
		  var itemIds = [];
		  var isValidFile = true;
		    if(Object.keys($scope.LocStratGrid.data).length || Object.keys($scope.LocStratGrid2.data).length){
		    	if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill'){
		    		$scope.LocStratGrid.data.forEach(function(item, index) {
		    			itemIds.push(item.itm);
				  });
		    	}
		    	else{
		    		$scope.LocStratGrid2.data.forEach(function(item) {
		    			itemIds.push(item.itm);
				  });
		    	}
				  for(var i=0;i<fileData.length;i++){
						 if(itemIds.includes(parseInt(fileData[i][0]))){
							 $scope.duplicateDataError = "File Data already exist in the Grid !";
							 angular.element("input[type='file']").val(null);
							 $scope.addButtonDisabled = true;
							 isValidFile = false;
							 break;
						 }
				  }
		  }
		  if(isValidFile){
			  $scope.duplicateDataError ='';
		  }
		  
		  if($scope.fileInError){
			  $scope.addButtonDisabled = true;
		  } else {
			  $scope.addButtonDisabled = false;
		  }
	  }
	 	  
	  $scope.validateFileData = function(){
//		  $scope.resetSpreadsheetErrors();
		  var itemLengthIndex = [] ;
		  var itemFormatIndex = [] ;
		  var qtyLengthIndex = [] ;
		  var qtyFormatIndex = [] ;
		  var qtyDamagedFormatIndex = [] ;
		  var valueTypeIndex = [] ;
		  var amountIndex = [] ;
		  var percentAmountIndex = [] ;
		  var zeroAmountIndex = [] ;
		  var emptyValIndex  = [];
		  
		  var itemLengthErrorMsg = "Item length cannot be more than 9 digit, Please check row no. ";
		  var itemFormatErrorMsg = "Item cannot contain non-numeric characters, Please check row no. ";
		  var qtyLengthErrorMsg = "Quantity length cannot be more than 5 digit, Please check row no. ";
		  var qtyFormatErrorMsg = "Quantity cannot contain non-numeric characters (excpet \'-\'), Please check row no. ";
		  var qtyDamagedFormatErrorMsg = "Quantity cannot contain non-numeric characters, Please check row no. ";
		  var valueTypeErrorMsg = "Value Type must be either 'P' or 'D', Please check row no. ";
		  var amountErrorMsg = "Amount cannot contain non-numeric characters, Please check row no. ";
		  var percentAmountErrorMsg = "Amount cannot be more than 100%, Please check row no. ";
		  var zeroAmountErrorMsg = "Amount cannot be 0, Please check row no. ";
		  var emptyValErrMsg = "File Contains empty cells, Please check row no. ";
		  
		    if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill' || $scope.page.type === 'DamageCredit'){
		    	//Validate Item 
		    	
				fileData.forEach(function(rowData, index){
					if(rowData[0].trim().length > 9){
						itemLengthIndex.push(index+2);
					}
					
					//Validate Item is a number
					if(rowData[0].trim() && rowData[1].trim() && ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill')){
						if(isNaN(rowData[0]) || rowData[0].includes('.') || rowData[0].includes('-')){
							itemFormatIndex.push(index+2);
						}
					}
					else if(rowData[0].trim() && rowData[1].trim() && rowData[2].trim() && rowData[3].trim() && $scope.page.type === 'DamageCredit'){
						if(isNaN(rowData[0]) || rowData[0].includes('.') || rowData[0].includes('-')){
							itemFormatIndex.push(index+2);
						}
					}
					else{
						emptyValIndex.push(index+2);
					}
					
					//Validate quantity
					if(rowData[1].trim().length > 5){
						qtyLengthIndex.push(index+2);
					}
					
					//Validate qty is a number
					if(isNaN(rowData[1]) || rowData[1].includes('.')){
						qtyFormatIndex.push(index+2);
					} 
					
					if ($scope.page.type === 'DamageCredit' || $scope.page.type === 'HandBill'){
						if(rowData[1].includes('-')){
							qtyDamagedFormatIndex.push(index+2);
						} 
					}
					
					if ($scope.page.type === 'DamageCredit' ){
						if(rowData[2].trim()){
							if(rowData[2].trim().toUpperCase() != "P" && rowData[2].trim().toUpperCase() != "D"){
								valueTypeIndex.push(index+2);
							}
						}
						if(isNaN(rowData[3])){
							amountIndex.push(index+2);
						} else {
							if(rowData[3].trim()){
								if(rowData[2].trim().toUpperCase() == "P" && !(rowData[3] > 0 && rowData[3] <= 100)){
									percentAmountIndex.push(index+2);
								}
								if((rowData[3] == 0)){
									zeroAmountIndex.push(index+2);
								}
							}
						}
					} 
			    });
		     }
		    
		      if (emptyValIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.emptyCellError = emptyValErrMsg + emptyValIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (itemLengthIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.itemLengthError = itemLengthErrorMsg + itemLengthIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (itemFormatIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.itemFormatError = itemFormatErrorMsg + itemFormatIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (qtyLengthIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.qtyLengthError = qtyLengthErrorMsg + qtyLengthIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (qtyFormatIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.qtyFormatError = qtyFormatErrorMsg + qtyFormatIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (qtyDamagedFormatIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.qtyDamagedFormatError = qtyDamagedFormatErrorMsg + qtyDamagedFormatIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (valueTypeIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.valueTypeError = valueTypeErrorMsg + valueTypeIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (amountIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.amountError = amountErrorMsg + amountIndex.toString();
				  $scope.fileInError = true;
			  }
			  if (percentAmountIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.percentAmountError = percentAmountErrorMsg + percentAmountIndex.toString();
			  	  $scope.fileInError = true;
			  }
			  if (zeroAmountIndex.length > 0){
				  angular.element("input[type='file']").val(null);
				  $scope.percentAmountError = zeroAmountErrorMsg + zeroAmountIndex.toString();
				  $scope.fileInError = true;
			  }
			  
			  
			  $scope.filesDataDuplicateCompare();
	 }

	 $scope.initReportPage = function(){
		 $scope.upldCdStoreClaims = 12;
		 $scope.upldCdHandBill = 13;
		 $scope.upldCdDamageCredit = 14;
		 $scope.action = {type: 'search'};
		 $scope.Search();
	 }
	
	$scope.Search = function(){
		 $scope.SearchReport  = true;
		 $scope.DownloadReport = false;
    };
    
	   $scope.SearchReport = true;
	   $scope.DownloadReport = true;
	   $scope.GoButton = false;
	   $scope.showDIPGrid= false;
	   $scope.reportTypeArray = [];
	   $scope.userNameArray = [];
	   $scope.durationArray = [];
	   $scope.showDelete = false;
	   
	   $scope.initReportPage();
	   $scope.DisableNewRec= true;
	   $scope.disableSubmitBtn = true;
	   
	   $scope.close = function(){
		   $element.remove();
		}
		
		$scope.submit= function(){
			$scope.genericServiceError = '';
			if ($scope.page.type === 'StoreClaims'){
				var itemDtlArr = [];
					$scope.LocStratGrid.data.forEach(function(item) {					
						itemDtlArr.push({
							itmNrb : item.itm, 
							qty : item.qty,
							totCst: item.totCost
								});
						});
					 var formattedRequest = {
							   transacType:1,
							   src:$scope.selectedSrcLoc.locNbr,
							   srcI:$scope.inventoryTypes.srcTypI,
							   dest:$scope.selectedDestLoc.locNbr,
							   destI:$scope.inventoryTypes.destTypeI,
							   req:$scope.enteredReqNbr,
							   usrId:modal.UserDetails.userId
						};
						formattedRequest.itemDetails = itemDtlArr;
				if(!angular.equals({}, formattedRequest)){
					$http({	
						method: 'POST',
						url: './services/storeclaims/submitStoreClaims',
						data: formattedRequest
					 }).then(function(response) {
						 if(response.data.submitStoreClaimResponseType){
							 var claimSubmitSucMsg = "The transaction submitted successfully.";
							 $rootScope.$emit('claimSubmitSucMsg', claimSubmitSucMsg);
							 $element.remove();
						 }
						 else{
							 $scope.claimSubmitErrMsg = "Invalid claim submission.";
						 }
						 $scope.LocStratGrid = {
		                         "data": []
		                 }
					},
					function(error){
						 var exceptionInfoBean = error.data.exceptionInfoBean;
						 if (exceptionInfoBean){
						 	$scope.genericServiceError = exceptionInfoBean.errorText;
						 }
				    });
					
					}
			}else {
					if ($scope.page.type === 'HandBill'){
						var itemDtlArr = [];
							$scope.LocStratGrid.data.forEach(function(item) {					
								itemDtlArr.push({
									itmNrb : item.itm, 
									qty : item.qty,
									totCst: item.totCost
										});
								});
							 var formattedRequest = {
									   transacType:1,
									   src:$scope.selectedSrcLoc.locNbr,
									   dest:$scope.selectedDestLoc.locNbr,
									   req:$scope.enteredReqNbr,
									   usrId:modal.UserDetails.userId
								};
								formattedRequest.itemDetails = itemDtlArr;
					if(!angular.equals({}, formattedRequest)){
						$http({	
							method: 'POST',
							url: './services/handbill/submitHandBill',
							data: formattedRequest
						 }).then(function(response) {
							 if(response.data.submitHandBillResponseType){
								 var claimSubmitSucMsg = "The transaction submitted successfully.";
								 $rootScope.$emit('claimSubmitSucMsg', claimSubmitSucMsg);
								 $element.remove();
							 }
							 else{
								 $scope.claimSubmitErrMsg = "Invalid claim submission.";
							 }
							 $scope.LocStratGrid = {
			                         "data": []
			                 }
						 },
						 function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean){
							 	$scope.genericServiceError = exceptionInfoBean.errorText;
							 }
					    });
					}
				}
			else {
					if ($scope.page.type === 'DamageCredit'){
						var itemDtlArr = [];
							$scope.LocStratGrid2.data.forEach(function(item) {	
								itemDtlArr.push({
									itmNrb : item.itm, 
									qty : item.qty,
									salvVal: item.salvVal,
									totCst: item.totalCost
										});
								});
							 var formattedRequest = {
									   transacType:1,
									   src:$scope.selectedSrcLoc.locNbr,
									   dest:$scope.selectedDestLoc.locNbr,
									   req:$scope.enteredReqNbr,
									   usrId:modal.UserDetails.userId
								};
								formattedRequest.itemDetails = itemDtlArr;
						if(!angular.equals({}, formattedRequest)){
							$http({	
								method: 'POST',
								url: './services/damagedcredit/submitDamageClaims',
								data: formattedRequest
							 }).then(function(response) {
									 if(response.data.submitDamageClaimResponseType){
										 var claimSubmitSucMsg = "The transaction submitted successfully.";
										 $rootScope.$emit('claimSubmitSucMsg', claimSubmitSucMsg);
										 $element.remove();
										 
									 }
									 else{
										 $scope.claimSubmitErrMsg = "Invalid claim submission.";
									 }
									 $scope.LocStratGrid2 = {
					                         "data": []
					                 }
							},
							function(error){
								 var exceptionInfoBean = error.data.exceptionInfoBean;
								 if (exceptionInfoBean){
								 	$scope.genericServiceError = exceptionInfoBean.errorText;
								 }
						    });
					    }
				   }
			
				}
			}
			 $scope.disableSubmitBtn = true;
			 $scope.showDelete = false;
		};
		
		$scope.cancel= function(){
			$element.remove();
			$scope.clear();
		};
		
		$scope.addItem='';
		$scope.addQty='';
		$scope.amountEntered = '';
		$scope.addButtonDisabled=true;
		$scope.amountEnteredError = '';	
		
		$scope.validateForm= function(){
			$scope.resetSpreadsheetErrors();
			fileData={};
			angular.element("input[type='file']").val(null);
			$scope.fileHeaderValidErrorMsg = '';
			$scope.fileEmtyErrMsg = '';
			$scope.fileDataErrMsg = '';
			$scope.fileAmtErrMsg = '';
//			$scope.duplicateDataError ='';
			$scope.addButtonDisabled = true;
			
			if($scope.LocStratGrid.data.length || $scope.LocStratGrid2.data.length){
				var itemIds = [];
				if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill'){
					$scope.LocStratGrid.data.forEach(function(item, index) {
						itemIds.push(item.itm);
					});
				} else {
						$scope.LocStratGrid2.data.forEach(function(item, index) {
							itemIds.push(item.itm);
						});
					}
				
				if(itemIds.includes(parseInt($scope.addItem))){
					$scope.duplicateDataError = "Field Data already exist in the Grid!";
					$scope.addButtonDisabled = true;
				} else {
						$scope.duplicateDataError = '';
						$scope.addButtonDisabled = false;
					}
				}
			 
			if ($scope.page.type === 'StoreClaims' || $scope.page.type === 'HandBill'){
				if(($scope.addItem && $scope.addQty && $scope.duplicateDataError == '')){	
					$scope.addButtonDisabled = false;
					} else {
						$scope.addButtonDisabled = true;
					}
				
				} else {
					if ($scope.page.type === 'DamageCredit'){
						if($scope.addItem && $scope.addQty	&& $scope.amountEntered && ($scope.selectedValueTypeOption.valueTypeSymbol=='$') && $scope.duplicateDataError ==''){	
							$scope.amountEnteredError = '';
							$scope.addButtonDisabled = false;
						} else {
							if($scope.selectedValueTypeOption.valueTypeSymbol=='%'){
								if ($scope.amountEntered > 100){
									$scope.amountEnteredError = "Amount Value can't be more than 100%";
									$scope.addButtonDisabled = true;
								} else {
									$scope.amountEnteredError = '';
									if($scope.addItem && $scope.addQty	&& $scope.amountEntered && ($scope.selectedValueTypeOption.valueTypeSymbol=='%') && $scope.duplicateDataError ==''){
										$scope.amountEnteredError = '';
										$scope.addButtonDisabled = false;
									}
								}
							}
						}
						if ($scope.amountEntered && $scope.amountEntered == 0){
							$scope.amountEnteredError = "Amount Value cannot be 0";
							$scope.addButtonDisabled = true;
						} else {
							if (!$scope.amountEntered){
								$scope.amountEnteredError = "";
								$scope.addButtonDisabled = true;
							}
						}
					}
				}
		};
		
	

		$scope.addClaims = function(){
			$scope.claimSubmitErrMsg = '';
			$scope.serviceCallError = '';
			if ($scope.page.type === 'StoreClaims'){
				var formattedRequest = {};
				if(fileData.length){
					var itemArr = [];
					fileData.forEach(function(item) {					
							itemArr.push({
								itmNbr : item[0], 
								qty : item[1],
								destNbr : $scope.selectedDestLoc.locNbr
							});
						});
					formattedRequest.claimRecordRequestList = itemArr;
				}
			   else if($scope.addItem && $scope.addQty){
				 formattedRequest.claimRecordRequestList = [
									        	{
													itmNbr : $scope.addItem, 
													qty : $scope.addQty,
													destNbr : $scope.selectedDestLoc.locNbr
									        	}
									        ];
			   }
				
			  if(!angular.equals({}, formattedRequest)){
				$http({	
					method: 'PUT',
					url: './services/storeclaims/getClaimsRecord',
					data: formattedRequest
				 }).then(function(response) {
						 var claimResponse = response.data.claimRecordResponse;
						 if(claimResponse.length > 0){
							 claimResponse.forEach(function(item){
								 $scope.LocStratGrid.data.push(item);
							 });
							 $scope.disableSubmitBtn = false;
						 }
					 }, function(response){
							 var exceptionInfoBean = response.data.exceptionInfoBean;
							 if (exceptionInfoBean != null){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
						 });
						 
		     }
		} else {
			if ($scope.page.type === 'HandBill'){
				var formattedRequest = {};
				if(fileData.length){
					var itemArr = [];
					fileData.forEach(function(item) {					
							itemArr.push({
								itmNbr : item[0], 
								qty : item[1],
								destNbr : $scope.selectedDestLoc.locNbr
							});
						});
					formattedRequest.handRecordRequestList = itemArr;
				}
			   else if($scope.addItem && $scope.addQty){
				 formattedRequest.handRecordRequestList = [
									        	{
													itmNbr : $scope.addItem, 
													qty : $scope.addQty,
													destNbr : $scope.selectedDestLoc.locNbr
									        	}
									        ];
			   }
				
			  if(!angular.equals({}, formattedRequest)){
				$http({	
					method: 'POST',
					url: './services/handbill/getHandRecord',
					data: formattedRequest
				 }).then(function(response) {
						 var handResponse = response.data.handRecordResponseList;
						 if(handResponse.length > 0){
							 handResponse.forEach(function(item){
								 $scope.LocStratGrid.data.push(item);
							 });
							 $scope.disableSubmitBtn = false;
						 }
					}, function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean != null){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
						 });
						 
		     }
		} else {
			if ($scope.page.type === 'DamageCredit'){
				var formattedRequest = {};
				if(fileData.length){
					var itemArr = [];
					fileData.forEach(function(item) {					
							itemArr.push({
								itmNbr : item[0], 
								qty : item[1],
								destNbr : $scope.selectedDestLoc.locNbr,
								valTyp : item[2],
								amnt : item[3]
							});
						});
				  formattedRequest.damageRecordRequestList = itemArr;
			  }
			  else if($scope.addItem && $scope.addQty){
				 formattedRequest.damageRecordRequestList = [
									        	{
													itmNbr : $scope.addItem, 
													qty : $scope.addQty,
													destNbr : $scope.selectedDestLoc.locNbr,
													valTyp : $scope.selectedValueTypeOption.valueTypeCode,
													amnt : $scope.amountEntered
									        	}
									        ];
			}
			if(!angular.equals({}, formattedRequest)){
				$http({	
					method: 'POST',
					url: './services/damagedcredit/getDamagedRecord',
					data: formattedRequest
				 }).then(function(response) {
						 var damagedResponse = response.data.damageRecordResponseList;
						 if(damagedResponse.length > 0){
							 
							 damagedResponse.forEach(function(itm){
								 itm.creditAmt = (itm.totalCost - itm.salvVal).toFixed(2);
								 $scope.LocStratGrid2.data.push(itm);
							 });
							 $scope.disableSubmitBtn = false;
						 }
				    }, function(error){
						 var exceptionInfoBean = error.data.exceptionInfoBean;
						 if (exceptionInfoBean != null){
						 	$scope.serviceCallError = exceptionInfoBean.errorText;
						 }
				    });
		    }
		   }
		 }}
		
			$scope.addItem='';
			$scope.addQty='';	
			$scope.amountEntered='';
			fileData = {};
			angular.element("input[type='file']").val(null);
			$scope.addButtonDisabled = true;
			$scope.initializeValueOptions();
	  }
		
	   /* Delete selected rows from the Grid */
	   $scope.deleteSelectedRows = function(){
		   $scope.resetSpreadsheetErrors();
		   $scope.fileAmtErrMsg = '';
		   $scope.fileDataErrMsg = '';
		   $scope.fileEmtyErrMsg = '';
		   $scope.fileHeaderValidErrorMsg ='';
		   if ($scope.page.type === 'DamageCredit'){
			   var selectedRows  = $scope.LocStratGrid2GridApi.selection.getSelectedRows(); 
			   selectedRows.forEach(function(item){
				   $scope.LocStratGrid2.data = $scope.LocStratGrid2.data.filter(function(data) {
					    return item.itm !== data.itm;
					});
			   });
			   $scope.LocStratGrid2GridApi.selection.clearSelectedRows();
		   } else {
				   var selectedRows  = $scope.LocStratGridApi.selection.getSelectedRows();
				   selectedRows.forEach(function(item){
					   $scope.LocStratGrid.data = $scope.LocStratGrid.data.filter(function(data) {
						   return item.itm !== data.itm;
					   });
				   });
			   $scope.LocStratGridApi.selection.clearSelectedRows();
		   }
		   $scope.showDelete = false;
		   if($scope.LocStratGrid.data.length > 0 || $scope.LocStratGrid2.data.length > 0){
				 $scope.disableSubmitBtn = false;
			}else{
				$scope.disableSubmitBtn = true;
				$scope.showDelete = false;
			}
	   }
			
		$scope.valueTypeArray=[];
		$scope.selectedValueTypeOption={};
		$scope.amountEntered={};
		
		$scope.initializeValueOptions= function(){
			$scope.selectedValueTypeOption.valueTypeSymbol = "%";
			$scope.selectedValueTypeOption.valueTypeCode = "P";
			$scope.amountEntered='';
			
		}
		
		$scope.LoadValueOptions= function(){
			   var loadValueOption = {};
		        loadValueOption.valueTypeSymbol = "$";
		        loadValueOption.valueTypeCode = "D";
		        $scope.valueTypeArray.push(loadValueOption);    
		        var loadValueOption = {};
		        loadValueOption.valueTypeSymbol = "%";
		        loadValueOption.valueTypeCode = "P";
		        $scope.valueTypeArray.push(loadValueOption);
		        $scope.initializeValueOptions();
		};
		
		$scope.loadPage = function(){
			$scope.genericServiceError ='';
			if ($scope.page.type === 'HandBill'){
				$scope.popHeader='Hand Bill';
				$scope.damageOptions = false;
				$scope.showType= false;
				$scope.showHandAdd=true;
				$scope.showClaimsAdd=false;
				$scope.showDamageAdd=false;
			} else {
				if ($scope.page.type === 'StoreClaims'){
					$scope.popHeader='Store Claims';
					$scope.damageOptions = false;
//					ADD PROCESS FOR ITYPE SERVICE HERE
				
					
					 var formattedRequest = {
							src : $scope.selectedSrcLoc.locNbr, 
							dest : $scope.selectedDestLoc.locNbr,
							req : $scope.enteredReqNbr
					};
					 
						$http({	
							method: 'PUT',
							url: './services/storeclaims/getInventoryType',
							data: formattedRequest
								}).then(
								function(response) {
							       $scope.inventoryTypes=response.data;
								}, 
								  function(error){
									 var exceptionInfoBean = error.data.exceptionInfoBean;
									 if (exceptionInfoBean){
									 	$scope.genericServiceError = exceptionInfoBean.errorText;
									 }
							    });
						
					
					$scope.showType= true;
					$scope.showHandAdd=false;
					$scope.showClaimsAdd=true;
					$scope.showDamageAdd=false;
				} else {
					if ($scope.page.type === 'DamageCredit'){
						$scope.popHeader='Damaged Credit';
						$scope.damageOptions = true;
						$scope.showType= false;
						$scope.showHandAdd=false;
						$scope.showClaimsAdd=false;
						$scope.showDamageAdd=true;
						$scope.LoadValueOptions();
					}
				}
			}
		}
		$scope.showHandAdd=false;
		$scope.showClaimsAdd=false;
		$scope.showDamageAdd=false;
		$scope.damageOptions = false;
		$scope.page = modal.selectedPage;
		$scope.selectedSrcLoc=modal.selectedSrcLoc;
		$scope.selectedDestLoc=modal.selectedDestLoc;
		$scope.enteredReqNbr=modal.enteredReqNbr;

		$scope.loadPage();
		
		
		
		
		/*Store Claims Popup Grid*/
		$scope.LocStratGrid = {
			    enableRowSelection: false,
			    enableSelectAll: false,
				enableSorting: true,
				paginationPageSizes: [100],
			    paginationPageSize: 100,
			    showGridFooter:true,
				enableColumnMenus: false,		
				columnDefs: [			
				  { field: 'itm',
					displayName: 'Item'
				  },
				  { field: 'itmDesc',
					displayName: 'Description'
				  },
				  { 
					field: 'qty',
					displayName: 'Quantity',
					cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
				          if (grid.getCellValue(row,col) < 0) {
				              return 'red';
				            }
				            return 'black';
				          },
					width: 80,
					enableColumnResizing: false
				  },			  
				  { field: 'totCost',
					displayName: 'Total Cost',
					cellFilter: 'number: 2',
				  }
				],
				multiSelect: true,
				onRegisterApi: function (gridApi) {
					$scope.LocStratGridApi = gridApi;
					$scope.LocStratGridApi.selection.on.rowSelectionChanged($scope,function(row){
						if ($scope.LocStratGridApi.selection.getSelectedRows().length > 0){
							$scope.showDelete = true;
						} else {
							$scope.showDelete = false;
						}
					});
	            },
				 data: []
		};	
		
		
		
		
		$scope.LocStratGrid2 = {
			    enableRowSelection: false,
			    enableSelectAll: false,
				enableSorting: true,
				paginationPageSizes: [100],
			    paginationPageSize: 100,
			    showGridFooter:true,
				enableColumnMenus: false,		
				columnDefs: [			
				  { field: 'itm',
					displayName: 'Item'
				  },
				  { field: 'itmDesc',
					displayName: 'Description'
				  },
				  { 
					field: 'qty',
					displayName: 'Quantity',
					cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
				          if (grid.getCellValue(row,col) < 0) {
				              return 'red';
				            }
				            return 'black';
				          },
					width: 80,
					enableColumnResizing: false
				  },			  
				  { 
					field: 'creditAmt',
					displayName: 'Credit Amount',
					cellFilter: 'number: 2'
				  }
				],
				multiSelect: true,
				onRegisterApi: function (gridApi) {
					$scope.LocStratGrid2GridApi = gridApi;
					$scope.LocStratGrid2GridApi.selection.on.rowSelectionChanged($scope,function(row){
						if ($scope.LocStratGrid2GridApi.selection.getSelectedRows().length > 0){
							$scope.showDelete = true;
						} else {
							$scope.showDelete = false;
						}
					});
	            },
				data: []
		};	
		
});
