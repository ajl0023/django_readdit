<template>
  <router-view
    v-bind:postsLoaded="postsLoaded"
    v-on:postsLoaded="postsLoadedCheck"
    v-bind:initialLoaded="initialLoaded"
    v-bind:parentTemplate="parentTemplate"
    name="postHome"
  >
  </router-view>
</template>
<script>
import VoteContainer from "./VoteContainer.vue";
import { postsLoaded } from "./components";
export default {
  props: ["id"],
  name: "post-wrapper",

  data() {
    return {
      parentTemplate: null,
      initialLoaded: postsLoaded,
      postsLoaded,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => vm.fetchPost());
  },

  methods: {
    postsLoadedCheck: function(data) {
      console.log(data);
      this.parentTemplate = data;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
