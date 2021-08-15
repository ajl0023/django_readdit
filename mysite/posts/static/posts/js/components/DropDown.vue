<template>
  <div
    v-bind:class="{
      'navbar-dropdown-container': dropDown,
      inactive: !dropDown,
    }"
  >
    <ul class="navbar-dropdown">
      <li>
        <button v-on:click="logout" class="navbar-dropdown-options ">
          Logout
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
import UpArrow from "../../images/up-arrow.svg";
import DownArrow from "../../images/down-arrow.svg";
import { vote } from "../main";
export default {
  name: "Nav-dropdown",

  data: function() {
    return {};
  },
  props: ["dropDown"],

  methods: {
    logout() {
      fetch("/logout");
    },
  },
};
</script>
