angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($http, $ionicModal, $timeout, ngFB, $scope, $rootScope, $window) {
  var viewController = this;
  viewController.loginData = {};

  this.login = function () {
    //TODO
    //$http.post('/url do servidor', viewController.loginData.username, viewController.loginData.password)
    //.then(function(){
    //  $window.location.href = "Url da página principal";
    //}, function(){
    //      $window.location.href = "/#/app/login";
    //})
    console.log("Login user: " + viewController.loginData.username + "- PW: " + viewController.loginData.password);
  };

  this.fbLogin = function () {
    ngFB.login({scope: 'public_profile, '}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name'}
                }).then(
                    function (user) {
                        $rootScope.user = user;
                        $window.location.href = '/#/app/mapa';
                    },
                    function (error) {
                        console.log('Facebook error: ' + error.error_description);
                    });
            } else {
                alert('Facebook login failed');
            }
        });
  };
})

.controller('CadastroController', function($window){
  var viewController = this;
  viewController.data = {};

  this.cadastrar = function () {
    //TODO
    //$http.post('/url do servidor', viewController.data.username, viewController.data.email, viewController.data.password)
    //.then(function(){
    //  $window.location.href = "/#/app/login";
    //}, function(){
    //      $window.location.href = "/#/app/cadastro";
    //})
  }
})

.controller("LogoutController", function($timeout, $ionicLoading, $ionicHistory, $rootScope){

    $timeout(function () {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        }, 30);
    $rootScope.user = {};
})

//controler para buscar a geolocalizção Atual do Usuário
.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation, $rootScope) {
  alert("Bem vindo ao RainCife " + $rootScope.user.name);
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
