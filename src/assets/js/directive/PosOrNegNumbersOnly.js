var tslDirectives = angular.module('tslDirective', []);
tslDirectives.directive('posOrNegNumbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
   
            function fromUser(text) {
            	var transformedInput = "";
            	var transformedInputPart1 = "";
            	var transformedInputPart2 = "";
            	
                if (text) {
                	if (scope.page.type == 'StoreClaims'){
                		// allow pos and neg numbers for store claims and handbill
                		if (text.substring(0,1) == "-"){
                			transformedInputPart1 = text.substring(0,1);
                			transformedInputPart2 = text.substring(1);
                			transformedInputPart2 = text.replace(/[^0-9]/g, '');
                		} else {
                			transformedInputPart2 = text.replace(/[^0-9]/g, '');
                		}
                
                		transformedInput = transformedInputPart1 + transformedInputPart2;
                	} else {
                		if (scope.page.type == 'DamageCredit' || scope.page.type == 'HandBill'){
                			// allow only pos numbers for damaged credit
                			 var transformedInput = text.replace(/[^0-9]/g, '');
                		}
                	}

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});