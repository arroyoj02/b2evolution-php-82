<?php
require_once __DIR__.'/conf/_config.php';  // Reemplaza dirname(__FILE__) por __DIR__

require_once $inc_path.'_main.inc.php';

$Timer->resume('index.php');

if( ! isset($collections_Module) )
{   
    header('Location: '.$admin_url, true, 302); // Reemplaza header_redirect por header
    exit(0);
}

if( !init_requested_coll_or_process_tinyurl(true, true) )
{   
    if( $Settings->get('default_blog_ID') == -1 )
    {   
        global $dispatcher;

        if( ! is_logged_in() )
        {   
            $login_required = true;
            $validate_required = true;
            require $inc_path.'_init_login.inc.php';
        }
        require __DIR__.'/'.$dispatcher;
    }
    else
    {   
        require __DIR__.'/default.php';
    }
    exit();
}

$Timer->pause('index.php');

require $inc_path.'_blog_main.inc.php';

?>
