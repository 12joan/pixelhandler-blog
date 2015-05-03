import EO from 'ember-orbit';
import computedFake from '../utils/computed-fake';

var attr = EO.attr;
var hasOne = EO.hasOne;

var Post = EO.Model.extend({
  type: 'posts',

  slug: attr('string'),
  title: attr('string'),
  date: attr('date'),
  excerpt: attr('string'),
  body: attr('string'),

  author: hasOne('author', { inverse: 'posts' }),

  resourceName: 'post',

  slugInput: computedFake('model.slug'),
  titleInput: computedFake('model.title'),
  excerptInput: computedFake('model.excerpt'),
  bodyInput: computedFake('model.body'),
  dateInput: null
});

Post.reopenClass({
  newRecord: function () {
    return Ember.Object.create({
      type: 'posts', slug: '', title: '', date: null, excerpt: '', body: '', links: {},
      toJSON: function () {
        var props = "type slug title date excerpt body links".w();
        return this.getProperties(props);
      },
      isNew: true
    });
  },

  createRecord: function (store, newRecord, authorId) {
    const payload = newRecord.toJSON();
    // Had to remove the thenable solution to add links after create
    // record had wrong primary id (client generated?)
    payload.links.author = { linkage: { type: 'authors', id: authorId } };
    store.add('post', payload);
  },

  deleteRecord: function (record, author) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      author.removeLink('posts', record).then(function () {
        return record.remove();
      }).then(function () {
        resolve();
      }).catch(function(error) {
        Ember.Logger.error(error);
        reject(error);
      });
    });
  },

  createSlug: function (model, title) {
    title = title || model.get('title');
    if (!title || !Ember.isEmpty(model.get('slug'))) { return false; }
    if (Ember.isEmpty(title)) { return title; }
    let slug = title.toLowerCase().dasherize();
    slug = slug.replace(/\(|\)|\[|\]|:|\./g, '');
    model.setProperties({'slugInput': slug, 'slug': slug});
  },

  setDate: function (model, input) {
    input = input || model.get('dateInput');
    if (!input) { return input; }
    model.set('date', new Date(input));
  }
});

export default Post;
