import "./components/components";

function updateOptions(options) {
  const update = { ...options };

  update.headers = { "X-CSRFToken": csrf_token };

  return update;
}
export function fetcher(url, options) {
  return fetch(url, updateOptions(options));
}

export function vote(score, id, type) {
  if (this.location === "home") {
    return;
  }

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
      this.currVoteState = data.voteState;
      this.currVoteTotal = data.voteTotal;
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
      headers: { "X-CSRFToken": csrf_token },
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
