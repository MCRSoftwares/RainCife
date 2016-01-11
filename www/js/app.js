// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMap','ngCordova', 'ngOpenFB','starter.service',])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '1643726282551336'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.xsrfCookieName = '_xsrf';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.inicial', {
    url: '/inicial',
    views: {
      'menuContent': {
        templateUrl: 'templates/inicial.html',
        controller: 'CadastroController as Cadastro'

      }
    }
  })

  .state('app.bug', {
      url: '/bug',
      views: {
        'menuContent': {
          templateUrl: 'templates/bug.html'
        }
      }
    })
    .state('app.sobre', {
        url: '/sobre',
        views: {
          'menuContent': {
            templateUrl: 'templates/sobre.html'
          }
        }
      })
    .state('app.mapa', {
      url: '/mapa',
      views: {
        'menuContent': {
          templateUrl: 'templates/mapa.html',
          controller: 'MapCtrl as vm'
        }
      }
    })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'AppCtrl as App'
        }
      }
    })

    .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: 'templates/inicial.html',
          controller: 'LogoutController as Logout'
        }
      }
    })
  .state('app.cadastro', {
    url: '/cadastro',
    views: {
      'menuContent': {
        templateUrl: 'templates/cadastro.html',
        controller: 'CadastroController as Cadastro'
      }
    }
  })
  .state('app.previsao', {
    url: '/previsao',
    views: {
      'menuContent': {
        templateUrl: 'templates/previsao.html',
        controller: 'previCtrl as prev'
      }
    }
  })
  .state('app.addlocalizacao', {
    url: '/addlocalizacao',
    views: {
      'menuContent': {
        templateUrl: 'templates/addlocalizacao.html',
        controller: 'MapCtrl as vm'
      }
    }
  }
);
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/inicial');
});
