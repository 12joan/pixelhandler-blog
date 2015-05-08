import Ember from 'ember';

export default Ember.ArrayController.extend({
  // flag to show button for more
  hasMore: true,

  // flag to indicate an is loading state
  loadingMore: false,

  actions: {
    showMore: function () {
      this.set('loadingMore', true);
      return true;
    }
  }
});