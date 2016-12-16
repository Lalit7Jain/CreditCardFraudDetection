(function(){
    angular
        .module("productCustomizer")
        .controller("sampleDataController", sampleDataController);

    function sampleDataController($scope, $http){    
     var classification_result = [];
	 $scope.Time=0;
	 $scope.V1=1.191857111;
	 $scope.V2=0.266150712;
	 $scope.V3=0.166480113;
	 $scope.V4=0.448154078;
	 $scope.V5=0.060017649;
	 $scope.V6=-0.082360809;
	 $scope.V7=-0.078802983;
	 $scope.V8=0.085101655;
	 $scope.V9=-0.255425128;
	 $scope.V10=-0.166974414;
	 $scope.V11=1.612726661;
	 $scope.V12=1.065235311;
	 $scope.V13=0.489095016;
	 $scope.V14=-0.143772296;
	 $scope.V15=0.635558093;
	 $scope.V16=0.463917041;
	 $scope.V17=-0.114804663;
	 $scope.V18=-0.18336127;
	 $scope.V19=-0.145783041;
	 $scope.V20=-0.069083135;
	 $scope.V21=-0.225775248;
	 $scope.V22=-0.638671953;
	 $scope.V23=0.101288021;
	 $scope.V24=-0.339846476;
	 $scope.V25=0.167170404;
	 $scope.V26=0.125894532;
	 $scope.V27=-0.008983099;
	 $scope.V28=0.014724169;
	 $scope.Amount=2.69;
	 $scope.Class=0;

	 $scope.custom=true;
	 $scope.toggleCustom=function(){
		 
		 $scope.custom= $scope.custom ===false? true: false;
	 };
      $scope.predict = function() {      	
      	var d = {
                    "Inputs": {
                        "input1": {
                            "ColumnNames": [
                               "Time",
						        "V1",
						        "V2",
						        "V3",
						        "V4",
						        "V5",
						        "V6",
						        "V7",
						        "V8",
						        "V9",
						        "V10",
						        "V11",
						        "V12",
						        "V13",
						        "V14",
						        "V15",
						        "V16",
						        "V17",
						        "V18",
						        "V19",
						        "V20",
						        "V21",
						        "V22",
						        "V23",
						        "V24",
						        "V25",
						        "V26",
						        "V27",
						        "V28",
						        "Amount",
						        "Class"
                              ],
                            "Values": [
                                [   $scope.Time,
                                	$scope.V1,
									$scope.V2,
									$scope.V3,
									$scope.V4,
									$scope.V5,
									$scope.V6,
									$scope.V7,
									$scope.V8,
									$scope.V9,
									$scope.V10,
									$scope.V11,
									$scope.V12,
									$scope.V13,
									$scope.V14,
									$scope.V15,
									$scope.V16,
									$scope.V17,
									$scope.V18,
									$scope.V19,
									$scope.V20,
									$scope.V21,
									$scope.V22,
									$scope.V23,
									$scope.V24,
									$scope.V25,
									$scope.V26,
									$scope.V27,
									$scope.V28,
									$scope.Amount,
									$scope.Class
                                ]
                            ]
                        }
                    },
                    "GlobalParameters": {}
                };
                console.log(d);                
                $http.post('/test', d)                
                    .then(function(response){
                    	console.log(response);
                        var result = JSON.parse(response.data);
                        
                        result = result.Results.output1.value.Values;
                        for (var i = 0; i < result.length; i++) {
                            classification_result.push({
                                'actual': result[i][0],                                
                                'predicted': result[i][1]
                            });
                        }
                        $scope.classification_results = classification_result;                        
                });
      }
    }
})();