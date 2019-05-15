
tslApp.factory('modal', ['$compile', '$rootScope','$q','$http', function ($compile, $rootScope,$q,$http) {
  	 
	
	 return {
		UserDetails : '',
		selectedRecord : ' ',
		LocationArray :' ',
		ProductGrpArray :' ',
		
		
        getModal: function() { 
        	var elm;
        	var modal = {
        	open: function() {
 
            var html = '<div ng-include src="\'partials/custom/addClaimsPopup.html\'"></div>';
            	
        elm = angular.element(html);
        angular.element(document.body).prepend(elm);
 
        $rootScope.close = function() {
          modal.close();
        };
        $rootScope.modalStyle = {"display": "block"};
 
        $compile(elm)($rootScope);
      },
      close: function() {
        if (elm) {
          elm.remove();
        }
      }
    };
 
    return modal;
    },
    getDetailModal: function() { 
    	var elm;
    	var modal = {
    	open: function() {

        var html = 
         	'<div ng-include src="\'partials/custom/detailPopUp.html\'"></div>';

    elm = angular.element(html);
    angular.element(document.body).prepend(elm);

    $rootScope.close = function() {
      modal.close();
    };
    //$rootScope.noCustomerOrderDetailsAvailable = false;
    $rootScope.modalStyle = {"display": "block"};

    $compile(elm)($rootScope);
  },
  close: function() {
    if (elm) {
      elm.remove();
    }
  }
};

return modal;
},


    
	
    
	 getEditModal: function() { 
     	var elm;
     	var modal = {
     	open: function() {

         var html = 
         	'<div ng-include src="\'partials/EDIT.html\'"></div>';
         	
     elm = angular.element(html);
     angular.element(document.body).prepend(elm);

     $rootScope.close = function() {
       modal.close();
     };
     $rootScope.modalStyle = {"display": "block"};

     $compile(elm)($rootScope);
   },
   close: function() {
     if (elm) {
       elm.remove();
     }
   }
 };

 return modal;
 }   
    
  };
  
  
  
  
}]);