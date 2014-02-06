  <%-- Tooltip - Over Column Information Quality Works
  --%> 
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<IQWorksTelerikCodeLib.Models.iqCompanyVM>>" %>
  <%if (false)
  {%>
  <script src="../../Scripts/jquery-1.4.1.js" type="text/javascript"></script>
 <% }%> 
 <script type="text/javascript">
       
     $(".iqNameTooltip").live("mouseover",
    function() {
       
        var companyno = $(this).nextAll('.cId').html();  
        var contact = $(this).nextAll('.gId').html();

        /* iqMod0001 Left this in to show the less efficient way to code this block -
        by iqworks
        $(this).append('<div class="iqTooltip t-group">'
        + "CompanyNo :" + companyno + '<br>' + "Contact :" + contact
        + '</div>');
        
        $(this).find('.iqTooltip ').css("left", $(this).position().left + 20);
        $(this).find('.iqTooltip ').css("top", $(this).position().top + $(this).height());
     
            $(".iqTooltip ").fadeIn(500); 
            
        $(".iqNameTooltip").live("mouseout", function() {
        $('.iqTooltip').remove();
        });  
     
     });  */
         
         // iqMod0001 A more efficient way - thanks to Alex Gyoshev at Telerik   
         $('<div class="iqTooltip t-group" />')
                .html('CompanyNo: ' + companyno + '<br/>Contact: ' + contact)
                .appendTo(this)
                .css({
                    left: $(this).position().left + 20,
                    top: $(this).position().top + $(this).height()
                })
                .fadeIn(500);
        })
        .live('mouseout', function() {
            $('.iqTooltip').remove();
        });    
        
        // END Tooltip
    

    
      
</script>     
   <h3><%= Html.ActionLink((String)Resources.IqResource.Std_Close, "Index", "Tooltips", new { workindex = 0 }, null)%> 
   <br /> 
   <i style="color:Red;"><%=Session["iqResult"]%> </i> </h3>  
   
        <%= Html.Telerik().Grid(Model)
              .Name("CompanyGrid") 
              .Columns(columns =>
                {
                    columns.Add(o => o.cCompanyName).Width(185).Title((string)Resources.IqResource.coCompanyName)
                     .HtmlAttributes(new { @class = "ihover cName iqNameTooltip"});
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
    <%=Resources.IqResource.Std_TooltipOverColumnDoc%>   
  </div>  
<style type="text/css">
 /* CompanyName is the element that we are tool tipping here.*/      
.iqNameTooltip
{
cursor: help;
border-bottom: dotted 1px brown;
}

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
  