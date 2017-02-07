<template>
  <div id="cards">
    <ul>
      <li v-for="obj1 in results"> 
        <!--Source Card-->
        <md-card class="card">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{obj1.source}}</div>
              <div class="md-subhead">{{obj1.sortBy}} headlines</div>
            </md-card-header-text>
            <md-card-media>
              <img v-bind:id="obj1.source" v-bind:src="getLogos(obj1.source)" v-bind:alt="obj1.source"><!--Render conditinally-->
            </md-card-media>
          </md-card-header>
        </md-card>

        <ul>
          <li v-for="obj2 in obj1.articles" > 
            <md-card class="card">
              <md-card-area>
                <md-card-media>
                  <img class="news-img" v-bind:src="obj2.urlToImage">
                </md-card-media>
                <md-card-header>
                  <div class="md-title" style="font-size: 1.3em">{{obj2.title}}</div>
                  <div class="md-subhead">{{obj2.publishedAt}}</div> 
                </md-card-header>
                <md-card-content style="color:teal">
                 {{obj2.description}}
                </md-card-content>
              </md-card-area>
              <md-card-actions>
                <md-card-actions class="left-align">
                  <md-button class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>share</md-icon>
                  </md-button>
              </md-card-actions>
                <md-button class="md-primary">
                <a v-bind:href="obj2.url" target="_blank" >
                  {{readability}}
                </a>
                </md-button>
              </md-card-actions>
            </md-card>                                                                                                          
          </li>
        </ul>
      </li>
    </ul>    
  </div>
</template>

<script>

  export default {

    name: 'cards',

    props: ['results', 'getLogos', 'readability']
  }
</script>

<style scoped>

.card{
  margin-top: 15px;
}

.left-align {
  margin-left: 0;
  margin-right: auto;
}

.right-align {
  margin-left: auto;
  margin-right: 10px;
}

#cards{
  padding: 20px;
}

ul {
  padding: 0;
  list-style-type: none;
}
  
</style>