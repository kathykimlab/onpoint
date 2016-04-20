angular.module('app.constants', [])

//just using strings for clarity/testing purposes. feel free to change to integers.
.constant('CARD', {
  TYPE: {
    'ACTION':'action',
    'URGENT':'urgent',
    'REMINDER':'reminder'},
  CATEGORY: {
    'MEDICATIONS_SCHEDULE': 'medications_schedule',
    'MEASUREMENTS_SCHEDULE': 'measurements_schedule',
    'APPOINTMENTS_SCHEDULE': 'appointments',
    'GOALS': 'goals',
    'SYMPTOMS_SCHEDULE': 'symptoms_schedule'},
  TIMESPAN: {
    'GET_CURRENT_PAST': 6,
    'GET_CURRENT_FUTURE': 6,
    'GET_UPCOMING_FUTURE' : 12
  }
})

.constant('TIPS',  [{
        measurement: "Weight",
        tips: []
      }, {
        measurement: "Blood Pressure",
        tips: ["Be still.",
               "Make sure you haven't had any caffeine, tobacco, or exercise in the last 30 minutes",
               "Wait one minute before taking another measurement",
               "Make sure you are sitting down, with your back supported by a chair and your feet on the floor"]
      }, {
        measurement: "Heart Rate",
        tips: []
      }]
)
