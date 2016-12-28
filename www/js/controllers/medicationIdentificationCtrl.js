angular.module('app.controllers')
.controller('newMedicationCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $templateCache, $ionicPopover, Medication, $firebaseObject) {
    $scope.medications = Medication.getDefaultMedications();
    $scope.medication = {};

    $scope.medSelected = function(med) {
      console.log($scope.medication)
      $scope.medication.dose = med.dose;
      $scope.medication.instructions = med.instructions;
      $scope.medication.purpose = med.purpose;
      $scope.medication.notes = med.notes
      console.log(med)
      console.log("inside med selected ");
    }

    var displayAlert = function(message) {
      var myPopup = $ionicPopup.show({
        title: "Invalid input",
        subTitle: message,
        scope: $scope,
        buttons: [{text: 'OK'}]
      });
    }

    $scope.hasRequiredAttributes = function() {
      if (!$scope.medication.name)
        return false;
      if (!$scope.medication.dose)
        return false;
      if (!$scope.medication.instructions)
        return false;
      if (!$scope.medication.purpose)
        return false;
      return true
    }

    $scope.save = function(firebaseRecord){
      if (!$scope.medication.name)
        displayAlert("Medication name can't be blank");
      else if (!$scope.medication.dose)
        displayAlert("Dosage can't be blank");
      else if (!$scope.medication.instructions)
        displayAlert("Instructions can't be blank");
      else if (!$scope.medication.purpose)
        displayAlert("Purpose can't be blank");
      else {
        firebaseRecord = {}
        firebaseRecord["trade_name"]   = $scope.medication.name.trade_name
        firebaseRecord['instructions'] = $scope.medication.instructions
        firebaseRecord['dose'] = $scope.medication.dose
        firebaseRecord['purpose'] = $scope.medication.purpose
        firebaseRecord['notes'] = typeof($scope.medication.notes)==='undefined' ? null : $scope.medication.notes;
        firebaseRecord['user_input'] =  true

        Medication.get().$add(firebaseRecord).then(function(response) {
          console.log(response)
          $ionicHistory.goBack(-2)
        }, function(response) {
          console.log("Error")
          console.log(response)
        })
      }
    };


})

// TODO: Implement once we have RxNorm. See #516
.controller('medicationSearchCtrl', function($scope, $state, $ionicPopup, $templateCache, $ionicPopover, Medication) {
    // $scope.medications = Medication.get();
    $scope.medication = {};
    $scope.params = {};

    $scope.search = function() {
      $scope.locations     = []
      $scope.state.loading = true
      Medicat.search($scope.params.search).then(function(response) {
        $scope.locations = response.data.locations
      }, function(response) {
        $scope.$emit(onpoint.env.error, {error: response})
      }).finally(function() {
       $scope.state.loading = false;
      });
    }


})


.controller('medicationViewCtrl', function($scope, $state, $stateParams, Medication) {
   $scope.medication = Medication.getById($stateParams.id);
   $scope.removeMedication = function() {
     $scope.medication.$remove().then(function(response) {
       $state.go("medication_identification.start")
     }, function(response) {
       $scope.$emit(onpoint.env.error, {error: response})
     })

   }
})


.controller('medicationsListCtrl', function($scope, $state, Patient, Medication, MedicationSchedule) {
   $scope.scheduledMedications = Medication.get();
   console.log($scope.scheduledMedications)

   $scope.completeMedicationIdentification = function() {
     var medicationIdRef = Patient.ref().child('medication_identification');
     medicationIdRef.set({'completed':true}).then(function(response) {
       $state.go("medication_scheduling.welcome")
     })
   }

   $scope.scheduledMeds = function() {
     for(var i = 0; i <$scope.scheduledMedications.length; i++ ) {
       if($scope.scheduledMedications[i].user_input)
        return true
     }
     return false
   }

   $scope.disableGenerate = function() {
     for(var i = 0; i <$scope.scheduledMedications.length; i++ ) {
       if(!$scope.scheduledMedications[i].user_input) {
         console.log("yo")
        return true
      }
     }
     return false
   }

   //Saving State of onboarding progress into firebase
   $scope.$on('$ionicView.beforeEnter', function(){
     var ref = Patient.ref();
     var req = ref.child('onboarding').update({'state':$state.current.name})
    });
})


.controller('medFillMainCtrl', function($scope, $state, $ionicHistory, MedicationSchedule, Medication, MedicationDosage) {
  $scope.medicationSchedule = MedicationSchedule.get();
  $scope.medications = Medication.get();
  $scope.selectedMed;
  var emptySlots = [' ',' ',' ',' ',' ',' ',' '];
  var selectedMed = [];
  $scope.getSlots = function(schedule, med) {
    var DAYS_OF_THE_WEEK = 7
    var slots = [];
    if (typeof(med) === 'undefined') { //has not selected a med yet
      slots = emptySlots
    }
    else {
      if(schedule.medications.indexOf(med.trade_name) != -1) {
        for(var day = 0; day < 7; day++) {
          if (schedule.days[day]) {
            slots.push(med.tablets);
          } else {
            slots.push(" ");
          }
        }
      }
      else {
        slots = emptySlots //this med is not in this schedule slot
      }
    }
    return slots
  }
  $scope.displaySchedule = function(med){
    selectedMed.push(med);
    $scope.selectedMed = med //set the selected med
  }

  $scope.currentlyOn = function(med){
    if($scope.selectedMed == med){
      return true;
    }
    return false;
  }

  $scope.hasSelected = function(med){
    if(selectedMed.indexOf(med) != -1){
      return true;
    }
    return false;
  }

  $scope.buttonStyle = function(med){
    var selected = "background-color: gray";
    var notSelected = "background-color: white";
    var currentlyOn = "background-color: green";
    if($scope.currentlyOn(med)){
      return currentlyOn;
    }
    if($scope.hasSelected(med)){
      return selected;
    }
    return notSelected;
  }

  $scope.doneMedSetup =  function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
    $state.go('carePlan.setup');
  }

})
