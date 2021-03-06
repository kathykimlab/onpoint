angular.module('app.controllers')
.controller("medicationScheduleCardCtrl", function($scope, $state, $stateParams, $ionicModal, $ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory, $ionicLoading, Card, _, $log) {
  $scope.drug     = {}
  $scope.history  = []
  $scope.card     = {}

  $scope.$on('$ionicView.loaded', function(){
    $ionicLoading.show({hideOnStateChange: true})

    MedicationSchedule.getByID($stateParams.schedule_id).then(function(doc) {
      $scope.schedule = doc
    }).then(function() {
      return MedicationHistory.getHistoryForSchedule($stateParams.date, $scope.schedule)
    }).then(function(doc) {
      $scope.history = doc
      $log.debug("HISTORY: ")
      $log.debug(doc)
      return Card.getByID($state.params.card_id)
    }).then(function(card) {
      $scope.card = card
    }).finally(function() {
      $ionicLoading.hide()
    });
  });

  $scope.medModal = function(med) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/cards/medication.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      return modal.show()
    }).then(function() {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading medication...", hideOnStateChange: true})
      return Medication.getById(med.id)
    }).then(function(drug) {
      console.log("DRUG: ")
      console.log(drug)
      $scope.drug = drug
    }).finally(function() {
      $ionicLoading.hide()
    }).catch(function(err) {
      console.log("ERR: ")
      console.log(err)
    })
  }

  $scope.closeModal = function() {
    $scope.modal.hide().then(function() {
      return MedicationHistory.getHistoryForSchedule($stateParams.date, $scope.schedule)
    }).then(function(doc) {
      $scope.history = doc
    })
  }

  $scope.showNoteModal = function(med) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/cards/note.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      return modal.show()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.takeAllMedication = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving your choice...", hideOnStateChange: true})
    MedicationHistory.decideAll($scope.schedule, $stateParams.date, "take").then(function() {
      return MedicationSchedule.getByID($stateParams.schedule_id)
    }).then(function(doc) {
      $scope.schedule = doc
    }).finally(function() {
      $ionicLoading.hide();
    })
  }

  $scope.skipAllMedication = function()  {
    c = confirm("Are you sure you want to skip all medication?")
    if (!c)
      return

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving your choice...", hideOnStateChange: true})
    MedicationHistory.decideAll($scope.schedule, $stateParams.date, "skip").then(function() {
      return MedicationSchedule.getByID($stateParams.schedule_id)
    }).then(function(doc) {
      $scope.schedule = doc
    }).finally(function() {
      $ionicLoading.hide();
    })
  };


  $scope.takeMedication = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving your choice...", hideOnStateChange: true})
    MedicationHistory.decide($scope.drug, $scope.schedule, $stateParams.date, "take").then(function() {
      $scope.closeModal();
    }).finally(function() {
      $ionicLoading.hide();
    })
  }

  $scope.skipMedication = function()  {
    c = confirm("Are you sure you want to skip this medication?")
    if (!c)
      return

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving your choice...", hideOnStateChange: true})
    MedicationHistory.decide($scope.drug, $scope.schedule, $stateParams.date, "skip").then(function() {
      $scope.closeModal();
    }).finally(function() {
      $ionicLoading.hide();
    })
  };

  $scope.noDecisionOnMedication = function(med) {
    medication = $scope.history[med.id]
    if (!medication || (!medication.skipped_at && !medication.taken_at) ) {
      return true
    } else
      return false
  }

  $scope.updateNote = function() {
    $ionicLoading.show({hideOnStateChange: true})
    $scope.card.$save().then(function() {
      $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
