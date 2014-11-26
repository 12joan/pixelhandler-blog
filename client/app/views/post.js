import Ember from 'ember';

export default  Ember.View.extend({
  didInsertElement: function () {
    var notTesting = !Ember.testing;
    var notCrawler = window.location.search.match(/_escaped_fragment_/) === null;
    var notPrerender = window.navigator.userAgent.match(/Prerender/) === null;
    var notLocal = window.location.hostname.match(/localhost/) === null;
    if (notTesting && notCrawler && notPrerender && notLocal) {
      this.configureDisqus();
      this.setupDisqus();
    }
  },

  modelIdDidChange: function () {
    Ember.run.scheduleOnce('afterRender', function () {
      window.scroll(0, 0);
    });
  }.observes('controller.model.id'),

  disqusShortName: 'pixelhandler',

  disqusIdChanged: function () {
    this.configureDisqus();
    this.resetDisqus();
  }.observes('controller.disqusId'),

  configureDisqus: function () {
    var w = window;
    var title = this.get('controller.disqusTitle');
    w.disqus_shortname = this.get('disqusShortName');
    w.disqus_identifier = this.get('controller.disqusId');
    w.disqus_url = this.get('controller.disqusUrl');
    w.disqus_config = function () {
      this.page.identifier = w.disqus_identifier;
      this.page.url = w.disqus_url;
      this.page.title = title;
      this.language = "en";
    };
  },

  setupDisqus: function () {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + window.disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  },

  resetDisqus: function () {
    Ember.run.scheduleOnce('afterRender', function () {
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: window.disqus_config
        });
      }
    });
  }
});
