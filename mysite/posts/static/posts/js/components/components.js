import uparrowsvg from "../../up-arrow.svg";
import downarrowsvg from "../../down-arrow.svg";
import { routeChange, vote } from "../main";

Vue.component("vote-container", {
  data: function () {
    return {
      currVoteState: this.voteState,
      currVoteTotal: this.voteTotal,
    };
  },
  props: ["location", "voteTotal", "voteState", "type", "postId"],
  methods: {
    vote: vote,
  },

  template: /* HTML */ `<div
    data-id="17f988b1e168448abb9193a3978a7f26"
    class="vote-container"
  >
    <li
      type="post"
      v-bind:class="[currVoteState > 0 ? 'vote-state-active'  : '']"
    >
      ${uparrowsvg}
    </li>
    {{currVoteTotal}}
    <li
      v-bind:class="[currVoteState < 0   ? 'vote-state-active'  : '' ]"
      href=""
    >
      ${downarrowsvg}
    </li>
  </div>`,
});
const Test = Vue.component("test-container", {
  data: function () {
    return {
      currVoteState: this.voteState,
      currVoteTotal: this.voteTotal,
    };
  },
  props: ["location", "voteTotal", "voteState", "type", "postId"],
  methods: {
    vote: vote,
  },

  template: /* HTML */ `<div
    data-id="17f988b1e168448abb9193a3978a7f26"
    class="vote-container"
  >
    dafasdfdfadfadfadfadf
  </div>`,
});
const PostContainer = {
  props: ["postLoaded"],
  data: function () {
    return {
      ele: null,
    };
  },

  beforeCreate: function () {
    fetch(`/posts/get/posts/${this.$route.params.id}`, {
      method: "GET",
    })
      .then((data) => {
        return data.text();
      })
      .then((data) => {
        this.template = data;
      });
  },
  updated: function () {
    new Vue({
      router: router,
      el: "#modal-wrapper",
      delimiters: ["[[", "]]"],
      data: {
        postLoaded: "asdadasdasd!",
      },
    });
  },
};

const promise = new Promise((resolve, rej) => {
  resolve(3);
});

function test5() {
  console.log(234);
}
const yu = Vue.component("async-example", function (resolve, reject) {
  console.log(this);
  fetch(`/posts/get/posts/17f988b1e168448abb9193a3978a7f26`, {
    method: "GET",
  })
    .then((data) => {
      return data.text();
    })
    .then((data) => {
      resolve({
        methods: {
          test5,
        },
        template: data,
      });
    });
});
const router = new VueRouter({
  mode: "history",

  routes: [
    {
      path: "/posts/:id",
      component: yu,
    },
  ],
});
function handleRouteHome(e) {
  console.log(e);
}

// Vue.component("async-example", function (resolve, reject) {
//   fetch(`/posts/get/posts/${this.$route.params.id}`, {
//     method: "GET",
//   })
//     .then((data) => {
//       return data.text();
//     })
//     .then((data) => {
//       resolve({
//         template: data,
//       });
//     });
// });

new Vue({
  router: router,
  el: "#vue-vote-container",
  delimiters: ["[[", "]]"],
  data: {
    postLoaded: "Hello Vue!",
  },
  methods: { routeChange: routeChange },
});
new Vue({
  router: router,
  el: "#post-wrapper",
  delimiters: ["[[", "]]"],
  data: {
    myTitle: "Hello Vue!",
  },
  methods: { routeChange: routeChange, handleRouteHome },
});
