<?php
/**
 * ezSQL - Class to make it very easy to deal with mySQL database connections.
 *
 * b2evo Additions:
 * - query log
 * - get_list
 *
 * b2evolution - {@link http://b2evolution.net/}
 * Released under GNU GPL License - {@link http://b2evolution.net/about/license.html}
 * @copyright (c)2003-2004 by Francois PLANQUE - {@link http://fplanque.net/}
 *
 * @package evocore
 * @author Justin Vincent (justin@visunet.ie), {@link http://php.justinvincent.com}
 * @todo PLEASE NOTE: this class isn't exactly as reliable as I'd like to. I am doing some transformations. (fplanque)
 */
if( !defined('DB_USER') ) die( 'Please, do not access this page directly.' );

/**
 * ezSQL Constants
 */
define( 'EZSQL_VERSION', '1.25' );
define( 'OBJECT', 'OBJECT', true );
define( 'ARRAY_A', 'ARRAY_A', true);
define( 'ARRAY_N', 'ARRAY_N', true);

if( ! function_exists( 'mysql_real_escape_string' ) )
{	// Function only available since PHP 4.3.0
	function mysql_real_escape_string( $unescaped_string )
	{
		return mysql_escape_string( $unescaped_string );
	}
}

/**
 * The Main Class
 *
 * @package evocore
 */
class DB
{

	var $trace = false;      // same as $debug_all
	var $debug_all = false;  // same as $trace
	var $show_errors = true;
	var $halt_on_error = true;
	var $error = false;		// no error yet
	var $num_queries = 0;
	var $last_query = '';		// last query SQL string
	var $last_error = '';			// last DB error string
	var $col_info;
	var $debug_called;
	var $vardump_called;
	var $insert_id = 0;
	var $num_rows = 0;
	var $rows_affected = 0;
	/**
	 * Log of queries:
	 */
	var $queries = array();
	/**
	 * Aliases that will be replaced in queries:
	 */
	var $dbaliases = array();
	/**
	 * Strings that will replace the aliases in queries:
	 */
	var $dbreplaces = array();

	/**
	 * DB Constructor
	 *
	 * connects to the server and selects a database
	 */
	function DB( $dbuser, $dbpassword, $dbname, $dbhost, $dbaliases, $halt_on_error = true )
	{
		$this->halt_on_error = $halt_on_error;

		$this->dbh = @mysql_connect($dbhost,$dbuser,$dbpassword);

		if( ! $this->dbh )
		{
			$this->print_error( '<strong>Error establishing a database connection!</strong>
				<ol>
					<li>Are you sure you have typed the correct user/password?</li>
					<li>Are you sure that you have typed the correct hostname?</li>
					<li>Are you sure that the database server is running?</li>
				</ol>' );
		}
		else
		{
			$this->select($dbname);
		}

		// Prepare aliases for replacements:
		foreach( $dbaliases as $dbalias => $dbreplace )
		{
			$this->dbaliases[] = '#\b'.$dbalias.'\b#'; // \b = word boundary
			$this->dbreplaces[] = $dbreplace;
			// echo '<br />'.'#\b'.$dbalias.'\b#';
		}
		// echo count($this->dbaliases);
	}

	/**
	 * Select a DB (if another one needs to be selected)
	 */
	function select($db)
	{
		if ( !@mysql_select_db($db,$this->dbh))
		{
			$this->print_error( '<strong>'.sprintf( T_('Error selecting database [%s]!'), $db ).'</strong>
				<ol>
					<li>Are you sure the database exists?</li>
					<li>Are you sure there is a valid database connection?</li>
				</ol>' );
		}
	}

	/**
	 * Format a string correctly for safe insert under all PHP conditions
	 */
	function escape($str)
	{
		return mysql_real_escape_string($str);
	}

	function quote($str)
	{
		if( $str === NULL )
			return 'NULL';
		else
			return "'".mysql_real_escape_string($str)."'";
	}

	function null($val)
	{
		if( $val === NULL )
			return 'NULL';
		else
			return $val;
	}

	/**
	 * Print SQL/DB error.
	 */
	function print_error($str = "")
	{
		// All errors go to the global error array $EZSQL_ERROR..
		global $EZSQL_ERROR;

		$this->error = true;

		// If no special error string then use mysql default..
		$this->last_error = empty($str) ? ( mysql_error().'(Errno='.mysql_errno().')' ) : $str;

		// Log this error to the global array..
		$EZSQL_ERROR[] = array
						(
							"query" => $this->last_query,
							"error_str"  => $this->last_error
						);

		// Is error output turned on or not..
		if ( $this->show_errors )
		{
			// If there is an error then take note of it
			echo '<div class="error">';
			echo '<p class="error">', T_('MySQL error!'), '</p>';
			echo '<p>', $this->last_error, '</p>';
			if( !empty($this->last_query) ) echo '<p class="error">Your query:<br /><code>'. $this->last_query. '</code></p>';
			echo '</div>';
		}

		if( $this->halt_on_error ) die();
	}

	/**
	 * Kill cached query results
	 */
	function flush()
	{
		// Get rid of these
		$this->last_result = NULL;
		$this->col_info = NULL;
		$this->last_query = NULL;
		$this->current_idx = 0;
	}


	/**
	 * Basic Query
	 *
	 * {@internal DB::query(-) }}
	 *
	 * @param string SQL query
	 * @param string title for debugging
	 * @return mixed # of rows affected or false if error
	 */
	function query( $query, $title = '' )
	{
		// initialise return
		$return_val = 0;

		// Flush cached values..
		$this->flush();

		// Log how the function was called
		$this->func_call = '$db->query("'.$query.'")';
		// echo $this->func_call, '<br />';

		// Replace aliases:
		$query = preg_replace( $this->dbaliases, $this->dbreplaces, $query );

		// Keep track of the last query for debug..
		$this->last_query = $query;

		// Perform the query via std mysql_query function..
		$this->num_queries++;
		$this->queries[ $this->num_queries - 1 ] = array(
																									'title' => $title,
																									'sql' => $query,
																									'rows' => -1 );

		$this->result = @mysql_query($query,$this->dbh);

		// If there is an error then take note of it..
		if ( mysql_error() )
		{
			$this->print_error();
			return false;
		}

		if( preg_match( '#^ \s* (insert|delete|update|replace) \s #ix', $query) )
		{	// Query was an insert, delete, update, replace:

			// echo 'insert, delete, update, replace';

			$this->rows_affected = mysql_affected_rows();
			$this->queries[ $this->num_queries - 1 ]['rows'] = $this->rows_affected;

			// Take note of the insert_id
			if ( preg_match("/^\\s*(insert|replace) /i",$query) )
			{
				$this->insert_id = mysql_insert_id($this->dbh);
			}

			// Return number fo rows affected
			$return_val = $this->rows_affected;
		}
		else
		{	// Query was a select:

			// echo 'select';

			// Take note of column info
			$i=0;
			while ($i < @mysql_num_fields($this->result))
			{
				$this->col_info[$i] = @mysql_fetch_field($this->result);
				$i++;
			}

			// Store Query Results
			$num_rows=0;
			while ( $row = @mysql_fetch_object($this->result) )
			{
				// Store relults as an objects within main array
				$this->last_result[$num_rows] = $row;
				$num_rows++;
			}

			@mysql_free_result($this->result);

			// Log number of rows the query returned
			$this->num_rows = $num_rows;
			$this->queries[ $this->num_queries - 1 ]['rows'] = $this->num_rows;

			// Return number of rows selected
			$return_val = $this->num_rows;
		}

		// If debug ALL queries
		$this->trace || $this->debug_all ? $this->debug() : NULL ;

		return $return_val;

	}

	/**
	 * Get one variable from the DB - see docs for more detail
	 */
	function get_var( $query=NULL, $x=0, $y=0, $title = '' )
	{
		// Log how the function was called
		$this->func_call = "\$db->get_var(\"$query\",$x,$y)";

		// If there is a query then perform it if not then use cached results..
		if ( $query )
		{
			$this->query($query, $title);
		}

		// Extract var out of cached results based x,y vals
		if ( $this->last_result[$y] )
		{
			$values = array_values(get_object_vars($this->last_result[$y]));
		}

		// If there is a value return it else return NULL
		return (isset($values[$x]) && $values[$x]!=='') ? $values[$x] : NULL;
	}

	/**
	 * Get one row from the DB - see docs for more detail
	 */
	function get_row($query=NULL,$output=OBJECT,$y=0, $title = '' )
	{
		// Log how the function was called
		$this->func_call = "\$db->get_row(\"$query\",$output,$y)";
		// echo $this->func_call, '<br />';

		// If there is a query then perform it if not then use cached results..
		if ( $query )
		{
			$this->query($query, $title);
		}

		// If the output is an object then return object using the row offset..
		if ( $output == OBJECT )
		{
			return $this->last_result[$y]?$this->last_result[$y]:NULL;
		}
		// If the output is an associative array then return row as such..
		elseif ( $output == ARRAY_A )
		{
			return $this->last_result[$y]?get_object_vars($this->last_result[$y]):NULL;
		}
		// If the output is an numerical array then return row as such..
		elseif ( $output == ARRAY_N )
		{
			return $this->last_result[$y]?array_values(get_object_vars($this->last_result[$y])):NULL;
		}
		// If invalid output type was specified..
		else
		{
			$this->print_error(" \$db->get_row(string query, output type, int offset) -- Output type must be one of: OBJECT, ARRAY_A, ARRAY_N");
		}

	}

	/**
	 * Function to get 1 column from the cached result set based in X index
	 * see docs for usage and info
	 */
	function get_col( $query = NULL, $x=0, $title = '' )
	{

		// If there is a query then perform it if not then use cached results..
		if ( $query )
		{
			$this->query($query, $title);
		}

		// Extract the column values
		$new_array = array();
		for ( $i=0; $i < count($this->last_result); $i++ )
		{
			$new_array[$i] = $this->get_var(NULL,$x,$i);
		}

		return $new_array;
	}

	function get_list( $query = NULL, $x=0 )
	{
		return implode( ',', $this->get_col( $query, $x=0 ) );
	}

	/**
	 * Return the the query as a result set - see docs for more details
	 */
	function get_results( $query=NULL, $output = OBJECT, $title = '' )
	{
		// Log how the function was called
		$this->func_call = "\$db->get_results(\"$query\", $output)";

		// If there is a query then perform it if not then use cached results..
		if ( $query )
		{
			$this->query($query, $title);
		}

		// Send back array of objects. Each row is an object
		if ( $output == OBJECT )
		{
			return $this->last_result;
		}
		elseif ( $output == ARRAY_A || $output == ARRAY_N )
		{
			if ( $this->last_result )
			{
				$i=0;
				foreach( $this->last_result as $row )
				{

					$new_array[$i] = get_object_vars($row);

					if ( $output == ARRAY_N )
					{
						$new_array[$i] = array_values($new_array[$i]);
					}

					$i++;
				}

				return $new_array;
			}
			else
			{
				return NULL;
			}
		}
	}


	/**
	 * Function to get column meta data info pertaining to the last query
	 * see docs for more info and usage
	 */
	function get_col_info($info_type="name",$col_offset=-1)
	{

		if ( $this->col_info )
		{
			if ( $col_offset == -1 )
			{
				$i=0;
				foreach($this->col_info as $col )
				{
					$new_array[$i] = $col->{$info_type};
					$i++;
				}
				return $new_array;
			}
			else
			{
				return $this->col_info[$col_offset]->{$info_type};
			}

		}

	}


	/**
	 * Dumps the contents of any input variable to screen in a nicely
	 * formatted and easy to understand way - any type: Object, Var or Array
	 */
	function vardump($mixed='')
	{

		echo "<p><table><tr><td bgcolor=ffffff><blockquote><font color=000090>";
		echo "<pre><font face=arial>";

		if ( ! $this->vardump_called )
		{
			echo "<font color=800080><b>ezSQL</b> (v".EZSQL_VERSION.") <b>Variable Dump..</b></font>\n\n";
		}

		$var_type = gettype ($mixed);
		print_r(($mixed?$mixed:"<font color=red>No Value / False</font>"));
		echo "\n\n<b>Type:</b> " . ucfirst($var_type) . "\n";
		echo "<b>Last Query</b> [$this->num_queries]<b>:</b> ".($this->last_query?$this->last_query:"NULL")."\n";
		echo "<b>Last Function Call:</b> " . ($this->func_call?$this->func_call:"None")."\n";
		echo "<b>Last Rows Returned:</b> ".count($this->last_result)."\n";
		echo "</font></pre></font></blockquote></td></tr></table>".$this->donation();
		echo "\n<hr size=1 noshade color=dddddd>";

		$this->vardump_called = true;

	}

	// Alias for the above function
	function dumpvar($mixed)
	{
		$this->vardump($mixed);
	}

	/**
	 * Displays the last query string that was sent to the database & a
	 * table listing results (if there were any).
	 * (abstracted into a seperate file to save server overhead).
	 */
	function debug()
	{

		echo "<blockquote>";

		// Only show ezSQL credits once..
		if ( ! $this->debug_called )
		{
			echo "<font color=800080 face=arial size=2><b>ezSQL</b> (v".EZSQL_VERSION.") <b>Debug..</b></font><p>\n";
		}
		echo "<font face=arial size=2 color=000099><b>Query</b> [$this->num_queries] <b>--</b> ";
		echo "[<font color=000000><b>$this->last_query</b></font>]</font><p>";

			echo "<font face=arial size=2 color=000099><b>Query Result..</b></font>";
			echo "<blockquote>";

		if ( $this->col_info )
		{

			// =====================================================
			// Results top rows

			echo "<table cellpadding=5 cellspacing=1 bgcolor=555555>";
			echo "<tr bgcolor=eeeeee><td nowrap valign=bottom><font color=555599 face=arial size=2><b>(row)</b></font></td>";


			for ( $i=0; $i < count($this->col_info); $i++ )
			{
				echo "<td nowrap align=left valign=top><font size=1 color=555599 face=arial>{$this->col_info[$i]->type} {$this->col_info[$i]->max_length}</font><br><span style='font-family: arial; font-size: 10pt; font-weight: bold;'>{$this->col_info[$i]->name}</span></td>";
			}

			echo "</tr>";

			// ======================================================
			// print main results

		if ( $this->last_result )
		{

			$i=0;
			foreach( $this->get_results(NULL,ARRAY_N) as $one_row )
			{
				$i++;
				echo "<tr bgcolor=ffffff><td bgcolor=eeeeee nowrap align=middle><font size=2 color=555599 face=arial>$i</font></td>";

				foreach ( $one_row as $item )
				{
					echo "<td nowrap><font face=arial size=2>$item</font></td>";
				}

				echo "</tr>";
			}

		} // if last result
		else
		{
			echo "<tr bgcolor=ffffff><td colspan=".(count($this->col_info)+1)."><font face=arial size=2>No Results</font></td></tr>";
		}

		echo "</table>";

		} // if col_info
		else
		{
			echo "<font face=arial size=2>No Results</font>";
		}

		echo "</blockquote></blockquote><hr noshade color=dddddd size=1>";


		$this->debug_called = true;
	}

	/**
	 * Displays all queries that have been exectuted
	 *
	 * {@internal DB::dump_queries(-) }}
	 */
	function dump_queries()
	{
		foreach( $this->queries as $query )
		{
			echo '<p><strong>Query: '.$query['title'].'</strong></p>';
			echo '<code>';
			$sql = str_replace( 'FROM', '<br />FROM', htmlspecialchars($query['sql']) );
			$sql = str_replace( 'WHERE', '<br />WHERE', $sql );
			$sql = str_replace( 'GROUP BY', '<br />GROUP BY', $sql );
			$sql = str_replace( 'ORDER BY', '<br />ORDER BY', $sql );
			$sql = str_replace( 'LIMIT', '<br />LIMIT', $sql );
			$sql = str_replace( 'AND ', '<br />&nbsp; AND ', $sql );
			$sql = str_replace( 'OR ', '<br />&nbsp; OR ', $sql );
			$sql = str_replace( 'VALUES', '<br />VALUES', $sql );
			echo $sql;
			echo '</code><br />';
			echo 'Rows: ', $query['rows'];
		}
	}


	// b2evo will donate to JV..
}

?>