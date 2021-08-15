<script>
import VoteContainer from "./VoteContainer.vue";

export default {
  name: "home-posts",
  components: {
    VoteContainer,
  },
  data: function() {
    return { templateRender: null, template: this.parentTemplate };
  },
  props: ["postsLoaded", "initialLoaded", "parentTemplate"],

  render(h) {
    if (!this.template) {
      return;
    } else {
      return this.templateRender();
    }
  },
  watch: {
    // Every time the template prop changes, I recompile it to update the DOM
    template: {
      immediate: true, // makes the watcher fire on first render, too.
      handler() {
        if (this.template) {
          var res = Vue.compile(this.template);

          this.templateRender = res.render;
          console.log(this.$options.staticRenderFns);
          this.$options.staticRenderFns = [];
          console.log(res.staticRenderFns);

          this._staticTrees = [];
          for (var i in res.staticRenderFns) {
            this.$options.staticRenderFns.push(res.staticRenderFns[i]);
          }
        }
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.parentTemplate && !vm.initialLoaded) {
        console.log(vm.postsLoaded, 9494944949);
        next((vm) => vm.fetchPosts());
      }
      return;
    });
  },
  methods: {
    postsLoadedCheck: function(data) {
      this.$emit("postsLoaded", data);
    },
    routeChange: function routeChange(id) {
      this.$router.push("/posts/" + id);
    },
    fetchPosts() {
      return fetch(`/posts/get/posts`, {
        method: "GET",
      })
        .then((data) => {
          return data.text();
        })
        .then((data) => {
          this.postsLoadedCheck(data);

          this.template = data;
        });
    },
  },
};
</script>
