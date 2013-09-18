<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline-Simile
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlineSimile_Case_Fixture extends NeatlineSimile_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * Create exhibit, set `exhibit_id` GET parameter.
     */
    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->_exhibit();
        $this->request->setQuery('exhibit_id', $this->exhibit->id);
    }


}
