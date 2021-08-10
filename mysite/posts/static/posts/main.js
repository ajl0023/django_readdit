const voteContainer = document.getElementsByClassName("vote-container");
const upvotes = document.getElementsByName("upvote-button");
const downvotes = document.getElementsByName("downvote-button");
const navLogin = document.getElementById("navbar-login-button");
const navSignup = document.getElementById("navbar-signup-button");
attachListeners(navLogin, "click", (e) => {
  handleOpenAuthModal(e, "login");
});
attachListeners(navSignup, "click", (e) => {
  handleOpenAuthModal(e, "signup");
});
upvotes.forEach((ele, i) => {
  let id = ele.getAttribute("data-id");

  attachListeners(ele, "click", () => {
    vote(
      1,
      id,
      {
        upvote: ele,
        downvote: downvotes[i],
      },
      ele.getAttribute("vote-type"),
      ele.nextElementSibling
    );
  });
  attachListeners(downvotes[i], "click", () => {
    vote(
      -1,
      id,
      {
        upvote: ele,
        downvote: downvotes[i],
      },
      ele.getAttribute("vote-type"),
      ele.nextElementSibling
    );
  });
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

function vote(score, id, arrowSet, type, text) {
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
      // let voteButton = ele;

      if (score === 1) {
        arrowSet.upvote.className =
          data.voteState === 1 ? "vote-state-active" : "";
        arrowSet.downvote.className = "";
      }
      if (score === -1) {
        arrowSet.downvote.className =
          data.voteState === -1 ? "vote-state-active" : "";
        arrowSet.upvote.className = "";
      }
      console.log(arrowSet);

      text.innerHTML = data.voteTotal;
    });
}

function fetchSinglePost(e, id) {
  fetch(`/posts/get/posts/${id}`, {
    method: "GET",
  })
    .then((data) => {
      return data.text();
    })
    .then((data) => {
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = data;
      document.body.appendChild(modalContainer);
      upvotes.forEach((ele, i) => {
        let id = ele.getAttribute("data-id");

        attachListeners(ele, "click", () => {
          vote(
            1,
            id,
            {
              upvote: ele,
              downvote: downvotes[i],
            },
            ele.getAttribute("vote-type"),
            ele.nextElementSibling
          );
        });
        attachListeners(downvotes[i], "click", () => {
          vote(
            -1,
            id,
            {
              upvote: ele,
              downvote: downvotes[i],
            },
            ele.getAttribute("vote-type"),
            ele.nextElementSibling
          );
        });
      });
      const commentButton = document.getElementById("comment-submit-button");
      attachListeners(commentButton, "click", postComment);
    });
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
  attachListeners(closeButton, "click", closeAuthModal);
  attachListeners(authbutton, "click", (e) => {
    handleAuth(e, type);
  });
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
function attachListeners(ele, type, func) {
  removeListeners();
  if (ele && type && func) {
    ele.addEventListener(type, func);
  }

  const navButton = document.getElementById("main-nav-button");

  if (navButton) {
    navButton.addEventListener("click", handleNavDropDown);
  }
  const titles = document.getElementsByName("post-title");
  for (let i = 0; i < titles.length; i++) {
    titles[i].addEventListener("click", postTitleRoute);
  }

  const modalWrapper = document.getElementById("post-modal-container");

  if (modalWrapper) {
    modalWrapper.addEventListener("click", handleReroute);
  }
}

attachListeners();
function removeListeners() {
  const title = document.getElementsByName("post-title");
  for (let i = 0; i < title.length; i++) {
    title[i].removeEventListener("click", postTitleRoute);
  }
  for (let i = 0; i < upvotes.length; i++) {
    upvotes[i].removeEventListener("click", vote);
    downvotes[i].removeEventListener("click", vote);
  }
}
