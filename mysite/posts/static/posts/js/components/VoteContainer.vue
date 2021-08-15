<template>
  <div
    v-bind:class="[
      orientation === 'vertical'
        ? 'vote-container vote-vertical'
        : 'vote-container',
    ]"
  >
    <li
      type="post"
      v-bind:class="[currVoteState > 0 ? 'vote-state-active' : '']"
    >
      <UpArrow v-on:click="vote(1, postId || commentId, type)" />
    </li>
    {{ currVoteTotal }}
    <li v-bind:class="[currVoteState < 0 ? 'vote-state-active' : '']" href="">
      <DownArrow v-on:click="vote(-1, postId || commentId, type)" />
    </li>
  </div>
</template>
<script>
import UpArrow from "../../images/up-arrow.svg";
import DownArrow from "../../images/down-arrow.svg";
import { vote } from "../main";
export default {
  name: "VoteContainer",
  components: {
    UpArrow,
    DownArrow,
  },
  data: function() {
    return {
      currVoteState: this.voteState,
      currVoteTotal: this.voteTotal,
    };
  },
  props: [
    "location",
    "orientation",
    "voteTotal",
    "voteState",
    "type",
    "postId",
    "commentId",
  ],

  beforeRouteEnter(to, from, next) {
    next((vm) => vm.fetchPost());
  },

  methods: {
    vote: vote,
  },
};
</script>
