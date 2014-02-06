<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<PreserveGridStateBetweenPages.Models.Product>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <% Html.Telerik().Grid(Model)
            .Name("Grid")
            .Columns(columns =>
            {
                columns.Bound(p => p.ID).Width(100);
                columns.Bound(p => p.Name);
                columns.Template(p =>
                    {
                        ViewBag.GridState["id"] = p.ID;
                     %>
                        <%: Html.ActionLink("Details", "Details", (RouteValueDictionary)ViewBag.GridState) %>
                     <%
                    });
            })
            .Sortable()
            .Pageable()
            .Filterable()
            .Render();
    %>
</asp:Content>
