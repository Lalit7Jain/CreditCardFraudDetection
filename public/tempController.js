(function (){
	angular
        .module("productCustomizer")
        .controller("MainController", MainController);

       function MainController($scope){
       	$scope.data = 'This is shown';
       }
})