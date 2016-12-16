/**
 * Created by Lalit on 6/18/2016.
 */
(function(){
    angular
        .module("productCustomizer")
        .config(Config);

    function Config($routeProvider){
        $routeProvider
            .when("/", {
                templateUrl: "temp.html"
            })
            .when("/liveData", {
                templateUrl: "liveData.html",
                controller: "liveDataController"
            })
            .when("/sampleData", {
                templateUrl: "sampleData.html",
                controller: "sampleDataController"
            })
            .otherwise({
                redirectTo: "/"
            });
    }
})();