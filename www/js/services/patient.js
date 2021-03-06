/*
This factory abstracts the interaction with the persistence layer to
fetch the Patient object. The Patient object is *mostly* Firebase data that
is returned via password authentication:

https://www.firebase.com/docs/web/guide/login/password.html
*/
angular.module('app.services')
.factory('Patient', function($window, $firebaseAuth, $firebaseObject, Pouch, $q) {
  return {
    ref: function(uid) {
      return new Firebase(onpoint.env.mainURL + "patients/").child(uid);
    },


    get: function() {
      return $q.when(Pouch.patientsDB.get("session"))
    },
    save: function(patient) {
      return Pouch.patientsDB.upsert("session", function(doc){
        for (var key in patient)
          doc[key] = patient[key]
        return doc
      })
    },
    create: function(user) {
      thisP = this
      patientRef = new Firebase(onpoint.env.mainURL + "patients/")
      return $firebaseAuth(patientRef).$createUser(user).then(function(res) {
        patient            = user
        patient.uid        = res.uid
        patient.onboarding = {intro: false, medication_identification: false, medication_scheduling: false}
        return thisP.saveAndSync(patient)
      })
    },


    saveAndSync: function(patient) {
      thisP = this
      return thisP.save(patient).then(function() {
        return thisP.get()
      }).then(function(p) {
        console.log("Patient#saveProfileToFirebase...")
        console.log("p: " + JSON.stringify(p))
        console.log("patient: " + JSON.stringify(patient))
        return thisP.ref(p.uid).child("profile").update(patient)
      })
    },
    getFromFirebase: function() {
      thisP = this
      return this.get().then(function(p) {
        return thisP.ref(p.uid).child("profile").once("value")
      }).then(function(doc) {
        return doc.val()
      })
    },


    login: function(user) {
      thisP = this
      patientRef = new Firebase(onpoint.env.mainURL + "patients/")
      return $firebaseAuth(patientRef).$authWithPassword(user).then(function(res) {
        patient                 = {}
        patient.uid             = res.uid
        patient.token           = res.token
        patient.profileImageURL = res.password.profileImageURL
        return thisP.saveAndSync(patient)
      })
    },
    logout: function() {
      thisP = this
      return this.get().then(function(p) {
        return Pouch.patientsDB.remove(p).then(function(doc) {
          return p
        })
      }).then(function(p) {
        return $firebaseAuth(thisP.ref(p.uid)).$unauth()
      })
    }


  };
})
