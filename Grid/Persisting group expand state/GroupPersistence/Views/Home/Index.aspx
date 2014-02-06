<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: ViewBag.Message %></h2>
    <%= Html.Telerik().Grid<GroupPersistence.Models.Product>()
            .Name("Grid")
            .Columns(columns =>
            {
            columns.Bound(p => p.ID).Width(100);
            columns.Bound(p => p.Category);
            columns.Bound(p => p.Name);
            })
            .Pageable(paging => paging.PageSize(20))
            .Groupable(g => g.Groups(groups => groups.Add(p => p.Category)))
            .ClientEvents(e => e.OnDataBound("onDataBound"))
            .DataBinding(dataBinding => dataBinding.Ajax().Select("Select", "Home"))
    %>

<script type="text/javascript">
//contains the group text (e.g. Category: Beverages) of all collapsed groups
var collapsed = {};

function onDataBound() {
    var grid = $(this).data("tGrid");

    //handle clicking of the toggle icon
    $(this).find(".t-grouping-row .t-icon").click(function(e) {
       // find the current table row (TR)
       var tr = $(this).closest("tr"); 
       
       // get the group text
       var group = tr.text();

       if ($(this).is(".t-collapse")) {
           // If the icon is collapse - mark the group as collapse
           collapsed[group] = true;
       } else {
           // otherwise remove it from the list of collapsed groups
           delete collapsed[group];
       }
    })

    // collapse all collapsed groups
    for (var group in collapsed) {
        var tr = $(this).find(".t-grouping-row:contains(" + group + ")");
        grid.collapseGroup(tr);
    }
}

</script>
</asp:Content>
