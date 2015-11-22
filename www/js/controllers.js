angular.module('starter.controllers', [])

.controller('AppCtrl', function($http) {
  var viewController = this;
  viewController.loginData = {};

  this.login = function () {
    //TODO
    //$http.post('/url do servidor', viewController.loginData.username, viewController.loginData.password)
    //.then(function(){
    //  redirectTo: "Url da página principal";
    //}, function(){
    //      redirectTo: "/login";
    //})
    console.log("Login user: " + viewController.loginData.username + "- PW: " + viewController.loginData.password);
  };
})

.controller('CadastroController', function(){
  var viewController = this;
  viewController.data = {};

  this.cadastrar = function () {
    //TODO
    //$http.post('/url do servidor', viewController.data.username, viewController.data.email, viewController.data.password)
    //.then(function(){
    //  redirectTo: "/login";
    //}, function(){
    //      redirectTo: "/cadastro";
    //})
  }
})

.controller("LogoutController", function($timeout, $ionicLoading, $ionicHistory){

    $timeout(function () {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        }, 30);
})

//controler para buscar a geolocalizção Atual do Usuário
.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation) {
  $scope.centerOnMe = function () {
    $scope.loading = $ionicLoading.show({
      content: 'Buscando Localização Atual...',
      showBackdrop: false
    });
    //se não conseguir acessar a geolocalização em 10 segundos ele "estoura" o tempo e dá erro.
      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation
       .getCurrentPosition(posOptions)
       .then(function (position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         $scope.map.setCenter(new google.maps.LatLng(lat, long));
         $scope.loading.hide();
     }, function(error) {
       alert('Erro ao tentar conseguir localização: ' + error.message);
     });
  };
});
