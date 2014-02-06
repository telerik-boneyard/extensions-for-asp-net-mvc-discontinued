<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
<script type="text/javascript" >
    function onCustomersExport() {
        var grid = $(this).data('tGrid');

        // Get the export link as jQuery object
        var $exportLink = $('#CustLink');

        // Get its 'href' attribute - the URL where it would navigate to
        var href = $exportLink.attr('href');

        // Update the 'page' parameter with the grid's current page
        href = href.replace(/page=([^&]*)/, 'page=' + grid.currentPage);

        // Update the 'page' parameter with the grid's current page
        href = href.replace(/groupBy=([^&]*)/, 'groupBy=' + (grid.groupBy || '~'));

        // Update the 'orderBy' parameter with the grids' current sort state
        href = href.replace(/orderBy=([^&]*)/, 'orderBy=' + (grid.orderBy || '~'));

        // Update the 'filter' parameter with the grids' current filtering state
        href = href.replace(/filter=(.*)/, 'filter=' + (grid.filterBy || '~'));

        // Update the 'href' attribute
        $exportLink.attr('href', href);
    }
</script>
<%
    Html.Telerik.Grid(Of GridToPdfExport.Customer)().Name("CustomerGrid") _
                        .ToolBar(Function(c) c.Custom().HtmlAttributes(New With {.id = "CustLink"}).Text("Export to PDF").Action("ExportToPdf", "Home", New With {.page = 1, .groupby = "~", .orderby = "~", .filter = "~"})) _
    .DataBinding(Function(dataBind) dataBind.Ajax().Select("_Index", "Home")) _
    .Columns(Sub(col)
                 col.Bound(Function(c) c.CustomerID)
                 col.Bound(Function(c) c.ContactName)
                 col.Bound(Function(c) c.CompanyName)
                 col.Bound(Function(c) c.Address)
                 col.Bound(Function(c) c.City)
                 col.Bound(Function(c) c.Phone)
                 col.Bound(Function(c) c.PostalCode)
                 col.Bound(Function(c) c.Region)
             End Sub).ClientEvents(Sub(ev)
                                       ev.OnDataBound("onCustomersExport")
                                   End Sub).Filterable().Pageable().Render()
                      
%>
</asp:Content>
