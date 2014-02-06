<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <%= Html.Telerik().Grid<CustomGridFilter.Models.Product>()
            .Name("Grid")
            .Columns(columns =>
            {
            columns.Bound(p => p.ID).Width(100);
            columns.Bound(p => p.Name);
            columns.Bound(p => p.Category).Title("Category (custom filter)");
            })
            .Sortable()
            .Filterable()
            .ClientEvents(e => e.OnLoad("onLoad"))
            .DataBinding(dataBinding => dataBinding.Ajax().Select("Select", "Home"))
    %>
    <script>
    function onLoad() {
        $("#Grid th:contains(Category)") //find the header cell (th) for our column (Category)
            .find(".t-grid-filter") //find the filter button
            .click(function(e) { // subscribe to its click event
                var filterIcon = $(this);

                // craete the custom filtering UI - a select in this case
                var select = $("<select><option value=''>-- select --</option><option>Beverages</option><option>Food</option></select>");
    
                setTimeout(function() { //delay execution to allow the filtering menu to be created
                    var filterMenu =  filterIcon.data("filter");
                    filterMenu.find(":text").first().replaceWith(select);  // replace the first textbox with the new filter UI
                });
        });
    }
    </script>
</asp:Content>

