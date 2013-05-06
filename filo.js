/*
 * FILo <> Facebook Image Loader jQuery Plugin v1.1
 * http://www.berlinpix.com/filo
 *
 * Copyright 2013, BerlinPix.com
 * licensed under the LGPL license.
 *
 * Date: 2013-05-02
 */
var filo_jQuery=jQuery.noConflict();filo_jQuery.fn.filo=function(b){if(filo_jQuery(this).length){void 0==b&&(b={container:this});-1==(void 0!=filo_jQuery(this).attr("class")&&filo_jQuery(this).attr("class").indexOf("template"))&&void 0!=b.template?filo_jQuery(this).addClass("template_"+b.template+" filo"):filo_jQuery(this).addClass("filo");var a=filo_jQuery(this).attr("id"),e=a+"_"+Date.now(),e=e.replace(".","");filo_jQuery(this).attr("id",e);filoHandler(filo_jQuery,e,a,b)}else console.log("filo container is undefined, please check the ID or class name")};
filo_jQuery.filo=function(b,a){void 0==a?a={container:"body"}:void 0==a.container&&(a.container="body");var e=b+"_"+Date.now(),e=e.replace(".",""),c=void 0!=a.template?"template_"+a.template:"";filo_jQuery(a.container).append('<div class="filo '+c+'" id="'+e+'"></div>');filoHandler(filo_jQuery,e,b,a)};jQuery.filo.getUrlParams=function(){for(var b=[],a,e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),c=0;c<e.length;c++)a=e[c].split("="),b.push(a[0]),b[a[0]]=a[1];return b};
function getUrlParams(){for(var b=[],a,e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),c=0;c<e.length;c++)a=e[c].split("="),b.push(a[0]),b[a[0]]=a[1];return b}
filo_jQuery(document).ready(function(){filo_jQuery.filo.toLoad=[];filo_jQuery.filo.isLoaded=[];filo_jQuery.filo.maxCountDefault=3;filo_jQuery.filo.overlayDefault="rgb(177,177,177)";filo_jQuery.filo.overlayOpacityDefault=0.5;filo_jQuery.filo.filo_loaderGraphicDefault="/img/bpx_loader.gif";filo_jQuery.filo.photos_array=null;filo_jQuery.filo.resize=!1;filo_jQuery.filo.closeButtons={black:"/img/close_black.png",white:"/img/close_white.png"};filo_jQuery.filo.defaultImage="/img/default.png";filo_jQuery.filo.order=
["normal","reverse","random"];filo_jQuery.filo.root_path=getRootPath();filo_jQuery.filo.ie=!1;filo_jQuery.support.cors=!0;filo_jQuery.each(filo_jQuery(".filo"),function(b,a){var e=filo_jQuery(a).attr("id"),c=e+"_"+Date.now()+"_"+Math.round(1E5*Math.random()),c=c.replace(".","");filo_jQuery(a).attr("id",c);var d=[];void 0!=filo_jQuery("#"+c).attr("maxCount")&&(d.maxCount=filo_jQuery("#"+c).attr("maxCount"));void 0!=filo_jQuery("#"+c).attr("href")&&(d.href=filo_jQuery("#"+c).attr("href"));d.method=
void 0!=filo_jQuery("#"+c).attr("method")?filo_jQuery("#"+c).attr("method"):"post";filoHandler(filo_jQuery,c,e,d)});filo_jQuery(window).resize(function(){resizeImage(filo_jQuery)})});
function filoHandler(b,a,e,c){if("function"==typeof c.before){var d=jQuery.Event("FILo Before Event");c.before(d)}d=b.filo.root_path;d=void 0==c.filo_loaderGraphic?d+b.filo.filo_loaderGraphicDefault:c.filo_loaderGraphic;if(null==b(".filo_loader")||0==b(".filo_loader").length){var g=new Image;g.onload=function(){b(g).css("marginTop",-1*(this.height/2));b(g).css("marginLeft",-1*(this.width/2));b("#"+String(a)).append(g)};g.setAttribute("class","filo_loader");g.src=d}var h=[];b.each(b("#"+String(a)).find(".excluded"),
function(a,c){h.push(b(c).attr("id"))});var f=[];b.each(b("#"+a).find(".album"),function(a,c){f.push(b(c).attr("id"))});if(void 0!=c.albums&&0<c.albums.length)for(d=0;d<c.albums.length;d++)f.push(decodeURI(c.albums[d]));if(void 0!=c.excluded&&0<c.excluded.length)for(d=0;d<c.excluded.length;d++)h.push(decodeURI(c.excluded[d]));var d="https://graph.facebook.com/fql?q=",l="",l=isInt(e)?JSON.stringify({albums:"SELECT aid, name FROM album WHERE owner = "+e}):JSON.stringify({page_id:"SELECT page_id FROM page WHERE username = '"+
e+"'",albums:"SELECT aid, name FROM album WHERE owner IN (SELECT page_id FROM #page_id)"}),d=d+encodeURIComponent(l);b.browser.msie?b.ajax({url:d,dataType:"jsonp"}).success(function(i){i=i.data;handleAlbum(b,a,e,1<i.length?i[1].fql_result_set:i[0].fql_result_set,f,h,c)}):b.getJSON(d,function(i){i=i.data;i=1<i.length?i[1].fql_result_set:i[0].fql_result_set;0>=i.length&&(b(".filo_loader").remove(),alert("There are no albums, please check your Facebook-ID"));handleAlbum(b,a,e,i,f,h,c)}).error(function(){b(".filo_loader").remove();
alert("Error while loading, please check your Facebook-ID or write me: info@berlinpix.com")})}
function handleAlbum(b,a,e,c,d,g,h){b.filo.toLoad[a]=0;b.filo.isLoaded[a]=0;var f="";0<d.length?b.each(c,function(c,i){if(inArray(i.name,d)){b.filo.toLoad[a]+=1;var g=b.filo.maxCountDefault;void 0!=b("#"+a+" #"+i.name).attr("maxCount")?g=parseInt(b("#"+a+" #"+i.name).attr("maxCount")):void 0!=b("#"+a+" #"+i.name.toLowerCase()).attr("maxCount")?g=parseInt(b("#"+a+" #"+i.name.toLowerCase()).attr("maxCount")):void 0!=h&&void 0!=h.maxCount&&(g=h.maxCount);f="all"==g?JSON.stringify({photos:"SELECT src, src_big FROM photo WHERE aid = '"+
i.aid+"'"}):JSON.stringify({photos:"SELECT src, src_big FROM photo WHERE aid = '"+i.aid+"' LIMIT "+g});var k="https://graph.facebook.com/fql?q="+encodeURIComponent(f);b("#"+a+" #"+i.name).remove();b("#"+a+" #"+i.name.toLowerCase()).remove();var j=b('<div class="album" id="'+i.name+'"></div>').append('<div class="title">'+i.name+'</div><div class="thumbs"></div>');b(j).hide();b("#"+a).append(j);b.browser.msie?b.ajax({url:k,dataType:"jsonp"}).success(function(c){handlePhoto(1,b,e,a,c.data[0].fql_result_set,
j,g,h)}):b.getJSON(k,function(c){handlePhoto(1,b,e,a,c.data[0].fql_result_set,j,g,h)})}}):b.each(c,function(c,i){if(!inArray(i.name,g)){b.filo.toLoad[a]+=1;var d=b.filo.maxCountDefault;void 0!=h&&void 0!=h.maxCount?d=h.maxCount:void 0!=b("#"+i.name).attr("maxCount")&&(d=parseInt(b("#"+i.name).attr("maxCount")));f="all"==d?JSON.stringify({photos:"SELECT src, src_big FROM photo WHERE aid = '"+i.aid+"'"}):JSON.stringify({photos:"SELECT src, src_big FROM photo WHERE aid = '"+i.aid+"' LIMIT "+d});var k=
"https://graph.facebook.com/fql?q="+encodeURIComponent(f),j=b('<div class="album" id="'+i.name+'"></div>').append('<div class="title">'+i.name+'</div><div class="thumbs"></div>').hide();b("#"+a).append(j);b.browser.msie?b.ajax({url:k,dataType:"jsonp"}).success(function(c){handlePhoto(1,b,e,a,c.data[0].fql_result_set,j,d,h)}):b.getJSON(k,function(c){handlePhoto(1,b,e,a,c.data[0].fql_result_set,j,d,h)})}})}
function handlePhoto(b,a,e,c,d,g,h,f){var l=1==b?1:26*(b-1),i=[],b=d,m=a.filo.root_path;if(void 0!=f.order&&"reverse"==f.order)b.reverse();else if(void 0!=f.order&&"random"==f.order){for(var k=[],j=[];k.length<h&&k.length<b.length;){var p=Math.floor(Math.random()*b.length);void 0==j[p]&&(k.push(b[p]),j[p]=!0)}b=k}a.each(b,function(b,c){i[l-1]=c.src_big;var j=1==l?" first":"",k=l==h?" last":"",n=new Image;n.setAttribute("class","picture filo_picture");n.setAttribute("id",l-1);var p=0;n.onerror=function(){2>
p?(console.log("load picture again: "+c.src),n.src=c.src,p++):(n.onerror=null,n.src=a.filo.root_path+a.filo.defaultImage)};n.src=c.src;j=a('<div class="thumb thumb_'+l+j+k+'"><div class="inner"><a href="'+c.src_big+'"></a></div></div>');a(j).find("a").append(n);a(g).find(".thumbs").append(j);a(g).find(".filo_picture").click(function(b){b.preventDefault();if(void 0!=f.href)return"post"==f.method.toLowerCase()?(a("body").append('<form id="filo_forward" method="POST" action="'+f.href+'"><input name="profile" value="'+
e+'" /><input name="album" value="'+a(g).attr("id")+'" /></form>'),a("#filo_forward").trigger("submit").remove()):document.location=f.href+"?profile="+e+"&album="+a(g).attr("id"),!1;if(1>a(".filo_overlay").length){a.filo.closeButton=m+a.filo.closeButtons.black;void 0!=f.closeButton&&(a.filo.closeButton=void 0!=a.filo.closeButtons[f.closeButton]?m+a.filo.closeButtons[f.closeButton]:f.closeButton);var b=Math.max.apply(null,a.map(a("body > *"),function(b){return parseInt(a(b).css("z-index"))?parseInt(a(b).css("z-index")):
1})),c=void 0!=f.overlay?"background: "+f.overlay+"; ":"background: "+a.filo.overlayDefault+";",d=void 0!=f.overlayOpacity?" opacity: "+f.overlayOpacity+";":" opacity: "+a.filo.overlayOpacityDefault+";";a("body").append('<div class="filo_overlay" style="z-index:'+(b+1)+';" ><div class="filo_overlay_background" style="'+c+d+'"></div><div class="filo_overlay_container"><div class="filo_overlay_container_left"></div><div class="filo_overlay_container_right"></div><div class="picture_counter"></div></div></div>');
var h=new Image;h.onload=function(){a(".filo_overlay_container").append(h);var b=0<a(".filo_overlay_container").css("border-width")?a(".filo_overlay_container").css("border-width"):17;a(this).css("right",-1*(this.width/2+b));a(this).css("top",-1*(this.height/2+b));h.setAttribute("class","filo_overlay_container_close");a(".filo_overlay_container_close").click(function(){a(".filo_overlay").remove()})};h.src=a.filo.closeButton;setNewImage(a,a(this).attr("id"),i,a(g).attr("id"));a(".filo_overlay_background").click(function(b){"filo_overlay_background"==
a(b.target).attr("class")&&a(".filo_overlay").remove()});a(".filo_overlay_container_left").click(function(){var b=parseInt(a(".filo_full_picture").attr("id"));0<b&&setNewImage(a,b-1,i,a(g).attr("id"))});a(".filo_overlay_container_right").click(function(){var b=parseInt(a(".filo_full_picture").attr("id"));b<i.length-1&&setNewImage(a,b+1,i,a(g).attr("id"))});a(".filo_overlay_container_left").mouseenter(function(){a(this).css("backgroundColor","none").css("background-image","url('"+m+"/img/left_white.png')").css("background-repeat",
"no-repeat").css("background-position","left center")}).mouseout(function(){a(this).css("background-image","")});a(".filo_overlay_container_right").mouseenter(function(){a(this).css("backgroundColor","none").css("background-image","url('"+m+"/img/right_white.png')").css("background-repeat","no-repeat").css("background-position","right center")}).mouseout(function(){a(this).css("background-image","")})}});if(l>=h)return a(g).append('<div class="clear"></div>'),!1;l++;l==d.length&&a(g).append('<div class="clear"></div>')});
a.filo.isLoaded[c]+=1;a(g).fadeIn("slow");a.filo.isLoaded[c]==a.filo.toLoad[c]&&(a("#"+c+" .album").last().attr("class",a("#"+c+" .album").last().attr("class")+" last"),a("#"+c).append('<div class="clear"></div>'),a("#"+c+" .add").remove(),a("#"+c+" .excluded").remove(),a("#"+c+" .filo_loader").remove(),"function"==typeof f.load&&(c=jQuery.Event("FILo Load Event"),f.load(c)))}
function setNewImage(b,a,e,c){b(".filo_overlay_container_left").show();b(".filo_overlay_container_right").show();0==a&&b(".filo_overlay_container_left").hide();a==e.length-1&&b(".filo_overlay_container_right").hide();var d=parseInt(b(".filo_overlay_container").css("border-top-width").split("px")[0]),g=parseInt(b(".picture_counter").height()),h=0.9*b(window).width()-d,f=0.9*b(window).height()-(d+g),l=new Image;l.onload=function(){var d=this.width,m=this.height,k,j;d>m?(k=d>h?h:d,j=k*m/d,j>f&&(j=m>
f?f:m,k=j*d/m)):(j=m>f?f:m,k=j*d/m,k>h&&(k=d>h?h:d,j=k*m/d));0<b(".filo_overlay_container .filo_full_picture").length?b(".filo_overlay_container .filo_full_picture").fadeOut(300,function(){b(l).css("display","none");l.width=k;l.height=j;b(".filo_overlay_container").width(k).height(j).css("margin-left",-1*(k/2)).css("margin-top",-1*(j/2)-g).prepend(l).find(l).fadeIn(300);b(this).remove();b(".filo_overlay_container_close").show();b(".filo_overlay_container .picture_counter").html("<span>Album: "+c+
" | Pic: "+(parseInt(a)+1)+" of "+e.length+"</span>")}):(b(l).width(k).height(j),b(".filo_overlay_container").width(k).height(j).css("margin-left",-1*(k/2)).css("margin-top",-1*(j/2)-g).prepend(l).fadeIn(300),b(".filo_overlay_container_close").show(),b(".filo_overlay_container .picture_counter").html("<span>Album: "+c+" | Pic: "+(parseInt(a)+1)+" of "+e.length+"</span>"))};l.setAttribute("class","filo_full_picture");l.setAttribute("id",a);l.src=e[a]}
function resizeImage(b){if(0<b(".filo_overlay").length&&!b.filo.resize){b(".filo_full_picture").css("width","").css("height","");resize=!0;var a=parseInt(b(".filo_overlay_container").css("border-top-width").split("px")[0]),e=parseInt(b(".picture_counter").height()),c=0.9*b(window).width()-a,a=0.9*b(window).height()-(a+e),d=parseInt(b(".filo_full_picture").width()),g=parseInt(b(".filo_full_picture").height()),h,f;d>g?(h=d>c?c:d,f=h*g/d,f>a&&(f=g>a?a:g,h=f*d/g)):(f=g>a?a:g,h=f*d/g,h>c&&(h=d>c?c:d,f=
h*g/d));b(".filo_overlay_container img.filo_full_picture").width(h);b(".filo_overlay_container").width(h).height(f).css("margin-left",-1*(h/2)).css("margin-top",-1*(f/2)-e);resize=!1}}function inArray(b,a){for(var e=0;e<a.length;e++)if(b.toLowerCase()==a[e].toLowerCase())return!0;return!1}
function getRootPath(){try{throw Error();}catch(b){var a="";if(void 0!=b.fileName)a=b.fileName.split("/");else{var e=document.getElementsByTagName("script");filo_jQuery.each(e,function(b,c){0<=c.src.indexOf("filo.js")&&(a=c.src.split("/"))})}if(""==a)return"filo/"}for(var e="",c=0;c<a.length-1;c++)e=c<a.length-2?e+(a[c]+"/"):e+a[c];return e}function isInt(b){return"number"===typeof b&&0==b%1};
