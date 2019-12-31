// importing VUE X
import Vue from 'vue';
import Vuex from 'vuex';
// importing Firebase
import * as firebase from 'firebase'

Vue.use(Vuex);


// Storage


export const store = new Vuex.Store({
  state: {
    // App Loading Stats
    userError: false,
    loadingState:{
      mainLoading: false,
      compressorLoadingStats: false,
    },
    successFlag: false,
    successMsg: 'Operation Successful',
    // Services Status
    services:{

    },
    // Application meta Information
    appinfo : {
      name : 'BAMS™ Nexus',
      fullname: 'Brand Ambassador Nexus',
      author : 'radean',
      authorEmail : 'radeanf@gmail.com',
      developer : 'radean',
      company : 'Vision Direct Marketing',
      version : '0.27',
      status : true,
      theme: 'red accent-4',
      mode: '',
      broadcast: true,
      subscription: true
    },
    // Data
    totalInterceptions: 0,
    totalPurchases: [],
    unAssignedStores: [],
    selectedBa: {},
    recentReports: [],
    stores: [],
    storeDetails: [],
    storeStockReports: [],
    consumerStoreReports: [],
    storeReports: [],
    compileReports: [],
    // Workers List
    // B.A List
    baList: {},
    // Super visor List
    supervisorList: {},
    // usersession
    userinfo: {},
    user: null,
  },
  mutations: {
    setAppConnection (state, payload) {
      state.app.connection = payload;
    },
    setTheme(state, payload){
      state.app.theme = payload;
    },
    setAppHeader(state, payload){
      state.app.header.name = payload.name;
      state.app.header.location = payload.location;
    },
    setMode(state, payload){
      state.app.mode = payload;
    },
    setTotalInterceptions (state, payload){
      state.totalInterceptions = payload;
    },
    setTotalPurchases (state, payload){
      state.totalPurchases = payload;
    },
    setUser (state, payload){
      state.user = payload;
    },
    setBaList (state, payload){
      state.baList = payload;
    },
    setSelectedBa (state, payload){
      state.selectedBa = payload;
    },
    setConsumerReport (state, payload){
      state.consumerStoreReports = payload;
    },
    setCompileReport (state, payload){
      state.compileReports = payload;
    },
    setStoreReport (state, payload){
      state.storeReports = payload;
    },
    setAllStoreReport (state, payload){
      state.recentReports = payload
    },
    setStockReport (state, payload){
      state.storeStockReports = payload;
    },
    setUserInfo (state, payload){
      state.userinfo = payload;
    },
    'SET_UNASSIGNED_STORES'(state, payload){
      state.unAssignedStores = payload
    },
    'SET_STORES'(state, payload){
      state.stores = payload
    },
    'SET_STORE_DETAILS'(state, payload){
      state.storeDetails = payload;
    },
    'SET_MERCHANDISER_REPORTS'(state, payload) {
      state.merchandiserReports = payload
    },
    'SET_MAIN_LOADING'(state, payload){
      state.loadingState.mainLoading = payload;
    },
    'SET_USER_ERROR'(state, payload){
      state.userError = payload;
    },
    'SET_SUCCESS_MSG'(state, payload){
      state.successFlag = !state.successFlag;
      state.successMsg = payload;
    }
  },
  actions: {
    // USER AUTHENTICATION
    userSignUp({commit}, payload){
      // Converting Varialble
      let userID;
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          commit('SET_MAIN_LOADING', true);
          const userInfo = {
            uniqueId: user.uid,
            name: payload.userInfo.name,
            password: payload.password,
            email: payload.email,
            address: payload.userInfo.address,
            role: payload.userInfo.role
          };
          console.log(userInfo);
            return firebase.database().ref('administrator').push(userInfo).then(() => {
            commit('SET_MAIN_LOADING', false);
            commit('SET_SUCCESS_MSG', "Successfuly Sign Up.");
              setTimeout(() => {
                commit('SET_USER_ERROR', false);
              }, 4000)
          }).catch((error) => {
            commit('SET_MAIN_LOADING', false);
            commit('SET_USER_ERROR', false);
            console.log(error)
          })
        }).catch(error => {
          commit('SET_USER_ERROR', true);
          setTimeout(() => {
            commit('SET_USER_ERROR', false);
          }, 4000)
        }
      );
    },
    userSignIn({commit}, payload){
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(firebase.auth().onAuthStateChanged(appUser => {
              commit('setUser', appUser)
            })).catch(
              error => {
                commit('SET_USER_ERROR', true);
                console.log(error);
                setTimeout(() => {
                  commit('SET_USER_ERROR', false);
                }, 4000)
              })
        })

    },
    // user Log out
    userSignOut({commit}){
      commit('SET_MAIN_LOADING', true);
      firebase.auth().signOut().then(() =>{
        // Setting ApplicationDetails
        let storeData = {
          name: 'BAMS™',
          location: ''
        };
        // setting App Header
        commit('setUserInfo', null);
        commit('setUser', null);
        commit('SET_MAIN_LOADING', false);
      });
    },
    // User Session Check
    userSession({dispatch, commit}){
      // dispatch('appStatus');
      firebase.auth().onAuthStateChanged((appUser) => {
        if(appUser) {
          // setting Authorization
          commit('setUser', appUser);
          dispatch('subUserInfo');
          // dispatch('appMode');
        }else{
          commit('setUser', null);
          console.log("Not logged in")
        }
      });
    },
    // user information update
    subUserInfo({commit, getters, dispatch}){
      // Setting Loading
      commit('SET_MAIN_LOADING', true);
      // setting user information
      firebase.database().ref('administrator').orderByChild('uniqueId').equalTo(getters.user.uid).once('value', (user) => {
        let userinfo = {};
        const obj = user.val();
        for (let key in obj) {
          userinfo = {
            uid: obj[key].uniqueId,
            name: obj[key].name,
            email: obj[key].email,
            address: obj[key].address,
            role: obj[key].role
          };
        }
        console.log('inside sub user',userinfo)
        if(userinfo === _.isEmpty({})) {
          console.log('No User Exist');
          commit('SET_USER_ERROR', true);
          setTimeout(() => {
            commit('SET_USER_ERROR', false);
            window.location.reload();
          }, 4000)
          dispatch('userSignOut');
        }
        commit('setUserInfo', userinfo);
        commit('SET_MAIN_LOADING', false);
      })
    },
//     ===================



    // USER UPDATES
    updateSelectedBa({commit, getters},payload){
      // initiate Loading
      console.log("Reached Action");
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('stores/' + getters.selectedBa.store.id).update({
        assign: 'none'
      }).then(() => {
        return firebase.database().ref('users/' + getters.selectedBa.id + '/').update({
          name: payload.name,
          store: payload.store
        }).then(() => {
          return firebase.database().ref('stores/' + payload.store.id + '/').update({
            assign: getters.selectedBa.uniqueId
          }).then(() => {
            commit('SET_MAIN_LOADING', false);
          })
        });
      })
    },
    //==============


    // DASHBOARD GUI DATA
    // ===================

    fetchTotalInterceptions({commit}){
      // Fetching List of Dates
      firebase.database().ref('storedata').on('value', (report) => {
        // Creating a temporary Variable
        let totalInterceptions = 0;
        report.forEach((childReport) => {
          const obj = childReport.val();
          // reports[currentKey] = new Array;
          for (let key in obj) {
            // Counting Objects Means interceptions
            totalInterceptions += 1;
          }
        });
        commit('setTotalInterceptions', totalInterceptions);
      })
    },

    // ==============

    // Fetching Data
    // Total Store list
    storeListUPD({commit}){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('stores').on('value', (storelist) => {
        const stores = [];
        const obj = storelist.val();
        for (let key in obj) {
          stores.push({
            id: key,
            name: obj[key].name,
            address: obj[key].address,
            city: obj[key].city,
          })
        }
        commit('SET_MAIN_LOADING', false);
        commit('SET_STORES', stores);
      });
    },
    // Unassigned Stores
    unAssignedStoresListUPD({commit}){
      firebase.database().ref('stores').orderByChild('assign').equalTo('none').on('value', (storelist) => {
        const stores = [];
        const obj = storelist.val();
        for (let key in obj) {
          stores.push({
            id: key,
            name: obj[key].name,
            address: obj[key].address,
            city: obj[key].city
          })
        }
        commit('SET_UNASSIGNED_STORES', stores);
      });
    },
    // All B.A list
    baListUPD({commit}){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('users').orderByChild('role').equalTo('BrandAmbassador').on('value', (balist) => {
        const ba = [];
        const obj = balist.val();
        for (let key in obj) {
          ba.push({
            id: key,
            name: obj[key].name,
            storeName: obj[key].store.name,
            address: obj[key].address,
            email: obj[key].email,
            uniqueId: obj[key].uniqueId,
          })
        }
        commit('SET_MAIN_LOADING', false);
        commit('setBaList', ba);
      });
    },
    // All B.A list
    fetchSelectedBa({commit}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('users').orderByKey().equalTo(payload).on('value', (baValue) => {
        let ba = {};
        const obj = baValue.val();
         for (let key in obj) {
           ba = ({
             id: key,
             name: obj[key].name,
             store: obj[key].store,
             address: obj[key].address,
             email: obj[key].email,
             uniqueId: obj[key].uniqueId,
           });
         }
        commit('SET_MAIN_LOADING', false);
        commit('setSelectedBa', ba);
      });
    },
    // Fetching Store Details
    fetchShopDetails({commit, getters}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('stores').orderByKey().equalTo(payload).once('value', (storedetails) => {
        const storeDetail = getters.storeDetails;
        if(getters.storeDetails.length === 3){
          getters.storeDetails.shift();
        }
        const obj = storedetails.val();
        for (let key in obj) {
          storeDetail.push({
            id: key,
            name: obj[key].name,
            location: obj[key].location
          });
        }
        commit('SET_MAIN_LOADING', false);
        commit('SET_STORE_DETAILS', storeDetail)
      });
    },
    // Fetch By ADMIN --ONLY
    fetchStockReports({commit}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('stockdata').orderByChild('date').equalTo(payload.toString()).once('value', (report) => {
        const reports = [];
        const obj = report.val();
        for (let key in obj) {
          reports.push({
            id: key,
            date: obj[key].date,
            // Images
            baPictureUrl: obj[key].baPictureImgUrl,
            storePictureUrl: obj[key].storePicImgUrl,
            shelfPictureUrl: obj[key].shelfPictureImgUrl,
            // Store info
            baName: obj[key].baName,
            interceptions: obj[key].interceptions,
            storeId: obj[key].storeid,
            storeName: obj[key].storename,
            userName: obj[key].userName,
            // Stock Information
            stock : obj[key].soyaSupremeStock
          });
        }
        commit('SET_MAIN_LOADING', false);
        commit('setStockReport', reports)
      });
    },
    // Fetch By ADMIN --ONLY
    fetchConsumerReports({commit}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('storedata/' + payload.date).orderByChild('store/id').equalTo(payload.store).once('value', (report) => {
        const reports = [];
        const obj = report.val();
        for (let key in obj) {
          reports.push({
            id: key,
            // Customer Information
            customerName: obj[key].customerName,
            customerContact: obj[key].customerContact,
            // Store info
            storeName: obj[key].store.name,
            userName: obj[key].userName,
            // Stock Information
            purchased : obj[key].purchased
          });
        }
        commit('SET_MAIN_LOADING', false);
        commit('setConsumerReport', reports)
      });
    },
    // Fetch Store Reports By Campaign
    fetchStoreReports({commit}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('storedata').once('value', (report) => {
        let reports = [];
        let currentKey = null;
        // console.log(reports.val)
        report.forEach((childReport) => {
          const obj = childReport.val();
          currentKey = childReport.key;
          // reports[currentKey] = new Array;
          for (let key in obj){
            reports.push({
              id: key,
              date: childReport.key,
              // Customer Information
              customerName: obj[key].customerName,
              customerContact: obj[key].customerContact,
              // Store info
              storeName: obj[key].store.name,
              store: obj[key].store,
              userName: obj[key].userName,
              // Stock Information
              purchased: obj[key].purchased
            });
          }
          currentKey = null;
        });
        // console.log(reports)
        commit('SET_MAIN_LOADING', false);
        commit('setStoreReport', reports);
        });
    },
    // Fetch All Last Reports
    fetchAllStoreReports({commit}){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('storedata').on('value', (report) => {
        let reports = [];
        let currentKey = null;
        console.log(reports)
        report.forEach((childReport) => {
          const obj = childReport.val();
          currentKey = childReport.key;
          // reports[currentKey] = new Array;
          for (let key in obj){
            reports.push({
              id: key,
              date: childReport.key,
              // Customer Information
              customerName: obj[key].customerName,
              // Store info
              store: obj[key].store,
              userName: obj[key].userName,
            });
          }
          currentKey = null;
        });
        let crypted = reports.slice(-3);
        // console.log(reports)
        commit('SET_MAIN_LOADING', false);
        commit('setAllStoreReport', crypted);
      });
    },
    // Fetch Compile Reports By Campaign
    fetchCompileReports({commit}, payload){
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('storedata').orderByKey().startAt(payload.from).endAt(payload.to).once('value', (report) => {
        const reports = [];
        // let purchased;
        // let totals;
        report.forEach((childReport) => {
          const obj = childReport.val();
          for (let key in obj) {
            reports.push({
              id: key,
              // Customer Information
              customerName: obj[key].customerName,
              customerContact: obj[key].customerContact,
              // Store info
              storeName: obj[key].store.name,
              store: obj[key].store,
              userName: obj[key].userName,
              // Stock Information
              purchased : obj[key].purchased
            });
          }
        });
        commit('SET_MAIN_LOADING', false);
        commit('setCompileReport', reports)
      });
    },
    // Fetch Compile Reports By Campaign
    fetchCampaignReports({commit}){
      firebase.database().ref('storedata').on('value', (report) => {
        const reports = [];
        // let purchased;
        // let totals;
        report.forEach((childReport) => {
          const obj = childReport.val();
          for (let key in obj) {
            reports.push({
              // Stock Information
              purchased : obj[key].purchased
            });
          }
        });
        // console.log(reports);
        commit('setTotalPurchases', reports)
      });
    },




    // ========================
    // Employees CRUD
    // Adding New Registration Entries
    // Brand Ambassador PUT
    brandAmbassadorReg({commit}, payload){
      // Start Loading
      commit('SET_MAIN_LOADING', true);
      // Authenticate Firebase User
      var config = {
        apiKey: "AIzaSyDsQvtEgYT_SiYeZ7YXtbAP0MLE1rudkJY",
        authDomain: "bams-e190d.firebaseapp.com",
        databaseURL: "https://bams-e190d.firebaseio.com"
      };
      let secondaryApp = firebase.initializeApp(config, "Secondaryy");
      // admin.auth().createUser({
      //   email: payload.email,
      //   displayName: payload.ba.name,
      //   emailVerified: false,
      //   password: payload.password
      // })
      secondaryApp.auth().createUserWithEmailAndPassword(payload.email, payload.password).then((user) => {
        const brandAmbassador = {
          uniqueId: user.uid,
          name: payload.ba.name,
          address: payload.ba.address,
          email: payload.email,
          password: payload.password,
          store: payload.ba.store,
          role: 'BrandAmbassador'
        };
        return firebase.database().ref('users').push(brandAmbassador).then(() => {
          // assign store
          return firebase.database().ref('stores/' + payload.ba.store.id + '/').update({
            assign: user.uid
          }).then(() => {
            // End Loading
            secondaryApp.auth().signOut();
            commit('SET_MAIN_LOADING', false);
            // Sending Success Message
            commit('SET_SUCCESS_MSG', 'B.A Successfully Created');
            setTimeout(() => {
              commit('SET_SUCCESS_MSG', 'Operation Successful');
            }, 4000);
          })
        });
      });
    },
    //UPD
    updbrandAmbassadorReg({commit}, payload){
      // Start Loading
      commit('SET_MAIN_LOADING', true);
      // Authenticate Firebase User
      var config = {
        apiKey: "AIzaSyDsQvtEgYT_SiYeZ7YXtbAP0MLE1rudkJY",
        authDomain: "bams-e190d.firebaseapp.com",
        databaseURL: "https://bams-e190d.firebaseio.com"
      };
      let secondaryApp = firebase.initializeApp(config, "Secondary");
      // admin.auth().createUser({
      //   email: payload.email,
      //   displayName: payload.ba.name,
      //   emailVerified: false,
      //   password: payload.password
      // })
      secondaryApp.auth().createUserWithEmailAndPassword(payload.email, payload.password).then((user) => {
        const brandAmbassador = {
          uniqueId: user.uid,
          name: payload.ba.name,
          address: payload.ba.address,
          email: payload.email,
          password: payload.password,
          store: payload.ba.store,
          role: 'BrandAmbassador'
        };
        return firebase.database().ref('users').push(brandAmbassador).then(() => {
          // assign store
          return firebase.database().ref('stores/' + payload.ba.store.id + '/').update({
            assign: user.uid
          }).then(() => {
            // End Loading
            secondaryApp.auth().signOut();
            commit('SET_MAIN_LOADING', false);
            // Sending Success Message
            commit('SET_SUCCESS_MSG', 'B.A Successfully Created');
            setTimeout(() => {
              commit('SET_SUCCESS_MSG', 'Operation Successful');
            }, 4000);
          })
        });
      });
    },


    // Supervisor PUT
    supervisorReg({commit}, payload){
      // Start Loading
      commit('SET_MAIN_LOADING', true);
      // Authenticate Firebase User
      var config = {
        apiKey: "AIzaSyDsQvtEgYT_SiYeZ7YXtbAP0MLE1rudkJY",
        authDomain: "bams-e190d.firebaseapp.com",
        databaseURL: "https://bams-e190d.firebaseio.com"
      };
      let secondaryApp = firebase.initializeApp(config, "Secondary");
      // admin.auth().createUser({
      //   email: payload.email,
      //   displayName: payload.ba.name,
      //   emailVerified: false,
      //   password: payload.password
      // })
      secondaryApp.auth().createUserWithEmailAndPassword(payload.email, payload.password).then((user) => {
        const supervisor = {
          uniqueId: user.uid,
          name: payload.supervisor.name,
          address: payload.supervisor.address,
          email: payload.email,
          store: {
            id: 'none',
            name: 'none'
          },
          password: payload.password,
          role: 'Supervisor'
        };
        return firebase.database().ref('users').push(supervisor).then(() => {
            // End Loading
            secondaryApp.auth().signOut();
            commit('SET_MAIN_LOADING', false);
            // Sending Success Message
            commit('SET_SUCCESS_MSG', 'Supervisor Successfully Created');
            setTimeout(() => {
              commit('SET_SUCCESS_MSG', 'Operation Successful');
            }, 4000);
          })
        });
    },
    // Store PUT
    storeReg({commit}, payload){
      // Start Loading
      commit('SET_MAIN_LOADING', true);
      let storeDetails = {
        name: payload.name,
        address: payload.address,
        city: payload.city,
        assign: 'none'
      };
      firebase.database().ref('stores').push(storeDetails).then(() => {
        // End Loading
        commit('SET_MAIN_LOADING', false);
        // Sending Success Message
        commit('SET_SUCCESS_MSG', 'Store Successfully Added');
        setTimeout(() => {
          commit('SET_SUCCESS_MSG', 'Operation Successful');
        },4000);
      }).catch(error => {
        commit('SET_USER_ERROR', true);
          setTimeout(() => {
            commit('SET_USER_ERROR', false);
          },4000)
      });
    }

  },
  getters: {
    // Application Details
    appinfo (state){
      return state.appinfo
    },
    user (state){
      return state.user
    },
    userInfo (state){
      return state.userinfo
    },
    userError(state){
      return state.userError
    },
    unAssignedStores (state){
      return state.unAssignedStores
    },
    totalInterceptions (state){
      return state.totalInterceptions
    },
    totalPurchases (state){
      return state.totalPurchases
    },
    availableBA (state){
      return state.baList
    },
    selectedBa (state){
      return state.selectedBa
    },
    storeList (state){
      return state.stores
    },
    storeDetails (state) {
      return state.storeDetails
    },
    storeStockReports (state) {
      return state.storeStockReports
    },
    recentReport (state){
      return state.recentReports
    },
    consumerStoreReports (state) {
      return state.consumerStoreReports
    },
    compileReport (state) {
      return state.compileReports
    },
    storeReport (state) {
      return state.storeReports
    },
    mainLoading (state){
      return state.loadingState
    },
    successMsg (state){
      return state.successMsg
    },
    successFlag (state){
      return state.successFlag
    }
  }
});
