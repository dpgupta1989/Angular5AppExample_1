
var DetailPopUpControllers = angular.module('DetailPopUpController', []);

DetailPopUpControllers.controller('DetailPopUpController' ,function($scope,$http,$rootScope,$mdDialog,$routeParams,modal,$interval,$filter,$element) {
		
	   $scope.close = function(){
		   $element.remove();
		}; 
		
		$scope.loadPage = function(seqNbr){
			var formattedRequest = {
					seqNbr : seqNbr						
			};
			 
				$http({	
					method: 'POST',
					url: './services/sharedutil/searchDetailRecord',
					data: formattedRequest
						}).then(
						function(response) {
							$scope.searchDetailResponse=response.data;	
							$scope.searchDetailResponse=$scope.searchDetailResponse.searchDetailRecordResponseList;	
							
							$scope.searchDetailResponse.forEach(function(itm){
								 itm.creditAmt = parseFloat((itm.totCost - itm.salvVal).toFixed(2));
							 });
							
					    },
						function(error){
							 var exceptionInfoBean = error.data.exceptionInfoBean;
							 if (exceptionInfoBean){
							 	$scope.serviceCallError = exceptionInfoBean.errorText;
							 }
					    });
			
		}
		
		$scope.page = modal.selectedPage;
		
		console.log($scope.page.type);
		
		$scope.showDamagedDetail=false;
		
		if($scope.page.type=='DamageCredit'){
			$scope.showDamagedDetail=true;
		};
		
		$scope.seqNbr=modal.seqNbr;

		$scope.loadPage($scope.seqNbr);
		
		$scope.orderDetailDamagedCreditDetailsGrid = {
				 enableRowSelection: false,
				    enableSelectAll: false,
					enableSorting: true,
					paginationPageSizes: [100],
				    paginationPageSize: 100,
				    showGridFooter:true,
					enableColumnMenus: false,		
					isRowSelectable: function(row) {

							
						if($scope.userEditAccessState || $scope.userDeleteAccessState)
						{
				        	return true;
						} else{
							return false;
						}
				          
					},		
				columnDefs: [			
				  { field: 'itm',
					displayName: 'Item',
					width: 130,
					enableColumnResizing: false

				  },
				  { field: 'qty',
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
				  { field: 'creditAmt',
					displayName: 'Total Credit',
					cellFilter: 'number: 2',
					width: 100,
					enableColumnResizing: false

				  },
				  { field: 'addDt',
					displayName: 'Add Date',
					width : 110,
					enableColumnResizing: false

				  }

				],
				 data: 'searchDetailResponse'
		};
		
		
		$scope.orderItemDetailsGrid = {
				 enableRowSelection: false,
				    enableSelectAll: false,
					enableSorting: true,
					paginationPageSizes: [100],
				    paginationPageSize: 100,
				    showGridFooter:true,
					enableColumnMenus: false,		
					isRowSelectable: function(row) {

							
						if($scope.userEditAccessState || $scope.userDeleteAccessState)
						{
				        	return true;
						} else{
							return false;
						}
				          
					},		
				columnDefs: [			
				  { field: 'itm',
					displayName: 'Item',
					width: 130,
					enableColumnResizing: false

				  },
				  { field: 'qty',
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
					width: 100,
					enableColumnResizing: false

				  },
				  { field: 'addDt',
					displayName: 'Add Date',
					width : 110,
					enableColumnResizing: false

				  }

				],
				 data: 'searchDetailResponse'
		};
});
