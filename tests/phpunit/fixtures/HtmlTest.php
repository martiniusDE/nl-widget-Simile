<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline-Simile
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_Html extends NeatlineSimile_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * Inject the real `layers.json`, mock exhibit.
     */
    public function setUp()
    {

        parent::setUp();

        // Inject real `layers.json`.
        Zend_Registry::set('layers', NL_DIR . '/layers.json');

        // Mock exhibit.
        $exhibit = $this->__exhibit();
        $exhibit->base_layer = 'OpenStreetMap';
        $exhibit->widgets = 'Simile';
        $exhibit->save();

        // Reload to join extensions.
        $exhibit = $this->reload($exhibit);

        // Set exhibit on view.
        get_view()->neatline_exhibit = $exhibit;

    }


    /**
     * `neatline-partial.html`
     */
    public function testNeatlinePartial()
    {
        $this->writeFixture(
            get_view()->partial('exhibits/partials/exhibit.php'),
            'neatline-partial.html'
        );
    }


    /**
     * `editor-partial.html`
     */
    public function testEditorPartial()
    {
        $this->writeFixture(
            get_view()->partial('exhibits/partials/editor_core.php'),
            'editor-partial.html'
        );
    }


}
