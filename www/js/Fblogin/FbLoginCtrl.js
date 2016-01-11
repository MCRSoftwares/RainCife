angular.module('starter.FbCtrl', ['ngOpenFB'])
.controller('AppCtrl', function($http, $ionicModal, $timeout, ngFB, $scope, $rootScope, $window, $ionicHistory) {
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
            $window.location.href = "/#/app/mapa";
             console.log("sucesso") ;
        },
        function(response) { // optional
            console.log("fracassso") ;
            $window.location.href = "/#/app/login";
        }
    );
    console.log("Login user: " + viewController.loginData.username + "- PW: " + viewController.loginData.password);

  }};
