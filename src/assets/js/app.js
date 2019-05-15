'use strict';

/* App Module */

var tslApp = angular.module('tslApp', [
    'ngRoute', 'ngMaterial', 'ui.grid.autoFitColumns', 'ui.grid.resizeColumns','tslNumDirective','tslDecimalDirective',
    'ngLoadingSpinner','ui.grid','ui.grid.selection','ui.grid.pagination','AboutUsHeadController',
    'ContactUSHeadController','HomeControllers','ReportHEADController', 'ItemAdjustmentController',
    'UserDetailsHeadController', 'AddClaimsPopupController','DetailPopUpController', 'ngSanitize', 'tslDirective',
]);

tslApp.config(['$httpProvider', 
                function($httpProvider) {
                   
$httpProvider.defaults.cache = false;
if (!$httpProvider.defaults.headers.get) {
  $httpProvider.defaults.headers.get = {};
}

$httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
$httpProvider.defaults.headers.common.Pragma = "no-cache";
}]);

tslApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

tslApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        	when('/', {
        		templateUrl : 'partials/Home.html',
            	controller : 'HomeController'
        	}).when('/scpiam?', {
        		templateUrl : 'partials/Home.html',
            	controller : 'HomeController'
        	}).when('/home?', {
	            templateUrl : 'partials/Home.html',
	            controller : 'HomeController'	        
	        });

        $locationProvider.html5Mode(true);
}]);

