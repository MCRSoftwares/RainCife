angular.module('starter.controllers', ['ngOpenFB'])
.controller('InicialController', function($scope, $ionicSideMenuDelegate){
  $ionicSideMenuDelegate.canDragContent(false);
  $ionicMaterialConfigProvider.enableForAllPlatforms();
})
.controller('AppCtrl', function($http, $ionicModal, $timeout, ngFB, $scope, $rootScope, $window, $ionicHistory,$state) {
  var viewController = this;
  viewController.loginData = {};
  this.login = function () {
    $http({
        url: 'http://104.236.49.84/api/v1/usuarios/entrar/',
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {login: viewController.loginData.username, senha: viewController.loginData.password},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then(function(response) {
            $window.localStorage['usuario'] = response.data.data[0].id;
            $state.go('app.mapa');
             console.log("sucesso") ;
        },
        function(response) { // optional
            console.log("fracassso") ;
            alert('Usuário ou Senha Invalidos');
            $state.go('app.login');
            //$window.location.href = "/#/app/login";
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
                        //$window.location.href = '/#/app/mapa';
                        $state.go('app.mapa');
                    },
                    function (error) {
                        console.log('Facebook error: ' + error.error_description);
                    });
            } else {
                alert('Ops, aconteceu algum quando você tentou logar com o Facebook');
            }
        });
  };
})
.controller('CadastroController', function($scope, $ionicSideMenuDelegate,$window, $http, $state,  $ionicModal){
  var viewController = this;
  $ionicSideMenuDelegate.canDragContent(false);
   $ionicModal.fromTemplateUrl('templates/termoDeUso.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function(modal) {
     $scope.modal = modal
   })
  viewController.data = {};
  this.cadastrar = function () {
    $http({
     url: 'http://104.236.49.84/api/v1/usuarios/criar/',
     method: "POST",
     data: {usuario: viewController.data.username, email: viewController.data.email, senha: viewController.data.password},
     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     })
     .then(function(response) {
            // $window.location.href = "/#/app/login";
             $state.go('app.login');
         },
         function(response) { // optional
             //$window.location.href = "/#/app/cadastrar";
             alert("Cadastro invalido")
             $state.go('app.cadastro');
         }
     );
  }
})
.controller("LogoutController", function($timeout, $ionicLoading, $ionicHistory, $rootScope, $window){

    $timeout(function () {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $window.localStorage['usuario'] = "";
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        }, 30);
        $rootScope.user = {};
})


.controller("previCtrl", function($scope, $ionicLoading, $cordovaGeolocation, $state, $http){
  var prev = this;
  prev.isao =[
 ];

  $http.get("http://api.openweathermap.org/data/2.5/weather?lat=-8.05389&lon=-34.881111&appid=2de143494c0b295cca9337e1e96b00e0'")
  .success(function(response){
       for (var i = 0; i < response.data.length; i++) {
         prev.isao.push({temperatura:parseFloat(response.data[i].temp), tempeaturaMinima: parseFloat(response.data[i].temp_min), tempMaxima: parseFloat(response.data[i].temp_max), tempo:[response.data[i].weather] });
       }
    })
    .error(function(response){
    });
    console.console.log(prev.isao);
})

//controler do mapa
.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation, NgMap,$state, $ionicModal,$http, $window) {
   var vm = this;
   vm.data = {};

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
     vm.loadMarker();
  });
   $ionicModal.fromTemplateUrl('templates/addlocalizacao.html', {
     scope: $scope,
     animation: 'slide-in-up'
   }).then(function(modal) {
     $scope.modal = modal
   })

   var ws = new WebSocket("ws://104.236.49.84/api/v1/marcadores/socket/");
   console.log(ws)
   ws.onmessage = function(message) {
       vm.loadMarker();
   }
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
    if (event != undefined) {
      var ll = event.latLng;
      $scope.newLocation = new Location();
      $scope.newLocation.lat = ll.lat();
      $scope.newLocation.lng = ll.lng();
      $scope.modal.show();
    }
};
  vm.addMarker = function(event) {
    vm.intensidade;

    $http({
     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
     url: 'http://104.236.49.84/api/v1/marcadores/criar/',
     method: "POST",
     data: {latitude: String($scope.newLocation.lat),
     intensidade: vm.intensidade,
     usuario_id: String($window.localStorage['usuario']),
     longitude: String($scope.newLocation.lng)}
     })
   $scope.modal.hide();
 };
 vm.showDetail = function(e, positions) {
   vm.position = positions;
   vm.map.showInfoWindow.apply('marker-info', '');
 };
 vm.loadMarker = function() {
   $http.get("http://104.236.49.84/api/v1/marcadores/")
   .success(function(response){
       vm.positions = []
        for (var i = 0; i < response.data.length; i++) {
          vm.positions.push({pos:[parseFloat(response.data[i].latitude), parseFloat(response.data[i].longitude)]});
        }
     })
     .error(function(response){
     });
 };
  NgMap.getMap().then(function(map) {
    vm.map = map;
  });
});
