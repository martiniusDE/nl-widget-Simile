
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline-Simile
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Simile', function(
  Simile, Neatline, Backbone, Marionette, $, _) {


  Simile.View = Neatline.Shared.Widget.View.extend({


    id: 'simile',


    /**
     * Start SIMILE.
     */
    init: function() {
      this.__initSimile();
      this.__initSelect();
    },


    /**
     * Instantiate SIMILE.
     */
    __initSimile: function() {

      // Clobber `__history__.html`.
      SimileAjax.History.enabled = false;

      // Reference the event source.
      this.eventSource = new Timeline.DefaultEventSource();

      // Set theme properties.
      var theme = Timeline.ClassicTheme.create();
      theme.event.track.height  = 30;
      theme.event.tape.height   = 8;

      // Create the timeline.
      this.timeline = Timeline.create(this.el, [
        Timeline.createBandInfo({
          intervalUnit:   Timeline.DateTime.YEAR,
          intervalPixels: 100,
          eventSource:    this.eventSource,
          width:          '100%',
          theme:          theme
        })
      ]);

      // Reference the band.
      this.band = this.timeline.getBand(0);

    },


    /**
     * Publish `select` on event click.
     */
    __initSelect: function() {
      this.band._eventPainter._showBubble = function(x, y, evt) {
        Neatline.vent.trigger('select', evt.nModel);
      };
    },


    /**
     * Render a collection of records.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {
      this.eventSource.clear();
      records.each(_.bind(this.buildEvent, this));    
    },


    /**
     * Render a record on the timeline.
     *
     * @param {Object} record: The record.
     */
    buildEvent: function(record) {

      // Pass if no start date.
      if (!record.get('start_date')) return;

      // Default fields.
      var data = {
        text:   record.get('title'),
        start:  new Date(record.get('start_date')),
        color:  record.get('fill_color'),
      };

      // If present, add end date.
      var end = record.get('end_date');
      if (end) data['end'] = new Date(end);

      // Construct event, set model reference.
      var event = new Timeline.DefaultEventSource.Event(data);
      event.nModel = record;

      // Add to timeline.
      this.eventSource._events.add(event);
      this.eventSource._fire('onAddMany', []);
      this.timeline.layout();

      // Set color.
      this.setEventColor(event);

    },


    /**
     * Manifest the fill color on an event.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {
      var start = model.get('start_date');
      if (start) this.band.setCenterVisibleDate(new Date(start));
    },


    /**
     * Manifest the fill color on an event.
     *
     * @param {Object} event: The event to update.
     */
    setEventColor: function(event) {
      $(this.getEventElement(event)).css(
        'background', event.nModel.get('fill_color')
      );
    },


    /**
     * Get an event's DOM element on the timeline.
     *
     * @param {Object} event: The event.
     * @param {Object}: The DOM element.
     */
    getEventElement: function(event) {
      return this.band._eventPainter._eventIdToElmt[event._id];
    },


    /**
     * Clear all timeline events.
     */
    clear: function() {
      this.eventSource.clear();
    },


  });


});