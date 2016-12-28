angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/medication_scheduling/welcome')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('medication_scheduling', {
    url: '/medication_scheduling',
    templateUrl: 'templates/medication_scheduling/menu.html',
    abstract: true
  })
  .state('medication_scheduling.welcome', {
    url: '/welcome',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_scheduling/welcome.html',
      }
    }
  })
  .state('medication_scheduling.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_scheduling/start.html',
        controller: 'medicationSchedulingCtrl'
      }
    }
  })
});
