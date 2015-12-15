angular.module('starter.controllers', ['ngOpenFB'])

.controller('InicialController', function($scope, $ionicSideMenuDelegate){
  $ionicSideMenuDelegate.canDragContent(false);
})

.controller('AppCtrl', function($http, $ionicModal, $timeout, ngFB, $scope, $rootScope, $window, $ionicHistory) {
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

    //Local Storage temporário, APAGAR!!
    var usuario = JSON.parse($window.localStorage['usuario'] || '{}');

    if (viewController.loginData.username == usuario.username && viewController.loginData.password == usuario.password){
    // não acho intuitivo colocar um alerta para das as boa   alert("Bem vindo " + usuario.username);
      $window.location.href = '/#/app/mapa';
    }else{
      alert("Usuários ou Senha Incorreto");
      $window.location.href = '/#/app/login';
    }
    //Local Storage temporário, APAGAR!!

  };

  //Recomendo fazer um controller separado pro login com o Facebook
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

.controller('CadastroController', function($scope, $ionicSideMenuDelegate,$window){
  var viewController = this;
  $ionicSideMenuDelegate.canDragContent(false);
  viewController.data = {};

  this.cadastrar = function () {
    //TODO
    //$http.post('/url do servidor', viewController.data.username, viewController.data.email, viewController.data.password)
    //.then(function(){
    //  $window.location.href = "/#/app/login";
    //}, function(){
    //      $window.location.href = "/#/app/cadastro";
    //})
    $window.localStorage['usuario'] = JSON.stringify(viewController.data);
    $window.location.href = '/#/app/login';
  }
})

//<<<<<<< HEAD
.controller("LogoutController", function($timeout, $ionicLoading, $ionicHistory, $rootScope){

    $timeout(function () {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        }, 30);
    $rootScope.user = {};
})

//||||||| merged common ancestors
//=======

//>>>>>>> 0061b48d72272ea91cf6c91a062a4dba8b4ce792
//controler para buscar a geolocalizção Atual do Usuário
.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation, NgMap,$state, $ionicModal) {
   var vm = this;
  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

  //

   $ionicModal.fromTemplateUrl('templates/addlocalizacao.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function(modal) {
     $scope.modal = modal
   })

  vm.centerOnMe = function () {
    console.log("to aqui");
    $scope.loading = $ionicLoading.show({
        templateUrl:"templates/loading.html",
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
         $ionicLoading.hide();
     }, function(error) {
       alert('Erro ao tentar conseguir localização: ' + error.message);
     });
  };

  // geo-coding
  vm.placeChanged = function($state) {
    vm.place = this.getPlace();
    console.log('location', vm.place.geometry.location);
    vm.map.setCenter(vm.place.geometry.location);
  }
  vm.positions =[

 ];


 var Location = function() {
       if ( !(this instanceof Location) ) return new Location();
       this.lat  = "";
       this.lng  = "";
       this.estado = "";
     };



vm.addlocalizacao = function(event){
  var ll = event.latLng;
  $scope.newLocation = new Location();
  $scope.newLocation.lat = ll.lat();
  $scope.newLocation.lng = ll.lng();
  $scope.modal.show();
 }

vm.pouco= function(){
  $scope.newLocatio.estado = "Pouco alagado"
}
vm.alagado= function(){
  $scope.newLocatio.estado = "Alagado"
}
vm.muito= function(){
  $scope.newLocatio.estado = "Muito alagado"
}
  vm.addMarker = function(event) {
   vm.positions.push({pos:[$scope.newLocation.lat, $scope.newLocation.lng]});
   $scope.modal.hide();
   console.log($scope.Locatio);

 }

  NgMap.getMap().then(function(map) {
    vm.map = map;
  });
});
