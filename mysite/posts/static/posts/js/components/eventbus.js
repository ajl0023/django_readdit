const eventHub = new Vue(); // Single event hub

// Distribute to components using global mixin
Vue.mixin({
  data: function() {
    return {
      eventHub: eventHub,
    };
  },
});
