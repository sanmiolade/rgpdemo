$(document).ready(function(){
    //check if this is a mobile device
/*     const isMobile = window.matchMedia("only screen and (max-width: 770px)").matches;
    if (isMobile) {
        //Conditional script here
        alert('on Mobile');
    } */

    //set default to Dashboard
   loadDashboard();
   //resizeIframe(document.getElementById("mainIFrame"));
   



    //Attach and Listen to click events of elements of this Side Nav Bar link class.
  $(".mysidenavlinks").on("click", function () // extracts the target URL and the Icon and label of SideNav Link click
   {
       //alert('You clicked report2 ' + $(this).text());
       //get the target URL from the attribute
       const linkpageurl= $(this).attr("linkpageurl"); 
       //alert(linkpageurl);
       //Get the label of the link and the icon associated with it
       const label = $(this).find("div").html();
       //create the Icon Label Header HTML string
       const iconLabelHeaderHtml = '<h1 class="mt-2">' + label +'</h1>' +'<hr color="red" class="mt-0">';
       //Hide the Sidebar after clicked on Mobile devices
       const isMobile = window.matchMedia("only screen and (max-width: 770px)").matches;
       if (isMobile) $("body").toggleClass("sb-sidenav-toggled");
       loadMainContent(iconLabelHeaderHtml,linkpageurl);       
   });          

});

function loadMainContent(iconClassList,linkpageurl){
    $("#maincontentheader").html(iconClassList);
    resizeIframe(document.getElementById("mainIFrame"));
   // $("#maincontent").html('<h1 class="mt-2"> The Link page is not set.... </h1>' );
    if(linkpageurl !== undefined){
       
        $("#mainIFrame").attr('src',linkpageurl);    
    } // end If
    else
        $("#mainIFrame").attr('src',"");

}

function loadDashboard(){
    const $dashboard = $('#dashboard');
    const linkpageurl= $dashboard.attr("linkpageurl"); 
    //alert(linkpageurl);
    const label = $dashboard.find("div").html();

    var iconClassList = '<h1 class="mt-4">' + label +'</h1>' +'<hr color="red" class="mt-0">';
    loadMainContent(iconClassList,linkpageurl);
}

function getdim()
{
   // alert(document.getElementById("upnavbar").height);
/* 
    var elmnt = document.getElementById("upnavbar");
    var txt = "Height including padding and border: " + elmnt.offsetHeight + "px<br>";
    txt += "Width including padding and border: " + elmnt.offsetWidth + "px";

    var topnav = elmnt.offsetHeight;
    

    elmnt = document.getElementById("fixedbottom");
    var txt2 = "Height including padding and border: " + elmnt.offsetHeight + "px<br>";
    txt2 += "Width including padding and border: " + elmnt.offsetWidth + "px";

    var fixbot = elmnt.offsetHeight;

    elmnt = document.getElementById("maincontentheader");
    var txt3 = "Height including padding and border: " + elmnt.offsetHeight + "px<br>";
    txt3 += "Width including padding and border: " + elmnt.offsetWidth + "px";

    var mchr = elmnt.offsetHeight

    txt4 = document.body.clientHeight;

    document.getElementById("maincontent").innerHTML = txt + "<br>" + txt2 + "<br>" + txt3  + "<br>document body" + txt4;
    document.getElementById("maincontent").style.height = ((document.body.clientHeight - (topnav + fixbot + mchr))  * 0.98)+ "px";

    var txt5=document.getElementById("maincontent").offsetHeight;
    document.getElementById("maincontent").innerHTML = txt + "<br>" + txt2 + "<br>" + txt3  + "<br>document body" + txt4 + "<br> New Heignt" + txt5;    
     */

    resizeIframe(document.getElementById("mainIFrame"));

}

function resizeIframe(theframe){

    var src =theframe.getAttribute("src");
    console.log('Inside resizeIframe() ' + src);
    var upnavhgt = document.getElementById("upnavbar").offsetHeight;
    var fxbhgt  = document.getElementById("fixedbottom").offsetHeight; 
    var mchhgt = document.getElementById("maincontentheader").offsetHeight ;
    var freeheight = ((document.body.clientHeight - (upnavhgt + fxbhgt + mchhgt )) * 0.98 ) ;
    theframe.height = freeheight;
}

function doOnLoadFrame(theframe)
{
    var src =theframe.getAttribute("src");
    console.log('Inside doOnLoadFrame() ' + src);
    if(src !== null) { 
        console.log ('**** calling resizeIframe() to handle it');
        resizeIframe(theframe);
        
        if (theframe.height < theframe.contentWindow.document.body.scrollHeight)
        {
            console.log ('increasing Frame height');
            theframe.height = theframe.contentWindow.document.body.scrollHeight ;
        }
    }
}