angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationHistory", "$firebaseArray", "$firebaseObject", function(CARD, Patient, MedicationHistory, $firebaseArray, $firebaseObject) {
  var generateCardAttributes = function(object_type, date_key) {
    var now  = (new Date()).toISOString();

    if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE)
      var defaultRef = MedicationSchedule.ref().child("default");
    else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE)
      var defaultRef = MeasurementSchedule.ref().child("default");

    defaultRef.once("value", function(snap) {
      snap.forEach(function(childSnap) {
        var schedule = childSnap.val();

        //TODO: update these to be minutes from midnight.
        if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
          show.setHours(parseInt(schedule.time.substring(0,2)));
          show.setMinutes(parseInt(schedule.time.substring(3,5)));
        } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
          show.setHours(schedule.hour);
          show.setMinutes(schedule.minute);
        }

        var card = {
          type: CARD.TYPE.ACTION,
          created_at: now,
          updated_at: now,
          shown_at: now,
          completed_at: null,
          archived_at: null,
          num_comments: 0,
          object_type: object_type,
          object_id: childSnap.key()
        }
        Card.create(date_key, card);
      })
    })
  }


  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getByDay: function(date) {
      var dateISO = date.toISOString().substring(0,10)
      var ref = this.ref().child(dateISO);
      return $firebaseArray(ref);
    },
    getById: function(id) {
      var ref = this.todaysRef().child(id)
      return $firebaseObject(ref)
    },
    getHistory: function() {
      var dateISO = (new Date()).toISOString().substring(0,10)
      var ref = this.ref().orderByKey().endAt(dateISO).limitToLast(3);
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("cards");
    },
    todaysRef: function() {
      // TODO: No better way to get only the date from a Date object?
      var dateISO = (new Date()).toISOString().substring(0,10)  //Only get the date: YYYY-MM-DD
      return this.ref().child(dateISO);
    },

    create: function(date, card) {
      var ref = this.ref().child(date);
      ref.push(card); //use push to generate a UNIQUE card ID for each firebase card.
    },
    complete: function(card) {
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      updateObject = {updated_at: now,
                      completed_at: now};

      //Add to or update firebase
      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) { //this date child exists
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },
    archive: function(card) {
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject = {updated_at: now, archived_at: now};

      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) {
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },
    // This method queries "2016-04-01" on "cards" key and
    // a) if key is not found, creates Medication and Measurement schedules.
    // b) if key is found, checks if the date has Measurement/Medication schedules,
    //    and if not, then generates them.
    generateCardsFor: function(date_key) {
      var cardRef = this.ref().child(date_key);
      cardRef.once("value", function (cardSnap) { //only do this once per day
        if (!cardSnap.exists()) {
          generateCardAttributes(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date_key)
          generateCardAttributes(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date_key)
        } else {
          // Check to make sure each has been generated
          var measExists = false;
          var medsExists = false;
          cardSnap.forEach(function(childSnap) {
            if (childSnap.val().object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) measExists = true;
            if (childSnap.val().object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) medsExists = true;
          });
          if (!measExists || !medsExists) {
            generateCardAttributes(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date_key)
            generateCardAttributes(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date_key)
          }
        }
      })
    }
  }
}])
