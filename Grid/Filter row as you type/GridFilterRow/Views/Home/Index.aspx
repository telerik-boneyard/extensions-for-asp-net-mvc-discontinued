<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<%: Html.Telerik().Grid<GridFilterRow.Models.Order>()
        .Name("Grid")
        .Columns(columns =>
            {
                columns.Bound(o => o.OrderID).Filterable(false);
                columns.Bound(o => o.ShipName);
                columns.Bound(o => o.ShipCity);
                columns.Bound(o => o.ShipCountry);
            })
        .Filterable()
        .Pageable()
        .Sortable()
        .ClientEvents(e => e.OnLoad("onLoad"))
        .DataBinding(dataBinding => dataBinding.Ajax().Select("Select", "Home"))
%>
<script>
function onLoad(e) {
    // get instance to the grid client-side object
    var grid = $(this).data("tGrid");
    // hide the filtering icons
    $(".t-grid-filter", this).hide();
    // get the table header (thead) which contains all grid column header elements
    var thead = $(this).find("thead:first");
    // create the filtering row
    var tr = $("<tr>").appendTo(thead);
    // get all column header cells
    var th = thead.find("th:not(.t-group-cell,.t-hierarchy-cell)"); 

    $.each(grid.columns, function(index, column) {
        // create a cell which will contain the filtering UI
        var cell = $("<th class='t-header'>&nbsp;</th>").appendTo(tr);

        // check if the column is filterable
        if (th.eq(index).find(".t-grid-filter").length) { 
            var timeout;
            // create the filtering textbox
            var textbox = $("<input>").keyup(function(e) {
                // uncomment the following if you want to filter only when ENTER is pressed
                //if (e.keyCode != 13) {
                //    return;
                //}

                // get the updated value of the textbox
                var value = this.value;

                // create the filtering expression - check here for more options: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-grid-client-api-and-events.html#filter
                var filterExpr;

                if (column.type == "String") { 
                    filterExpr = column.member + "~substringof~'" + value + "'";
                } else {
                    filterExpr = column.member + "~eq~" + value;
                }

                // clear any pending filtering requests - timeout is needed to avoid sending too many requests
                clearTimeout(timeout);

                // filter the grid after 100 milliseconds
                timeout = setTimeout(function() {
                    grid.filter(filterExpr);
                }, 100);
            });
            // append the texbox to the filter cell
            cell.empty().append(textbox);
        }
    });
}
</script>
</asp:Content>
