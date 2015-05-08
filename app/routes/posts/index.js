import Ember from 'ember';
import RecordChunksMixin from '../../mixins/record-chunks';
import ResetScroll from '../../mixins/reset-scroll';
import RenderUsingTimings from '../../mixins/render-using-timings';

export default Ember.Route.extend(
    ResetScroll, RecordChunksMixin, RenderUsingTimings, {

  resourceName: 'post',

  limit: 20,
  offset: -20,

  measurementName: 'archive_view',

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
  }
});