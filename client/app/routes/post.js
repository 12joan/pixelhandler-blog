import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

var PostRoute = Ember.Route.extend(ResetScroll, {
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var found = this.store.filter('post', function (post) {
        return post.get('slug') === params.post_slug;
      });
      if (found.get('length') > 0) {
        resolve(found[0]);
      } else {
        this.store.find('post', params.post_slug).then(
          function (post) {
            resolve(post);
          },
          function (error) {
            reject(error);
          }
        );
      }
    }.bind(this));
  },

  afterModel: function(post) {
    return post.get('author').reload().then(function () {
      console.log('author.name', post.get('author.name'));
    });
  },

  serialize: function (model) {
    return { post_slug: model.get('slug') };
  },

  setupController: function (controller, model) {
    if (typeof model.toArray === 'function') {
      var filtered = model.toArray();
      model = (filtered.length) ? filtered[0] : model;
    }
    this._super(controller, model);
    controller.setProperties({
      'disqusId': model.get('slug'),
      'disqusUrl': getUrl(),
      'disqusTitle': model.get('title')
    });
  },

  actions: {
    error: function (error) {
      Ember.Logger.error(error);
      this.transitionTo('/not-found');
    }
  }
});

function getUrl() {
  var loc = window.location;
  return [ loc.protocol, '//', loc.host, loc.pathname].join('');
}

export default PostRoute;
