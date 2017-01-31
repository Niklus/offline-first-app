<template>
  
  <div>
    <md-toolbar class='md-toolbar'>
      <md-button class="md-icon-button" v-on:click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h1 class="md-title">Headlines</h1>
      <md-icon class="right-align" v-bind:color="color">network_check</md-icon>
    </md-toolbar>
    <md-sidenav class="md-left" ref="leftSidenav" open="open('Left')" close="close('Left')">        
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Headlines</h3>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item class="md-warn">
          <span>Categories</span>
        </md-list-item>
      </md-list> 
      <md-list> 
        <md-list-item v-for="ctgry in categories">
          <md-icon>{{ ctgry }}</md-icon>
          <span>{{ ctgry }}</span>
          <md-list-expand>
            <md-list>
              <md-list-item class="md-inset" v-on:click="handler(ctgry, 'top')">Top</md-list-item>
              <md-list-item class="md-inset" v-on:click="">Popular</md-list-item>
              <md-list-item class="md-inset" v-on:click="">Latest</md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </md-sidenav> 
  </div>
</template>

<script>

  export default {

    name: 'toolbarNav',
    
    data () {
      return {
        
        categories: [ 
          'General',
          'Business',
          'Sport',
          'Technology',
          'Gaming',
          'Music',
          'Science'
        ],// remove 'all' category for now
      }
    },

    props: ['handler', 'color'],

    methods:{

      toggleLeftSidenav: function(){
        this.$refs.leftSidenav.toggle();
      },

      // Not used... YET 
      open: function(ref) {
        console.log('Opened: ' + ref);
      },

      close: function(ref) {
        console.log('Closed: ' + ref);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .right-align {
    margin-left: auto;
    margin-right: 10px;
  }
</style>
