<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * PHPUnit runner.
 *
 * @package     omeka
 * @subpackage  neatline-SIMILE
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!($omeka = getenv('OMEKA_DIR'))) {
    $omeka = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
}

require_once $omeka . '/application/tests/bootstrap.php';
require_once dirname(__FILE__) . '/../../NeatlineSimilePlugin.php';
require_once 'NeatlineSimile_Test_AppTestCase.php';
