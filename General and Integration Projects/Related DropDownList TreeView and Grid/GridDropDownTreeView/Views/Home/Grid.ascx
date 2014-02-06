<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<int>" %>

<%--
Grid ajax binding: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-grid-data-binding-ajax-binding.html
--%>
<%= Html.Telerik().Grid<GridDropDownTreeView.Models.ProductionRequest>()
        .Name("Grid")
        .Columns(columns =>
            {
                columns.Bound(line => line.Name);
            })
        .Sortable()
        .DataBinding(dataBinding => dataBinding.Ajax()
           .Select("ProductionRequests", "Home", new { productionLineId = Model }))
%>