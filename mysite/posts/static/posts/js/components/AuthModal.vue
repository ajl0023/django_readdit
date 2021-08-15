<template>
  <div class="login-modal-wrapper">
    <div class="login-card-modal ">
      <div class="login-modal-title-exit-container">
        <p class="login-modal-title ">
          {{ authType === "login" ? "Login" : "Sign up" }}
        </p>
        <button v-on:click="close" class="login-cancel-button ">
          X
        </button>
      </div>
      <div class="login-input-container">
        <input
          class="login-input"
          id="username-input"
          v-model="username"
          placeholder="username"
          type="text"
        /><input
          class="login-input "
          id="password-input"
          v-model="password"
          placeholder="password"
          type="password"
        />
        <p class="signup-error"></p>

        <input
          v-if="authType === 'signup'"
          class="login-input "
          placeholder="Confirm your password"
          type="password"
          v-model="message"
        />

        <button @click="handleAuth" class="login-button" id="main-auth-button">
          {{ authType === "login" ? "Login" : "Sign up" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { fetcher } from "../main";
export default {
  props: ["authType"],
  name: "AuthModal",
  data() {
    return {
      username: "",
      password: "",
      showAuthModal: false,
    };
  },

  methods: {
    setInputState: function(e) {
      this.setInputState(e.target.value);
    },
    handleAuth: function(e) {
      if (this.authType === "login") {
        fetcher("/login", {
          method: "POST",

          credentials: "include",
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
      }
    },
    close: function() {
      this.$emit("close-auth");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
