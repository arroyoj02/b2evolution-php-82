/* This includes 11 files: src/evo_modal_window.js, src/evo_images.js, src/evo_user_crop.js, src/evo_user_report.js, src/evo_user_contact_groups.js, src/evo_rest_api.js, src/evo_item_flag.js, src/evo_links.js, src/evo_forms.js, ajax.js, src/ddexitpop.js */

function evo_prevent_key_enter(e){jQuery(e).keypress(function(e){if(13==e.keyCode)return!1})}function evo_render_star_rating(){jQuery("#comment_rating").each(function(e){var t=jQuery("span.raty_params",this);t&&jQuery(this).html("").raty(t)})}function openModalWindow(e,t,o,r,n,a){var i="overlay_page_active";void 0!==r&&1==r&&(i="overlay_page_active_transparent"),void 0===t&&(t="560px");var s="";void 0!==o&&(0<o||""!=o)&&(s=' style="height:'+o+'"'),0<jQuery("#overlay_page").length?jQuery("#overlay_page").html(e):(jQuery("body").append('<div id="screen_mask"></div><div id="overlay_wrap" style="width:'+t+'"><div id="overlay_layout"><div id="overlay_page"'+s+"></div></div></div>"),jQuery("#screen_mask").fadeTo(1,.5).fadeIn(200),jQuery("#overlay_page").html(e).addClass(i),jQuery(document).on("click","#close_button, #screen_mask, #overlay_page",function(e){if("overlay_page"!=jQuery(this).attr("id"))return closeModalWindow(),!1;var t=jQuery("#overlay_page form");if(t.length){var o=t.position().top+jQuery("#overlay_wrap").position().top,r=o+t.height();e.clientY>o&&e.clientY<r||closeModalWindow()}return!0}))}function closeModalWindow(e){return void 0===e&&(e=window.document),jQuery("#overlay_page",e).hide(),jQuery(".action_messages",e).remove(),jQuery("#server_messages",e).insertBefore(".first_payload_block"),jQuery("#overlay_wrap",e).remove(),jQuery("#screen_mask",e).remove(),!1}function user_crop_avatar(e,t,o){void 0===o&&(o="avatar");var r=750,n=jQuery(window).width(),a=jQuery(window).height(),i=a/n,s=10,_=10;s=320<(n=r<n?r:n<320?320:n)-2*s?10:0,_=320<(a=r<a?r:a<320?320:a)-2*_?10:0;var u=r<n?r:n,l=r<a?r:a;openModalWindow('<span id="spinner" class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',u+"px",l+"px",!0,evo_js_lang_crop_profile_pic,[evo_js_lang_crop,"btn-primary"],!0);var d=jQuery("div.modal-dialog div.modal-body").length?jQuery("div.modal-dialog div.modal-body"):jQuery("#overlay_page"),c=parseInt(d.css("paddingTop")),p=parseInt(d.css("paddingRight")),f=parseInt(d.css("paddingBottom")),h=parseInt(d.css("paddingLeft")),y=(jQuery("div.modal-dialog div.modal-body").length?parseInt(d.css("min-height")):l-100)-(c+f),v={user_ID:e,file_ID:t,aspect_ratio:i,content_width:u-(h+p),content_height:y,display_mode:"js",crumb_user:evo_js_crumb_user};return evo_js_is_backoffice?(v.ctrl="user",v.user_tab="crop",v.user_tab_from=o):(v.blog=evo_js_blog,v.disp="avatar",v.action="crop"),jQuery.ajax({type:"POST",url:evo_js_user_crop_ajax_url,data:v,success:function(e){openModalWindow(e,u+"px",l+"px",!0,evo_js_lang_crop_profile_pic,[evo_js_lang_crop,"btn-primary"])}}),!1}function user_report(e,t){openModalWindow('<span class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',"auto","",!0,evo_js_lang_report_user,[evo_js_lang_report_this_user_now,"btn-danger"],!0);var o={action:"get_user_report_form",user_ID:e,crumb_user:evo_js_crumb_user};return evo_js_is_backoffice?(o.is_backoffice=1,o.user_tab=t):o.blog=evo_js_blog,jQuery.ajax({type:"POST",url:evo_js_user_report_ajax_url,data:o,success:function(e){openModalWindow(e,"auto","",!0,evo_js_lang_report_user,[evo_js_lang_report_this_user_now,"btn-danger"])}}),!1}function user_contact_groups(e){return openModalWindow('<span class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',"auto","",!0,evo_js_lang_contact_groups,evo_js_lang_save,!0),jQuery.ajax({type:"POST",url:evo_js_user_contact_groups_ajax_url,data:{action:"get_user_contact_form",blog:evo_js_blog,user_ID:e,crumb_user:evo_js_crumb_user},success:function(e){openModalWindow(e,"auto","",!0,evo_js_lang_contact_groups,evo_js_lang_save)}}),!1}function evo_rest_api_request(url,params_func,func_method,method){var params=params_func,func=func_method;"function"==typeof params_func&&(func=params_func,params={},method=func_method),void 0===method&&(method="GET"),jQuery.ajax({contentType:"application/json; charset=utf-8",type:method,url:restapi_url+url,data:params}).then(function(data,textStatus,jqXHR){"object"==typeof jqXHR.responseJSON&&eval(func)(data,textStatus,jqXHR)})}function evo_rest_api_print_error(e,t,o){if("string"!=typeof t&&void 0===t.code&&(t=void 0===t.responseJSON?t.statusText:t.responseJSON),void 0===t.code)var r='<h4 class="text-danger">Unknown error: '+t+"</h4>";else r='<h4 class="text-danger">'+t.message+"</h4>",o&&(r+="<div><b>Code:</b> "+t.code+"</div><div><b>Status:</b> "+t.data.status+"</div>");evo_rest_api_end_loading(e,r)}function evo_rest_api_start_loading(e){jQuery(e).addClass("evo_rest_api_loading").append('<div class="evo_rest_api_loader">loading...</div>')}function evo_rest_api_end_loading(e,t){jQuery(e).removeClass("evo_rest_api_loading").html(t).find(".evo_rest_api_loader").remove()}function evo_link_initialize_fieldset(o){if(0<jQuery("#"+o+"attachments_fieldset_table").length){var e=jQuery("#"+o+"attachments_fieldset_table").height();e=320<e?320:e<97?97:e,jQuery("#"+o+"attachments_fieldset_wrapper").height(e),jQuery("#"+o+"attachments_fieldset_wrapper").resizable({minHeight:80,handles:"s",resize:function(e,t){jQuery("#"+o+"attachments_fieldset_wrapper").resizable("option","maxHeight",jQuery("#"+o+"attachments_fieldset_table").height()),evo_link_update_overlay(o)}}),jQuery(document).on("click","#"+o+"attachments_fieldset_wrapper .ui-resizable-handle",function(){var e=jQuery("#"+o+"attachments_fieldset_table").height(),t=jQuery("#"+o+"attachments_fieldset_wrapper").height()+80;jQuery("#"+o+"attachments_fieldset_wrapper").css("height",e<t?e:t),evo_link_update_overlay(o)})}}function evo_link_update_overlay(e){jQuery("#"+e+"attachments_fieldset_overlay").length&&jQuery("#"+e+"attachments_fieldset_overlay").css("height",jQuery("#"+e+"attachments_fieldset_wrapper").closest(".panel").height())}function evo_link_fix_wrapper_height(e){var t=void 0===e?"":e,o=jQuery("#"+t+"attachments_fieldset_table").height();jQuery("#"+t+"attachments_fieldset_wrapper").height()!=o&&jQuery("#"+t+"attachments_fieldset_wrapper").height(jQuery("#"+t+"attachments_fieldset_table").height())}function evo_link_change_position(o,e,t){var r=o,n=o.value,a=o.id.substr(17);return jQuery.get(e+"anon_async.php?action=set_object_link_position&link_ID="+a+"&link_position="+n+"&crumb_link="+t,{},function(e,t){"OK"==(e=ajax_debug_clear(e))?(evoFadeSuccess(jQuery(r).closest("tr")),jQuery(r).closest("td").removeClass("error"),"cover"==n&&jQuery("select[name=link_position][id!="+o.id+"] option[value=cover]:selected").each(function(){jQuery(this).parent().val("aftermore"),evoFadeSuccess(jQuery(this).closest("tr"))})):(jQuery(r).val(e),evoFadeFailure(jQuery(r).closest("tr")),jQuery(r.form).closest("td").addClass("error"))}),!1}function evo_link_insert_inline(e,t,o,r,n,a){if(null==r&&(r=0),void 0!==a){var i="["+e+":"+t;o.length&&(i+=":"+o),i+="]",void 0!==n&&!1!==n&&(i+=n+"[/"+e+"]");var s=jQuery("#display_position_"+t);0!=s.length&&"inline"!=s.val()?(deferInlineReminder=!0,evo_rest_api_request("links/"+t+"/position/inline",function(e){s.val("inline"),evoFadeSuccess(s.closest("tr")),s.closest("td").removeClass("error"),textarea_wrap_selection(a,i,"",r,window.document)},"POST"),deferInlineReminder=!1):textarea_wrap_selection(a,i,"",r,window.document)}}function evo_link_delete(r,n,a,e){return evo_rest_api_request("links/"+a,{action:e},function(e){if("item"==n||"comment"==n||"emailcampaign"==n||"message"==n){var t=window.b2evoCanvas;if(null!=t){var o=new RegExp("\\[(image|file|inline|video|audio|thumbnail):"+a+":?[^\\]]*\\]","ig");textarea_str_replace(t,o,"",window.document)}}jQuery(r).closest("tr").remove(),evo_link_fix_wrapper_height()},"DELETE"),!1}function evo_link_change_order(_,e,u){return evo_rest_api_request("links/"+e+"/"+u,function(e){var t=jQuery(_).closest("tr"),o=t.find("span[data-order]");if("move_up"==u){var r=o.attr("data-order"),n=jQuery(t.prev()).find("span[data-order]"),a=n.attr("data-order");t.prev().before(t),o.attr("data-order",a),n.attr("data-order",r)}else{r=o.attr("data-order");var i=jQuery(t.next()).find("span[data-order]"),s=i.attr("data-order");t.next().after(t),o.attr("data-order",s),i.attr("data-order",r)}evoFadeSuccess(t)},"POST"),!1}function evo_link_attach(e,t,o,r,n){return evo_rest_api_request("links",{action:"attach",type:e,object_ID:t,root:o,path:r},function(e){void 0===n&&(n="");var t=jQuery("#"+n+"attachments_fieldset_table .results table",window.parent.document),o=jQuery(e.list_content);t.replaceWith(jQuery("table",o)).promise().done(function(e){setTimeout(function(){window.parent.evo_link_fix_wrapper_height()},10)})}),!1}function evo_link_ajax_loading_overlay(){var e=jQuery("#attachments_fieldset_table"),t=!1;return 0==e.find(".results_ajax_loading").length&&(t=jQuery('<div class="results_ajax_loading"><div>&nbsp;</div></div>'),e.css("position","relative"),t.css({width:e.width(),height:e.height()}),e.append(t)),t}function evo_link_refresh_list(e,t,o){var r=evo_link_ajax_loading_overlay();return r&&evo_rest_api_request("links",{action:void 0===o?"refresh":"sort",type:e.toLowerCase(),object_ID:t},function(e){jQuery("#attachments_fieldset_table").html(e.html),r.remove(),evo_link_fix_wrapper_height()}),!1}function evo_link_sort_list(o){var r,n=jQuery("#"+o+"attachments_fieldset_table tbody.filelist_tbody tr");n.sort(function(e,t){var o=parseInt(jQuery("span[data-order]",e).attr("data-order")),r=parseInt(jQuery("span[data-order]",t).attr("data-order"));return(o=o||n.length)<(r=r||n.length)?-1:r<o?1:0}),$.each(n,function(e,t){0===e?jQuery(t).prependTo("#"+o+"attachments_fieldset_table tbody.filelist_tbody"):jQuery(t).insertAfter(r),r=t})}function ajax_debug_clear(e){return e=(e=e.replace(/<!-- Ajax response end -->/,"")).replace(/(<div class="jslog">[\s\S]*)/i,""),jQuery.trim(e)}function ajax_response_is_correct(e){return!!e.match(/<!-- Ajax response end -->/)&&""!=ajax_debug_clear(e)}jQuery(document).ready(function(){if("undefined"!=typeof evo_init_datepicker&&jQuery(evo_init_datepicker.selector).datepicker(evo_init_datepicker.config),"undefined"!=typeof evo_link_position_config){var t=(i=evo_link_position_config.config).display_inline_reminder,o=i.defer_inline_reminder;jQuery(document).on("change",evo_link_position_config.selector,{url:i.url,crumb:i.crumb},function(e){"inline"==this.value&&t&&!o&&(alert(i.alert_msg),t=!1),evo_link_change_position(this,e.data.url,e.data.crumb)})}if("undefined"!=typeof evo_itemform_renderers__click&&jQuery("#itemform_renderers .dropdown-menu").on("click",function(e){e.stopPropagation()}),"undefined"!=typeof evo_commentform_renderers__click&&jQuery("#commentform_renderers .dropdown-menu").on("click",function(e){e.stopPropagation()}),"undefined"!=typeof evo_disp_download_delay_config){var e=evo_disp_download_delay_config,r=setInterval(function(){jQuery("#download_timer").html(e),0==e&&(clearInterval(r),jQuery("#download_help_url").show()),e--},1e3);jQuery("#download_timer_js").show()}if("undefined"!=typeof evo_skin_bootstrap_forum__quote_button_click&&jQuery(".quote_button").click(function(){var e=jQuery("form[id^=evo_comment_form_id_]");return 0==e.length||(e.attr("action",jQuery(this).attr("href")),e.submit(),!1)}),"undefined"!=typeof evo_ajax_form_config)for(var n=Object.values(evo_ajax_form_config),a=0;a<n.length;a++){var i=n[a];window["ajax_form_offset_"+i.form_number]=jQuery("#ajax_form_number_"+i.form_number).offset().top,window["request_sent_"+i.form_number]=!1,window["ajax_form_loading_number_"+i.form_number]=0;var s="get_form"+i.form_number;window[s]=function(){var r="#ajax_form_number_"+i.form_number;window["ajax_form_loading_number_"+i.form_number]++,jQuery.ajax({url:htsrv_url+"anon_async.php",type:"POST",data:i.json_params,success:function(e){jQuery(r).html(ajax_debug_clear(e)),"get_comment_form"==i.json_params.action&&evo_render_star_rating()},error:function(e,t,o){jQuery(".loader_ajax_form",r).after('<div class="red center">'+o+": "+e.responseText+"</div>"),window["ajax_form_loading_number_"+i.form_number]<3&&setTimeout(function(){jQuery(".loader_ajax_form",r).next().remove(),window[s]()},1e3)}})};var _="check_and_show_"+i.form_number;window[_]=function(e){if(!window["request_sent_"+i.form_number]){var t=null!=typeof e&&e;(t=t||jQuery(window).scrollTop()>=window["ajax_form_offset_"+i.form_number]-jQuery(window).height()-20)&&(window["request_sent_"+i.form_number]=!0,window[s]())}},jQuery(window).scroll(function(){window[_]()}),jQuery(window).resize(function(){window[_]()}),window[_](i.load_ajax_form_on_page_load)}if("undefined"!=typeof evo_user_func__callback_filter_userlist&&(jQuery("#country").change(function(){jQuery(this),jQuery.ajax({type:"POST",url:htsrv_url+"anon_async.php",data:"action=get_regions_option_list&ctry_id="+jQuery(this).val(),success:function(e){jQuery("#region").html(ajax_debug_clear(e)),1<jQuery("#region option").length?jQuery("#region_filter").show():jQuery("#region_filter").hide(),load_subregions(0)}})}),jQuery("#region").change(function(){load_subregions(jQuery(this).val())}),jQuery("#subregion").change(function(){load_cities(jQuery("#country").val(),jQuery("#region").val(),jQuery(this).val())}),window.load_subregions=function(t){jQuery.ajax({type:"POST",url:htsrv_url+"anon_async.php",data:"action=get_subregions_option_list&rgn_id="+t,success:function(e){jQuery("#subregion").html(ajax_debug_clear(e)),1<jQuery("#subregion option").length?jQuery("#subregion_filter").show():jQuery("#subregion_filter").hide(),load_cities(jQuery("#country").val(),t,0)}})},window.load_cities=function(e,t,o){void 0===e&&(e=0),jQuery.ajax({type:"POST",url:htsrv_url+"anon_async.php",data:"action=get_cities_option_list&ctry_id="+e+"&rgn_id="+t+"&subrg_id="+o,success:function(e){jQuery("#city").html(ajax_debug_clear(e)),1<jQuery("#city option").length?jQuery("#city_filter").show():jQuery("#city_filter").hide()}})}),"undefined"!=typeof evo_widget_param_switcher_config)for(a=0;a<evo_widget_param_switcher_config.length;a++)i=evo_widget_param_switcher_config[a],jQuery("a[data-param-switcher="+i.widget_id+"]").click(function(){var e=i.default_params,t=new RegExp("([?&])(("+jQuery(this).data("code")+"|redir)=[^&]*(&|$))+","g"),o=location.href.replace(t,"$1");for(default_param in o=o.replace(/[\?&]$/,""),o+=-1===o.indexOf("?")?"?":"&",o+=jQuery(this).data("code")+"="+jQuery(this).data("value"),e)t=new RegExp("[?&]"+default_param+"=","g"),o.match(t)||(o+="&"+default_param+"="+e[default_param]);return o+="&redir=no",window.history.pushState("","",o),jQuery("a[data-param-switcher="+i.widget_id+"]").attr("class",i.link_class),jQuery(this).attr("class",i.active_link_class),!1});var u;"undefined"!=typeof coll_activity_stats_widget_config&&(window.resize_coll_activity_stat_widget=function(){var e=[],t=[],o=[],r=coll_activity_stats_widget_config.time_period;if(null==plot){plot=jQuery("#canvasbarschart").data("plot"),o=plot.axes.xaxis.ticks.slice(0);for(var n=0;n<plot.series.length;n++)e.push(plot.series[n].data.slice(0));if(7==e[0].length)t=e;else for(n=0;n<e.length;n++){for(var a=[],i=7,s=1;0<i;i--,s++)a.unshift([i,e[n][e[n].length-s][1]]);t.push(a)}}if(jQuery("#canvasbarschart").width()<650){if("last_week"!=r){for(n=0;n<plot.series.length;n++)plot.series[n].data=t[n];plot.axes.xaxis.ticks=o.slice(-7),r="last_week"}}else if("last_month"!=r){for(n=0;n<plot.series.length;n++)plot.series[n].data=e[n];plot.axes.xaxis.ticks=o,r="last_month"}plot.replot({resetAxes:!0})},jQuery(window).resize(function(){clearTimeout(u),u=setTimeout(resize_coll_activity_stat_widget,100)}))}),jQuery(document).ready(function(){"undefined"!=typeof evo_skin_bootstrap_forums__post_list_header&&jQuery("#evo_workflow_status_filter").change(function(){var e=location.href.replace(/([\?&])((status|redir)=[^&]*(&|$))+/,"$1"),t=jQuery(this).val();""!==t&&(e+=(-1==e.indexOf("?")?"?":"&")+"status="+t+"&redir=no"),location.href=e.replace("?&","?").replace(/\?$/,"")})}),jQuery(document).ready(function(){"undefined"!=typeof evo_comment_rating_config&&evo_render_star_rating()}),jQuery(document).ready(function(){"undefined"!=typeof evo_widget_coll_search_form&&(jQuery(evo_widget_coll_search_form.selector).tokenInput(evo_widget_coll_search_form.url,evo_widget_coll_search_form.config),void 0!==evo_widget_coll_search_form.placeholder&&jQuery("#token-input-search_author").attr("placeholder",evo_widget_coll_search_form.placeholder).css("width","100%"))}),jQuery(document).ready(function(){"undefined"!=typeof evo_autocomplete_login_config&&(jQuery("input.autocomplete_login").on("added",function(){jQuery("input.autocomplete_login").each(function(){if(!jQuery(this).hasClass("tt-input")&&!jQuery(this).hasClass("tt-hint")){var t="";t=jQuery(this).hasClass("only_assignees")?restapi_url+evo_autocomplete_login_config.url:restapi_url+"users/logins",jQuery(this).data("status")&&(t+="&status="+jQuery(this).data("status")),jQuery(this).typeahead(null,{displayKey:"login",source:function(e,r){jQuery.ajax({type:"GET",dataType:"JSON",url:t,data:{q:e},success:function(e){var t=new Array;for(var o in e.list)t.push({login:e.list[o]});r(t)}})}})}})}),jQuery("input.autocomplete_login").trigger("added"),evo_prevent_key_enter(evo_autocomplete_login_config.selector))}),jQuery(document).ready(function(){"undefined"!=typeof evo_widget_poll_initialize&&(jQuery('.evo_poll__selector input[type="checkbox"]').on("click",function(){var e=jQuery(this).closest(".evo_poll__table"),t=jQuery(".evo_poll__selector input:checked",e).length>=e.data("max-answers");jQuery(".evo_poll__selector input[type=checkbox]:not(:checked)",e).prop("disabled",t)}),jQuery(".evo_poll__table").each(function(){var e=jQuery(this);e.width()>e.parent().width()&&(jQuery(".evo_poll__title",e).css("white-space","normal"),jQuery(".evo_poll__title label",e).css({width:Math.floor(e.parent().width()/2)+"px","word-wrap":"break-word"}))}))}),jQuery(document).ready(function(){if("undefined"!=typeof evo_plugin_auto_anchors_settings){jQuery("h1, h2, h3, h4, h5, h6").each(function(){if(jQuery(this).attr("id")&&jQuery(this).hasClass("evo_auto_anchor_header")){var e=location.href.replace(/#.+$/,"")+"#"+jQuery(this).attr("id");jQuery(this).append(' <a href="'+e+'" class="evo_auto_anchor_link"><span class="fa fa-link"></span></a>')}});var t=jQuery("#evo_toolbar").length?jQuery("#evo_toolbar").height():0;jQuery(".evo_auto_anchor_link").on("click",function(){var e=jQuery(this).attr("href");return jQuery("html,body").animate({scrollTop:jQuery(this).offset().top-t-evo_plugin_auto_anchors_settings.offset_scroll},function(){window.history.pushState("","",e)}),!1})}}),jQuery(document).ready(function(){if("undefined"!=typeof evo_plugin_table_contents_settings){var o=jQuery("#evo_toolbar").length?jQuery("#evo_toolbar").height():0;jQuery(".evo_plugin__table_of_contents a").on("click",function(){var e=jQuery("#"+jQuery(this).data("anchor"));if(0==e.length||!e.prop("tagName").match(/^h[1-6]$/i))return!0;var t=jQuery(this).attr("href");return jQuery("html,body").animate({scrollTop:e.offset().top-o-evo_plugin_table_contents_settings.offset_scroll},function(){window.history.pushState("","",t)}),!1})}}),jQuery(document).keyup(function(e){27==e.keyCode&&closeModalWindow()}),jQuery(document).ready(function(){jQuery("img.loadimg").each(function(){jQuery(this).prop("complete")?(jQuery(this).removeClass("loadimg"),""==jQuery(this).attr("class")&&jQuery(this).removeAttr("class")):jQuery(this).on("load",function(){jQuery(this).removeClass("loadimg"),""==jQuery(this).attr("class")&&jQuery(this).removeAttr("class")})})}),jQuery(document).on("click","a.evo_post_flag_btn",function(){var t=jQuery(this),e=parseInt(t.data("id"));return 0<e&&(t.data("status","inprogress"),jQuery("span",jQuery(this)).addClass("fa-x--hover"),evo_rest_api_request("collections/"+t.data("coll")+"/items/"+e+"/flag",function(e){e.flag?(t.find("span:first").show(),t.find("span:last").hide()):(t.find("span:last").show(),t.find("span:first").hide()),jQuery("span",t).removeClass("fa-x--hover"),setTimeout(function(){t.removeData("status")},500)},"PUT")),!1}),jQuery(document).on("mouseover","a.evo_post_flag_btn",function(){"inprogress"!=jQuery(this).data("status")&&jQuery("span",jQuery(this)).addClass("fa-x--hover")}),jQuery(document).on("keydown","textarea, input",function(e){!e.metaKey&&!e.ctrlKey||13!=e.keyCode&&10!=e.keyCode||jQuery(this).closest("form").submit()});var ddexitpop=function(r){var n={delayregister:0,delayshow:200,hideaftershow:!0,displayfreq:"always",persistcookie:"ddexitpop_shown",fxclass:"rubberBand",mobileshowafter:3e3,onddexitpop:function(){}},e=["bounce","flash","pulse","rubberBand","shake","swing","tada","wobble","jello","bounceIn","bounceInDown","bounceInLeft","bounceInRight","bounceInUp","fadeIn","fadeInDown","fadeInDownBig","fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig","fadeInUp","fadeInUpBig","flipInX","flipInY","lightSpeedIn","rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight","slideInUp","slideInDown","slideInLeft","slideInRight","zoomIn","zoomInDown","zoomInLeft","zoomInRight","zoomInUp","rollIn"],t="ontouchstart"in window||0<navigator.msMaxTouchPoints?"touchstart":"click";function a(e){var t=new RegExp(e+"=[^;]+","i");return document.cookie.match(t)?document.cookie.match(t)[0].split("=")[1]:null}function i(e,t,o){var r="",n=new Date;if(void 0!==o){var a=parseInt(o)*(/hr/i.test(o)?60:/day/i.test(o)?1440:1);n.setMinutes(n.getMinutes()+a),r="; expires="+n.toUTCString()}document.cookie=e+"="+t+"; path=/"+r}var s={wrappermarkup:'<div id="ddexitpopwrapper"><div class="veil"></div></div>',$wrapperref:null,$contentref:null,displaypopup:!0,delayshowtimer:null,settings:null,ajaxrequest:function(e){var t=function(e){if(/^http/i.test(e)){var t=document.createElement("a");return t.href=e,t.href.replace(RegExp(t.hostname,"i"),location.hostname)}return e}(e);r.ajax({url:t,dataType:"html",error:function(e){alert("Error fetching content.<br />Server Response: "+e.responseText)},success:function(e){s.$contentref=r(e).appendTo(document.body),s.setup(s.$contentref)}})},detectexit:function(e){e.clientY<60&&(this.delayshowtimer=setTimeout(function(){s.showpopup(),s.settings.onddexitpop(s.$contentref)},this.settings.delayshow))},detectenter:function(e){e.clientY<60&&clearTimeout(this.delayshowtimer)},showpopup:function(){null!=this.$contentref&&1==this.displaypopup&&(!0===this.settings.randomizefxclass&&(this.settings.fxclass=e[Math.floor(Math.random()*e.length)]),this.$wrapperref.addClass("open"),this.$contentref.addClass(this.settings.fxclass),this.displaypopup=!1,this.settings.hideaftershow&&r(document).off("mouseleave.registerexit"))},hidepopup:function(){this.$wrapperref.removeClass("open"),this.$contentref.removeClass(this.settings.fxclass),this.displaypopup=!0},setup:function(e){this.$contentref.addClass("animated"),this.$wrapperref=r(this.wrappermarkup).appendTo(document.body),this.$wrapperref.append(this.$contentref),this.$wrapperref.find(".veil").on(t,function(){s.hidepopup()}),"always"!=this.settings.displayfreq&&("session"==this.settings.displayfreq?i(this.settings.persistcookie,"yes"):/\d+(hr|day)/i.test(this.settings.displayfreq)&&(i(this.settings.persistcookie,"yes",this.settings.displayfreq),i(this.settings.persistcookie+"_duration",this.settings.displayfreq,this.settings.displayfreq)))},init:function(e){var t=r.extend({},n,e),o=a(t.persistcookie+"_duration");!o||"session"!=t.displayfreq&&t.displayfreq==o||(i(t.persistcookie,"yes",-1),i(t.persistcookie+"_duration","",-1)),"always"!=t.displayfreq&&a(t.persistcookie)||("random"==t.fxclass&&(t.randomizefxclass=!0),"ajax"==(this.settings=t).contentsource[0]?this.ajaxrequest(t.contentsource[1]):"id"==t.contentsource[0]?(this.$contentref=r("#"+t.contentsource[1]).appendTo(document.body),this.setup(this.$contentref)):"inline"==t.contentsource[0]&&(this.$contentref=r(t.contentsource[1]).appendTo(document.body),this.setup(this.$contentref)),setTimeout(function(){r(document).on("mouseleave.registerexit",function(e){s.detectexit(e)}),r(document).on("mouseenter.registerenter",function(e){s.detectenter(e)})},t.delayregister),0<t.mobileshowafter&&r(document).one("touchstart",function(){setTimeout(function(){s.showpopup()},t.mobileshowafter)}))}};return s}(jQuery);