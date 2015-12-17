angular.module('starter.controllers', ['ngOpenFB'])

.controller('InicialController', function($scope, $ionicSideMenuDelegate){
  $ionicSideMenuDelegate.canDragContent(false);
})

.controller('AppCtrl', function($http, $ionicModal, $timeout, ngFB, $scope, $rootScope, $window, $ionicHistory) {
  var viewController = this;

  viewController.loginData = {};

  this.login = function () {
    $http({
        url: 'http://104.236.49.84/api/v1/usuarios/entrar/',
        method: "POST",
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {login: viewController.loginData.username, senha: viewController.loginData.password},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then(function(response) {
            $window.location.href = "/#/app/mapa";
             console.log("sucesso") ;
        },
        function(response) { // optional
            alert("Usuários ou Senha Incorreto");
            console.log("fracassso") ;
            $window.location.href = "/#/app/login";
        }
    );
    console.log("Login user: " + viewController.loginData.username + "- PW: " + viewController.loginData.password);

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

.controller('CadastroController', function($scope, $ionicSideMenuDelegate,$window, $http){
  var viewController = this;
  $ionicSideMenuDelegate.canDragContent(false);
  viewController.data = {};

  this.cadastrar = function () {
    $http({
     url: 'http://104.236.49.84/api/v1/usuarios/criar/',
     method: "POST",
     data: {usuario: viewController.data.username, email: viewController.data.email, senha: viewController.data.password},
     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     })
     .then(function(response) {
             $window.location.href = "/#/app/login";
         },
         function(response) { // optional
             $window.location.href = "/#/app/cadastrar";
         }
     );
     //  $window.localStorage['usuario'] = JSON.stringify(viewController.data);
    //  $window.location.href = '/#/app/login';
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
.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation, NgMap,$state, $ionicModal) {
   var vm = this;
   vm.data = {};
  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });
   $ionicModal.fromTemplateUrl('templates/addlocalizacao.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function(modal) {
     $scope.modal = modal
   })
  vm.centerOnMe = function () {
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
          $scope.map.zoom = 18;
         $ionicLoading.hide();
     }, function(error) {
       alert('Erro ao tentar conseguir localização: ' + error.message);
      $ionicLoading.hide();
     });
  };

  // geo-coding
  vm.placeChanged = function($state) {
    vm.place = this.getPlace();
    console.log('location', vm.place.geometry.location);
    vm.map.setCenter(vm.place.geometry.location);
    $scope.clearSearch();
  }

  $scope.clearSearch = function() {
    vm.address = '';
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
  vm.addMarker = function(event) {
   vm.positions.push({pos:[$scope.newLocation.lat, $scope.newLocation.lng, vm.data.choise]});
   $scope.modal.hide();
   console.log($scope.Locatio);

 }

  NgMap.getMap().then(function(map) {
    vm.map = map;
  });
});
