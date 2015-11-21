angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
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
