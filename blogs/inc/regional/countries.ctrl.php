<?php
/**
 * This file is part of the evoCore framework - {@link http://evocore.net/}
 * See also {@link http://sourceforge.net/projects/evocms/}.
 *
 * @copyright (c)2009 by Francois PLANQUE - {@link http://fplanque.net/}
 * Parts of this file are copyright (c)2009 by The Evo Factory - {@link http://www.evofactory.com/}.
 *
 * {@internal License choice
 * - If you have received this file as part of a package, please find the license.txt file in
 *   the same folder or the closest folder above for complete license terms.
 * - If you have received this file individually (e-g: from http://evocms.cvs.sourceforge.net/)
 *   then you must choose one of the following licenses before using the file:
 *   - GNU General Public License 2 (GPL) - http://www.opensource.org/licenses/gpl-license.php
 *   - Mozilla Public License 1.1 (MPL) - http://www.opensource.org/licenses/mozilla1.1.php
 * }}
 *
 * {@internal Open Source relicensing agreement:
 * The Evo Factory grants Francois PLANQUE the right to license
 * The Evo Factory's contributions to this file and the b2evolution project
 * under any OSI approved OSS license (http://www.opensource.org/licenses/).
 * }}
 *
 * @package evocore
 *
 * {@internal Below is a list of authors who have contributed to design/coding of this file: }}
 * @author efy-maxim: Evo Factory / Maxim.
 * @author fplanque: Francois Planque.
 *
 * @version $Id$
 */

if( !defined('EVO_MAIN_INIT') ) die( 'Please, do not access this page directly.' );

// Load Country class (PHP4):
load_class( 'regional/model/_country.class.php', 'Country' );

/**
 * @var User
 */
global $current_User;

// Check minimum permission:
$current_User->check_perm( 'options', 'edit', true );

// Set options path:
$AdminUI->set_path( 'options', 'countries' );

// Get action parameter from request:
param_action();

if( param( 'ctry_ID', 'integer', '', true) )
{// Load country from cache:
	$CountryCache = & get_Cache( 'CountryCache' );
	if( ($edited_Country = & $CountryCache->get_by_ID( $ctry_ID, false )) === false )
	{	unset( $edited_Country );
		forget_param( 'ctry_ID' );
		$Messages->add( sprintf( T_('Requested &laquo;%s&raquo; object does not exist any longer.'), T_('Country') ), 'error' );
		$action = 'nil';
	}
}

switch( $action )
{

	case 'new':
		// Check permission:
		$current_User->check_perm( 'options', 'edit', true );

		if( ! isset($edited_Country) )
		{	// We don't have a model to use, start with blank object:
			$edited_Country = new Country();
		}
		else
		{	// Duplicate object in order no to mess with the cache:
			$edited_Country = duplicate( $edited_Country ); // PHP4/5 abstraction
			$edited_Country->ID = 0;
		}
		break;

	case 'edit':
		// Check permission:
		$current_User->check_perm( 'options', 'edit', true );

		// Make sure we got an ctry_ID:
		param( 'ctry_ID', 'integer', true );
 		break;

	case 'create': // Record new country
	case 'create_new': // Record country and create new
	case 'create_copy': // Record country and create similar
		// Insert new country:
		$edited_Country = & new Country();

		// Check permission:
		$current_User->check_perm( 'options', 'edit', true );

		// Load data from request
		if( $edited_Country->load_from_Request() )
		{	// We could load data from form without errors:

			// Insert in DB:
			$DB->begin();
			$q = $edited_Country->dbexists();
			if($q)
			{	// We have a duplicate entry:

				param_error( 'ctry_code',
					sprintf( T_('This country already exists. Do you want to <a %s>edit the existing country</a>?'),
						'href="?ctrl=countries&amp;action=edit&amp;ctry_ID='.$q.'"' ) );
			}
			else
			{
				$edited_Country->dbinsert();
				$Messages->add( T_('New country created.'), 'success' );
			}
			$DB->commit();

			if( empty($q) )
			{	// What next?

				switch( $action )
				{
					case 'create_copy':
						// Redirect so that a reload doesn't write to the DB twice:
						header_redirect( '?ctrl=countries&action=new&ctry_ID='.$edited_Country->ID, 303 ); // Will EXIT
						// We have EXITed already at this point!!
						break;
					case 'create_new':
						// Redirect so that a reload doesn't write to the DB twice:
						header_redirect( '?ctrl=countries&action=new', 303 ); // Will EXIT
						// We have EXITed already at this point!!
						break;
					case 'create':
						// Redirect so that a reload doesn't write to the DB twice:
						header_redirect( '?ctrl=countries', 303 ); // Will EXIT
						// We have EXITed already at this point!!
						break;
				}
			}
		}
		break;

	case 'update':
		// Edit country form:

		// Check permission:
		$current_User->check_perm( 'options', 'edit', true );

		// Make sure we got an ctry_ID:
		param( 'ctry_ID', 'integer', true );

		// load data from request
		if( $edited_Country->load_from_Request() )
		{	// We could load data from form without errors:

			// Update in DB:
			$DB->begin();
			$q = $edited_Country->dbexists();
			if($q)
			{ 	// We have a duplicate entry:
				param_error( 'ctry_code',
					sprintf( T_('This country already exists. Do you want to <a %s>edit the existing country</a>?'),
						'href="?ctrl=countries&amp;action=edit&amp;ctry_ID='.$q.'"' ) );
			}
			else
			{
				$edited_Country->dbupdate();
				$Messages->add( T_('Country updated.'), 'success' );
			}
			$DB->commit();

			if( empty($q) )
			{	// If no error, Redirect so that a reload doesn't write to the DB twice:
				header_redirect( '?ctrl=countries', 303 ); // Will EXIT
				// We have EXITed already at this point!!
			}
		}
		break;

	case 'delete':
		// Delete country:

		// Check permission:
		$current_User->check_perm( 'options', 'edit', true );

		// Make sure we got an ctry_ID:
		param( 'ctry_ID', 'integer', true );

		if( param( 'confirm', 'integer', 0 ) )
		{ // confirmed, Delete from DB:
			$msg = sprintf( T_('Country &laquo;%s&raquo; deleted.'), $edited_Country->dget('name') );
			$edited_Country->dbdelete( true );
			unset( $edited_Country );
			forget_param( 'ctry_ID' );
			$Messages->add( $msg, 'success' );
			// Redirect so that a reload doesn't write to the DB twice:
			header_redirect( '?ctrl=countries', 303 ); // Will EXIT
			// We have EXITed already at this point!!
		}
		else
		{	// not confirmed, Check for restrictions:
			if( ! $edited_Country->check_delete( sprintf( T_('Cannot delete country &laquo;%s&raquo;'), $edited_Country->dget('name') ) ) )
			{	// There are restrictions:
				$action = 'view';
			}
		}
		break;

}

// Display <html><head>...</head> section! (Note: should be done early if actions do not redirect)
$AdminUI->disp_html_head();

// Display title, menu, messages, etc. (Note: messages MUST be displayed AFTER the actions)
$AdminUI->disp_body_top();

$AdminUI->disp_payload_begin();

/**
 * Display payload:
 */
switch( $action )
{
	case 'nil':
		// Do nothing
		break;


	case 'delete':
		// We need to ask for confirmation:
		$edited_Country->confirm_delete(
				sprintf( T_('Delete country &laquo;%s&raquo;?'), $edited_Country->dget('name') ),
				$action, get_memorized( 'action' ) );
	case 'new':
	case 'create':
	case 'create_new':
	case 'create_copy':
	case 'edit':
	case 'update':
		$AdminUI->disp_view( 'regional/views/_country.form.php' );
		break;

	default:
		// No specific request, list all countries:
		// Cleanup context:
		forget_param( 'ctry_ID' );
		// Display country list:
		$AdminUI->disp_view( 'regional/views/_country_list.view.php' );
		break;
}

$AdminUI->disp_payload_end();

// Display body bottom, debug info and close </html>:
$AdminUI->disp_global_footer();

?>