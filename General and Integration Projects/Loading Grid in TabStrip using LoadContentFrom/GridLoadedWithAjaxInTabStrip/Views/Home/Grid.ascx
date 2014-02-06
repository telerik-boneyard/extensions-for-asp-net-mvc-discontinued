<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<dynamic>" %>

<%-- 
    The grid is configured for ajax binding: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-grid-data-binding-ajax-binding.html
    Server bound grid will not work in a tab loaded via ajax
--%>

<%: Html.Telerik().Grid<GridLoadedWithAjaxInTabStrip.Models.Customer>()
        .Name("Grid")
        .Columns(columns =>
        {
            columns.Bound(c => c.ID).Width(200);
            columns.Bound(c => c.Name);
        })
        .DataBinding(dataBinding => dataBinding.Ajax().Select("_Select", "Home")) /* configure the grid for ajax binding */
        .Sortable()
        .Pageable()
        .Groupable()
        .Filterable()
%>