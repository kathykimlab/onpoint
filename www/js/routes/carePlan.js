angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('carePlan', {
    url: '/careplan',
    templateUrl: 'templates/carePlan.html',
    abstract: true
  })


  .state('carePlan.setup', {
    url: '/setup',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/setup.html',
        controller: 'carePlanCtrl'
      }
    }
  })

  .state('carePlan.measurement-add', {
    url: '/measurement_schedule/new',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/new_measurement_schedule.html',
        controller: 'measurementScheduleCtrl'
      }
    }
  })

  .state('carePlan.measurementSchedules', {
    url: '/measurement_schedules',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/measurement_schedules.html',
        controller: 'measurementScheduleCtrl'
      }
    }
  })


  .state('carePlan.medicationSchedules', {
    url: '/input_list',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/medication_schedules.html',
        controller: 'medListCtrl'
      }
    }
  })

  .state('carePlan.newMedication', {
    url: '/medications/new',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/new_medication.html',
        controller: 'medInputCtrl'
      }
    }

  })


});
