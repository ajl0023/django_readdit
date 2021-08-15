import { vote } from "../main";
import "./eventbus";
import PostModal from "./PostModal.vue";
import VoteContainer from "./VoteContainer.vue";

import HomePosts from "./HomePosts.vue";
import PostWrapper from "./PostWrapper.vue";
import dropDown from "./DropDown.vue";
import AuthModal from "./AuthModal.vue";

export const postsLoaded = JSON.parse(
  document.getElementById("postsLoaded").textContent
);

function routeChange(id) {
  router.params = id;

  router.push("/posts/" + id);
}

const router = new VueRouter({
  mode: "history",

  routes: [
    {
      path: "/posts/:id",

      components: {
        postModal: PostModal,
      },
      props: {
        postModal: (route) => {
          return { id: route.params.id };
        },
      },

      // postModal: AsyncComponent().component,
    },
    {
      path: "/posts/",

      components: {
        postHome: HomePosts,
      },
    },
  ],
});
function handleRouteHome(e) {
  router.push("/posts/");
}

new Vue({
  router: router,
  el: "#home-posts-container",
  delimiters: ["[[", "]]"],

  components: {
    VoteContainer,
    PostWrapper,
    AuthModal,
  },
  data: {
    showAuthModal: false,
    authType: null,
  },
  mounted: function() {
    this.eventHub.$on("toggled", (data) => {
      this.showAuthModal = !this.showAuthModal;
      this.authType = data;
    });
  },
  methods: {
    closeModal: function() {
      this.showAuthModal = false;
    },

    routeChange: routeChange,
  },
});

const navInstance = new Vue({
  el: "#nav-vue-instance",
  delimiters: ["[[", "]]"],
  components: {
    dropDown,
  },
  data: {
    dropDown: false,
  },
  methods: {
    handleNavDropdown: function() {
      this.dropDown = !this.dropDown;
    },
    toggleAuthModal: function(type) {
      this.eventHub.$emit("toggled", type);
    },
  },
});

const app = new Vue({
  router: router,
  el: "#post-wrapper",
  delimiters: ["[[", "]]"],
  components: {
    VoteContainer,
    PostWrapper,
  },

  data: {
    myTitle: "Hello Vue!",
  },
  methods: {
    toggleAuthModal: function() {},
    routeChange: routeChange,
  },
});
