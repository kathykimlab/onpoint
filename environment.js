onpoint = {};
onpoint.env = {
  error: "error",
  auth: {
    success: "auth:success",
    failure:   "auth:failure"
  },
  data: {
    refresh: "data.refresh"
  },
  dropbox_access_token: "I4Lb1LdY9yAAAAAAAAAACHw-nSH_V-t1_dEViqlzNBYjJXBKpfpWa7OVYolgb3Yc",

  // @if ENV == 'ANDROID'
  baseURL: "http://10.0.3.2:5000/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  serverURL: "https://onpointhealth.herokuapp.com/api/v0/",
  environment: "development",
  debug: true
  // @endif
  // @if ENV == 'DEVELOPMENT'
  baseURL: "http://localhost:5000/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  serverURL: "http://localhost:5000/api/v0/",
  environment: "development",
  debug: true
  // @endif
  // @if ENV == 'PRODUCTION'
  baseURL: "https://onpointhealth.herokuapp.com/api/v0/",
  mainURL: "https://vivid-inferno-5187.firebaseio.com/",
  serverURL: "https://onpointhealth.herokuapp.com/api/v0/",
  environment: "production",
  debug: false
  // @endif
}
