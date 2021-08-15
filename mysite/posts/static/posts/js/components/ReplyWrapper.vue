<script>
import VoteContainer from "./VoteContainer.vue";
import { postsLoaded } from "./components";
export default {
  props: ["commentid"],
  name: "ReplyWrapper",

  data() {
    return {
      text: "",
    };
  },
  components: {
    VoteContainer,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.fetchPost());
  },

  methods: {
    emitReply: function() {
      this.$emit("replyClicked", this.commentid);
    },
    emitComment: function() {
      this.$emit("commentClicked", this.commentid);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
