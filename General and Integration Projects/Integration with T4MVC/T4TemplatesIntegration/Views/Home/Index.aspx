<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<T4TemplatesIntegration.Models.Customer>>" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%= Html.Encode(ViewData["Message"]) %></h2>
    
    <%= Html.Telerik()
             .PanelBar()
             .Name("T4PanelBar")
             .Items(panelbar =>
             {
                 panelbar.Add().Text("Home").Action(MVC.Home.Index().GetRouteValueDictionary());
                 panelbar.Add().Text("About").Action(MVC.Home.About().GetRouteValueDictionary());
                 panelbar.Add().Text("Param").Action(MVC.Home.Param(1).GetRouteValueDictionary());
             })
    %>

    <br />

    <%= Html.Telerik()
             .TabStrip()
             .Name("T4TabStrip")
             .Items(tabstrip =>
             {
                 tabstrip.Add().Text("Home").Action(MVC.Home.Index().GetRouteValueDictionary());
                 tabstrip.Add().Text("About").Action(MVC.Home.About().GetRouteValueDictionary());
                 tabstrip.Add().Text("Param").Action(MVC.Home.Param(1).GetRouteValueDictionary());
             })
    %>

    <br />

    <%= Html.Telerik()
             .Menu()
             .Name("T4Menu")
             .Items(menu =>
             {
                 menu.Add().Text("Home").Action(MVC.Home.Index().GetRouteValueDictionary());
                 menu.Add().Text("About").Action(MVC.Home.About().GetRouteValueDictionary());
                 menu.Add().Text("Param").Action(MVC.Home.Param(1).GetRouteValueDictionary());
             })
    %>
    
    <br />
    
    <%= Html.Telerik().Grid<T4TemplatesIntegration.Models.Customer>()
            .Name("Grid")
            .Columns(columns =>
            {
                columns.Bound(o => o.ID).Width(81);
                columns.Bound(o => o.Name).Width(200);
                columns.Bound(o => o.Birthday).Format("{0:MM/dd/yyyy}").Width(100);
            })
            .DataBinding(dataBinding => dataBinding.Ajax().Select(MVC.Home._AjaxBinding().GetRouteValueDictionary()))
            .Pageable(paging => paging.PageSize(3))
            .Sortable()
    %>
</asp:Content>
