<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap >
      <v-tabs fixed icons centered >
        <v-toolbar class="gradientHead" dark>
          <v-toolbar-title class="display-1">CREATE</v-toolbar-title>
        </v-toolbar>
        <v-tabs-bar class="gradientHead">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tabs-item href="c1" v-on:click="fetchStoreList">
            <v-icon>people</v-icon>
            Add B.A
          </v-tabs-item>
          <v-tabs-item href="c2">
            <v-icon>person</v-icon>
            Add Supervisor
          </v-tabs-item>
          <v-tabs-item href="c3">
            <v-icon>store</v-icon>
            Add Store
          </v-tabs-item>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content id="c1" >
            <v-card flat>
              <v-card-text>
                <v-container grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs12 class="title">ADD BRANDAMBASSADOR</v-flex>
                    <v-flex xs12 class="body-2"> Create a new Brand Ambassador.</v-flex>
                    <v-flex xs12 class="body-1"> Please fill all fields and then click on CREATE.</v-flex>
                    <v-flex xs12 class="caption"> Please make sure you have created a store for new brand ambassador </br> or Assign store field will be blank</v-flex>

                    <form @submit.prevent="onBAReg" class="mb-5">

                      <!--EMAIL-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="email"
                          label="E-MAIL"
                          v-model="addBA.email"
                          max="5"
                          :counter="true"
                          :clearable="true"
                        ></v-text-field>
                      </v-flex>
                      <!--username-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="name"
                          label="NAME"
                          v-model="addBA.name"
                        ></v-text-field>
                      </v-flex>
                      <!--Address-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="address"
                          label="ADDRESS"
                          v-model="addBA.address"
                        ></v-text-field>
                      </v-flex>
                      <!--password-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="Password"
                          label="PASSCODE"
                          min="6"
                          v-model="addBA.password"
                          :type="'password'"
                        ></v-text-field>
                      </v-flex>
                       <!--Assign Store -->
                      <v-flex xs10 offset-xs1>
                        <v-select
                        v-bind:items="unAssignedStores"
                        v-model="addBA.store"
                        label="ASSIGN STORE"
                        single-line
                        item-text="name"
                        item-value="id,name"
                        :loading="selectLoading"
                        bottom
                        ></v-select>
                      </v-flex>
                      <!--submission-->
                      <v-flex xs12>
                        <v-btn large :disabled="!baFormValid" type="submit" class="green" > + CREATE <v-icon right>send</v-icon></v-btn>
                      </v-flex>

                    </form>

                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tabs-content>
          <v-tabs-content id="c2">
          <v-card flat>
            <v-card-text>
              <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                  <v-flex xs12 class="title">ADD SUPERVISOR </v-flex>
                  <v-flex xs12 class="body-2"> Create a new Supervisor.</v-flex>
                  <v-flex xs12 class="body-1"> Please fill all fields and then click on SUBMIT.</v-flex>
                  <form @submit.prevent="onSupervisorReg" class="mb-5">
                    <!--username-->
                    <v-flex xs10 offset-xs1>
                      <v-text-field
                        required
                        name="emailId"
                        label="E-MAIL"
                        v-model="addSupervisor.email"
                      ></v-text-field>
                    </v-flex>
                    <!--password-->
                    <v-flex xs10 offset-xs1>
                      <v-text-field
                        required
                        name="userPassword"
                        label="PASSCODE"
                        min="6"
                        v-model="addSupervisor.password"
                        :type="'password'"
                      ></v-text-field>
                    </v-flex>
                    <!--username-->
                    <v-flex xs10 offset-xs1>
                      <v-text-field
                        required
                        name="userId"
                        label="USERNAME"
                        v-model="addSupervisor.name"
                      ></v-text-field>
                    </v-flex>
                    <!-- Location -->
                    <v-flex xs10 offset-xs1>
                      <v-text-field
                        required
                        name="userLocation"
                        label="ADDRESS"
                        min="6"
                        v-model="addSupervisor.address"
                      ></v-text-field>
                    </v-flex>
                    <!--submission-->
                    <v-flex xs12>
                      <v-btn large :disabled="!supervisorFormValid" type="submit" class="green" > SUBMIT <v-icon right>send</v-icon></v-btn>
                    </v-flex>

                  </form>

                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
          </v-tabs-content>
          <v-tabs-content id="c3">
            <v-card flat>
              <v-card-text>
                <v-container grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs12 class="title">ADD STORE </v-flex>
                    <v-flex xs12 class="body-2"> Create a new Store.</v-flex>
                    <v-flex xs12 class="body-1"> Please fill all fields and then click on Add Store.</v-flex>
                    <form @submit.prevent="onStoreReg" class="mb-5">
                      <!--username-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="storeName"
                          label="STORE NAME"
                          v-model="addStore.name"
                        ></v-text-field>
                      </v-flex>
                      <!--username-->
                      <v-flex xs10 offset-xs1>
                        <v-text-field
                          required
                          name="address"
                          label="ADDRESS"
                          id="testing"
                          v-model="addStore.address"
                        ></v-text-field>
                      </v-flex>
                      <!-- Assign Store -->
                      <v-flex xs10 offset-xs1>
                        <v-select
                          v-bind:items="cities"
                          v-model="addStore.city"
                          label="CITY"
                          single-line
                          bottom
                        ></v-select>
                      </v-flex>
                      <!--submission-->
                      <v-flex xs12>
                        <v-btn large :disabled="!storeFormValid" type="submit" class="green" > ADD STORE <v-icon right>send</v-icon></v-btn>
                      </v-flex>

                    </form>

                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
//        Add B.A
        addBA: {
          name: '',
          address: '',
          email: '',
          password: '',
          store: '',
        },
//        Add Store
        addStore: {
          city: '',
          address: '',
          name: '',
          assign: ''
        },
//        Add Supervisor
        addSupervisor: {
          name: '',
          address: '',
          email: '',
          password: '',
          role: 'Supervisor',
        },
//        GUI DATA
        selectLoading: true,
        unAssignedStores: [

        ],
        cities: [
          'KHI',
          'LHR',
          'ISD'
        ],
      }
    },
    methods:{
      onBAReg() {
        this.$store.dispatch('brandAmbassadorReg', {email: this.addBA.email, password: this.addBA.password, ba: this.addBA}).then(() => {
            setTimeout(() => {
                document.location.reload();
            },6000)
        })
      },
      onSupervisorReg() {
        this.$store.dispatch('supervisorReg', {email: this.addSupervisor.email, password: this.addSupervisor.password, supervisor: this.addSupervisor})
      },
      onStoreReg() {
        this.$store.dispatch('storeReg', this.addStore)
      },
      fetchStoreList(){
//        Fetching Required Data
        this.$store.dispatch('unAssignedStoresListUPD')
      },
      populateUnassignedStoreList(){
//      Converting Firebase Raw Returns to Vialable Form
        let obj = this.unAssignedStore;
        let convert = Object.keys(obj).map((key) => {
          return { id: obj[key].id,name : obj[key].name};
        });
//      Storing to Application
        this.unAssignedStores = convert;
      },
    },
    computed: {
//      Fetching Data
//      unAssigned Store List
      unAssignedStore(){
        return this.$store.getters.unAssignedStores
      },

//      Validating Fields
      supervisorFormValid(){
        return this.addSupervisor.name !== ''
          && this.addSupervisor.address !== ''
          && this.addSupervisor.email !== ''
          && this.addSupervisor.password !== ''
      },
      storeFormValid(){
        return this.addStore.name !== '' && this.addStore.address !== '' && this.addStore.city !== ''
      },
      baFormValid(){
        return this.addBA.name !== ''
          && this.addBA.address !== ''
          && this.addBA.email !== ''
          && this.addBA.password !== ''
          && this.addBA.storeId !== ''
      },
    },
    created(){
      //        getting Random store Details
      if (this.$store.getters.user === null) {
        this.$router.push('/login')
      }
      this.$store.dispatch('unAssignedStoresListUPD').then(() => {
      });
      setTimeout(() => {
//  dispatch Order to retrieve Unassigned store List
        this.populateUnassignedStoreList();
        this.selectLoading = false;
      },2000);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
