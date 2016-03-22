angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();

  $scope.hasTaken = function(med_id, slot) {
    now = new Date().toDateString();
    return MedicationHistory.hasTaken(med_id, slot, now);
    /*
    var i = MedicationHistory.find(med_id, slot, now);
    if (i !=null) {
      if(MedicationHistory.taken(i)) {
        return true;
      }
    }
    return false;
    */
  }

  $scope.hasSkipped = function(med_id, slot) {
    now = new Date().toDateString();
    return MedicationHistory.setColor(med_id, slot, now);
    /*
    now = new Date().toDateString();
    var i = MedicationHistory.find(med_id, slot, now);
    if (i !=null) {
      if (MedicationHistory.skipped(i)) {
        return 'grey';
      }
    }
    return 'black';
    */
  }
})

.controller("medicationScheduleCtrl", function($scope, $stateParams, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);

  $scope.hasTaken = function(med_id, slot) {
    now = new Date().toDateString();
    return MedicationHistory.hasTaken(med_id, slot, now);
    /*
    var i = MedicationHistory.find(med_id, slot, now);
    if (i !=null) {
      if(MedicationHistory.taken(i)) {
        return true;
      }
    }
    return false;
    */
  }

  $scope.hasSkipped = function(med_id, slot) {
    now = new Date().toDateString();
    return MedicationHistory.setColor(med_id, slot, now);
    /*
    now = new Date().toDateString();
    var i = MedicationHistory.find(med_id, slot, now);
    if (i !=null) {
      if (MedicationHistory.skipped(i)) {
        return 'grey';
      }
    }
    return 'black';
    */
  }

})
.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);


  $scope.take = function(med_id, slot, med_name) {
    var now = new Date();
    var i = MedicationHistory.find(med_id, slot, now.toDateString());
    if (i != null) {  
      MedicationHistory.update(i,'taken_at', now);
    } else {
      MedicationHistory.add(med_id, now.toDateString(), slot, now, null);
    }
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'You have succesfully taken ' + med_name
    });

    alertPopup.then(function(res) {
      $ionicHistory.goBack(); //calling back button manually.
    });
  }

  $scope.skip = function(med_id,slot, med_name)  {
  var now = new Date();
  var myPopup = $ionicPopup.show({
    subTitle: 'Are you sure you want to skip ' + med_name,
    scope: $scope,
    buttons: [
      { text: 'No'
      },
      {
        text: '<b>Yes</b>',
        onTap: function(e) {
          MedicationHistory.add(med_id, now.toDateString(), slot, null, now);
          $ionicHistory.goBack(); //calling back button manually.
        }
      }
    ]
  });
 };
})
