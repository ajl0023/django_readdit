<script>
import VoteContainer from "./VoteContainer.vue";
import ReplyWrapper from "./ReplyWrapper.vue";
import { fetcher } from "../main";

export default {
  props: ["id"],
  name: "PostModal",
  components: {
    VoteContainer,
    ReplyWrapper,
  },
  data() {
    return {
      text: "",
      templateRender: null,
      template: null,
      comments: [],
    };
  },
  render(h) {
    if (!this.template) {
      return;
    } else {
      return this.templateRender();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.fetchPost());
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
  methods: {
    handleRouteHome(e) {
      if (e.target === this.$el) {
        this.$router.push("/posts/");
      }
    },

    handleReply: function(commentid) {
      const form = new FormData(e.target.form);
      form.append("postid", this.id);
      form.append("commentid", commentid);

      fetcher(`/comments/`, {
        method: "POST",
        body: form,
      })
        .then((data) => {})
        .then((data) => {});
    },
    handleComment: function(e) {
      // e.target.preventDefault();
      const form = new FormData(e.target.form);
      form.append("postid", this.id);
      fetcher(`/comments/`, {
        method: "POST",
        body: form,
      })
        .then((data) => {
          return data.text();
        })
        .then((data) => {
          this.comments.push(434);
        });
    },
    postReply: function(e) {},
    fetchPost() {
      return fetch(`/posts/get/posts/${this.id}`, {
        method: "GET",
      })
        .then((data) => {
          return data.text();
        })
        .then((data) => {
          this.template = data;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
