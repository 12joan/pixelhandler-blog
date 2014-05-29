'use-strict';

require('../mixins/record_chunks_mixin');
require('../mixins/reset_scroll_mixin');

module.exports = App.PostsIndexRoute = Ember.Route.extend(
    App.RecordChunksMixin, App.ResetScroll, {

  resourceName: 'post',

  limit: 20,
  offset: -20,

  actions: {
    showMore: function () {
      this.refresh();
    }
  }
});
