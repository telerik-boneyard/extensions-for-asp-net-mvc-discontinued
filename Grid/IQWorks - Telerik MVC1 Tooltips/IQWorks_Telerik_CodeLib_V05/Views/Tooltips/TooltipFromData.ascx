 <%-- Tooltip - From data Information Quality Works
  --%> 
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<IQWorksTelerikCodeLib.Models.iqCompanyVM>>" %>
  
 <script type="text/javascript">
   
     /* Global variables */
     var ajaxRequest; // An ajax Request Object
     var G_elementLeft; // Current cursor position LEFT
     var G_elementTop; // Current cursor position TOP


       /* Keep track of current position of mouse. Mousemove here, 
          runs througout the life of the page session. */
       $(document).mousemove(function(e){
        G_elementLeft = e.pageX;
        G_elementTop = e.pageY;
       });

     // START of $(document).ready for mouseover
       $(document).ready(function() {

           // START of mouseover
          
           $(".iqNameTooltipD").live("mouseover",
    function() {

        // BEGIN PAGE DIMENSIONS
        /* Create dimensions of this "moused over" element (CompanyName).
           top, right, bottom and left sides. */  
        var ofx = $(this).offset(); // Top&Left of element
        var selementLeft = ofx.left; // Left (comes in with decimal point 0.0)
        var selementTop = ofx.top; // Top (comes in with decimal point 0.0)
        selementLeft = Math.ceil(selementLeft); // Make whole number ( 0 )
        selementTop = Math.ceil(selementTop); // Make whole number ( 0 )

        // width and height of this particular CompanyName element
        var ht = $(this).height();
        var wt = $(this).width();

        // Calculate area (dimension) of CompanyName element 
        var leftSide = selementLeft; // The left side of the element
        var rightSide = selementLeft + wt; // Right side of the element
        var topSide = selementTop; // The Top of the element
        var bottomSide = selementTop + ht; // The bottom of the element
        /*  IE - Moving the cursor up the screen through the CompanyNames causes
           the mouseover to fire where the bottom of the element begins, 
           not where the bottom of the text is. 
           We give it 6. Dimensions should be calculated from the element, 
           not the text. */ 
           bottomSide += 6;   
        // END PAGE DIMENSIONS


        // Build getJSON Parameter
        var key = $(this).nextAll('.cId').html();  // key to this CompanyName 
        var url = "/Tooltips/CompanyGridTooltip/" + key; // Controller/Method/parm
        var thisi = this; // Copy 'this' to use inside getJSON callback
      
        /* We are at this point because the user mouse'ed over a new element, 
           so, we need to make a new getJSON request. This also 
           means if the user mouse'ed over an element previous to this
           we need to abort that previous one - we dont need it anymore. */

      if (ajaxRequest != null && ajaxRequest.readyState != 4) {
            try {
                ajaxRequest.abort();
                }
            catch (err) {}
        }

        /* Send a new getJSON request to the server and save XMLHttpRequest
           ajaxRequest object in case we need to abort it 
          (in the above ajaxRequest.abort). */
          
        // START of getJSON call
       ajaxRequest = $.getJSON(url, function(data, tstatus) { // START OF callback
        
            /* getJSON has returned from the server  
               and we are in the callback now - */

            /*  check to see if the cursor is STILL on the text of the same
                companyName. If it is, build and display the tooltip */
           if ((G_elementLeft >= leftSide)
             && (G_elementLeft <= rightSide)
             && (G_elementTop >= topSide)
             && (G_elementTop <= bottomSide)) {

                var name = data.name;
                var address = data.address;

                /* iqMod0001 A1* keep this in to show the less efficient way of 
                   coding this block (coded by me - ok, ok)
                $(thisi).append('<div class="iqTooltip t-group">' + name + " and " + address
                + '</div>');
                $(thisi).find('.iqTooltip ').css("left", $(thisi).position().left + 20);
                $(thisi).find('.iqTooltip ').css("top", $(thisi).position().top + $(thisi).height());
                $(".iqTooltip ").fadeIn(1); */
           
                // A more efficient way - thanks to Alex Gyoshev at Telerik
                $('<div class="iqTooltip t-group" />')
                .html('Name : ' + name + 'Address : ' + address)
                .appendTo(thisi)
                .css({
                    left: $(thisi).position().left + 20,
                    top: $(thisi).position().top + $(thisi).height()
                })
                .fadeIn(1);
                        
            } // *** END of check to see if cursor is STILL within the element

        } // End of getJSON callback
       ); // End of getJSON call
       
    }); // End of mouseover

           // when the cursor leaves the element, remove it.
    $(".iqNameTooltipD").live("mouseout", function() {
             $('.iqTooltip').remove();
           });
       }); // End of $(document).ready  
       
</script>     
   <h3><%= Html.ActionLink((String)Resources.IqResource.Std_Close, "Index", "Tooltips", new { workindex = 0 }, null)%> 
   <br /> 
   <i style="color:Red;"><%=Session["iqResult"]%> </i> </h3>  
   
        <%= Html.Telerik().Grid(Model)
              .Name("CompanyGrid") 
              .Columns(columns =>
                {
                    columns.Add(o => o.cCompanyName).Width(185).Title((string)Resources.IqResource.coCompanyName)
                     .HtmlAttributes(new { @class = "ihover cName iqNameTooltipD"});
                    columns.Add(o => o.cContact).Width(185).Title((string)Resources.IqResource.coContact);
                    columns.Add(o => o.cEmail).Format(Html.Mailto("{0}", "{0}")).Encoded(false).Width(300)
                        .Title(Resources.IqResource.coEmail)
                        .HtmlAttributes(new { @class = "qcId" }); 
                    columns.Add(o => o.cCompanyNo) 
                      .HeaderHtmlAttributes(new { style = "display:none" })
                      .HtmlAttributes(new { @class = "cId", style = "display:none" });
                    columns.Add(o => o.cContact) 
                      .HeaderHtmlAttributes(new { style = "display:none" })
                      .HtmlAttributes(new { @class = "gId", style = "display:none" });
               })
               
               .DataBinding(dataBinding => dataBinding.Ajax().Select("_AjaxBindingCompany", "Tooltips"))
               .Pageable()
               .Sortable(sort => sort.SortMode(GridSortMode.MultipleColumn))
               .Scrollable(scrolling => scrolling.Height(253))
               %>  

  <div class="iqVerbiage" >
    <%=Resources.IqResource.Std_TooltipFromDataDoc%>   
  </div>                        
  
<style type="text/css">
 /* CompanyName is the element that we are tool tipping here.  
 */     
.iqNameTooltipD 
{
cursor: help;
border-bottom: dotted 1px brown;
}

/* This is for the actual tooltip container */
.iqTooltip 
{
padding-left: 10px;
padding-right: 10px;
padding-top: 3px;
padding-bottom: 3px;
display: none;
position: absolute;
/*background-color: #ff9;*/
border: solid 3px #333;
z-index: 999;
}
</style>
  