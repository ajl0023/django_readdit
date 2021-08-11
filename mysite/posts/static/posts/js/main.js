import uparrowsvg from "../up-arrow.svg";
import downarrowsvg from "../down-arrow.svg";

const upvotes = document.getElementsByName("upvote-button");
const downvotes = document.getElementsByName("downvote-button");

const test2 = document.getElementById("vue-vote-container");
const User = {
  template: "<div>User 234234234</div>",
};
const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: "/", component: User },
  ],
});

Vue.component("vote-container", {
  data: function () {
    return {
      currVoteState: this.voteState,
      currVoteTotal: this.voteTotal,
    };
  },
  props: ["voteTotal", "voteState", "type", "postId"],
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

const app = new Vue({
  router:router,
  el: "#vue-vote-container",
  delimiters: ["[[", "]]"],
  data: {
    myTitle: "Hello Vue!",
  },
  // methods: {
  //   voteup: () => {
  //     console.log(1);
  //   },
  // },
}).$mount("#vue-vote-container");
// attachListeners(navLogin, "click", (e) => {
//   handleOpenAuthModal(e, "login");
// });
// attachListeners(navSignup, "click", (e) => {
//   handleOpenAuthModal(e, "signup");
// });

upvotes.forEach((ele, i) => {
  let id = ele.getAttribute("data-id");

  // attachListeners(ele, "click", () => {
  //   vote(
  //     1,
  //     id,
  //     {
  //       upvote: ele,
  //       downvote: downvotes[i],
  //     },
  //     ele.getAttribute("vote-type"),
  //     ele.nextElementSibling
  //   );
  // });
  // attachListeners(downvotes[i], "click", () => {
  //   vote(
  //     -1,
  //     id,
  //     {
  //       upvote: ele,
  //       downvote: downvotes[i],
  //     },
  //     ele.getAttribute("vote-type"),
  //     ele.nextElementSibling
  //   );
  // });
});
function updateOptions(options) {
  const update = { ...options };

  update.headers = { "X-CSRFToken": token };

  console.log(update);
  return update;
}
function fetcher(url, options) {
  return fetch(url, updateOptions(options));
}

function vote(score, id, type) {
  fetcher(`/posts/${score === 1 ? "voteup" : "votedown"}`, {
    method: "PUT",
    body: JSON.stringify({
      type,
      [type === "post" ? "postid" : "commentid"]: id,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
      this.currVoteState = data.voteState;
      this.currVoteTotal = data.voteTotal;
    });
}

function fetchSinglePost(e, id) {
  fetch(`/posts/get/posts/${id}`, {
    method: "GET",
  })
    .then((data) => {
      return data.text();
    })
    .then((data) => {});
}
function postComment(e) {
  e.preventDefault();
  const form = new FormData(e.target.form);
  form.append("postid", e.target.form.getAttribute("id"));

  fetcher(`/comments/`, {
    method: "POST",
    body: form,
  })
    .then((data) => {})
    .then((data) => {});
}
function fetchPosts(e, id) {
  const modalWrapper = document.getElementById("post-modal-container");
  fetch(`/posts/get/posts`, {
    method: "GET",
  })
    .then((data) => {
      return data.text();
    })
    .then((data) => {
      window.history.pushState(null, "home", "/posts");

      if (e.target === modalWrapper) {
        postsLoaded = true;
        modalWrapper.remove();

        const homeWrapper = document.getElementById("home-wrapper");

        homeWrapper.innerHTML = data;
        attachListeners();
      }
    });
}

function handleReroute(e) {
  const modalWrapper = document.getElementById("post-modal-container");
  if (e.target !== modalWrapper) {
    return;
  }

  if (postsLoaded === "False") {
    fetchPosts(e);
    return;
  }

  history.pushState(null, "home", "/posts");
  modalWrapper.parentElement.remove();
}
function postTitleRoute(e) {
  console.log(345);
  const id = e.currentTarget.getAttribute("data-id");
  fetchSinglePost(e, id);
  window.history.pushState(null, "post", "/posts/" + id);
}
function handleNavDropDown() {
  const dropdownContainer = document.querySelector(
    "div.navbar-dropdown-container"
  );
  dropdownContainer.style.display =
    dropdownContainer.style.display === "flex" ? "none" : "flex";
}
function genAuthModal(type) {
  let modal = /* HTML */ `
    <div class="login-card-modal ">
      <div class="login-modal-title-exit-container">
        <p class="login-modal-title ">${type}</p>
        <button id="close-login-modal-button" class="login-cancel-button ">
          X
        </button>
      </div>
      <div class="login-input-container">
        <input
          class="login-input"
          id="username-input"
          placeholder="username"
          type="text"
        /><input
          class="login-input "
          id="password-input"
          placeholder="password"
          type="password"
        />
        <p class="signup-error"></p>
        ${type === "signup"
          ? /* HTML */ `
              <input
                class="login-input "
                placeholder="Confirm your password"
                type="password"
              />
            `
          : ""}
        <button class="login-button" id="main-auth-button">${type}</button>
      </div>
    </div>
  `;
  return modal;
}

function handleOpenAuthModal(e, type) {
  const appwrapper = document.getElementById("main-app-wrapper");

  const loginModalWrapper = document.createElement("div");
  loginModalWrapper.className = "login-modal-wrapper";
  loginModalWrapper.innerHTML = genAuthModal(
    type === "login" ? "login" : "signup"
  );
  appwrapper.appendChild(loginModalWrapper);
  const authbutton = document.getElementById("main-auth-button");

  const closeButton = document.getElementById("close-login-modal-button");
  // attachListeners(closeButton, "click", closeAuthModal);
  // attachListeners(authbutton, "click", (e) => {
  //   handleAuth(e, type);
  // });
}
function handleAuth(e, type) {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  if (type === "login") {
    const request = new Request("/login", {
      headers: { "X-CSRFToken": token },
    });

    fetch(request, {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } else if (type === "signup") {
    const request = new Request("/signup", {
      headers: { "X-CSRFToken": token },
    });

    fetch(request, {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(() => {
      const loginModal = genAuthModal("login");
      closeAuthModal();
      handleOpenAuthModal(null, "login");
    });
  }
}
function signup() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const request = new Request("/login", {
    headers: { "X-CSRFToken": token },
  });

  fetch(request, {
    method: "POST",
    mode: "same-origin",
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });
}
function closeAuthModal() {
  const loginModal = document.querySelector("div.login-modal-wrapper");
  loginModal.remove();
}



