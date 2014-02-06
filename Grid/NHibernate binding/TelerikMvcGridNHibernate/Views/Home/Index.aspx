<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<%: Html.Telerik().Grid<TelerikMvcGridNHibernate.Models.Order>() 
        .Name("Grid")
        .Columns(columns => 
        {
            columns.Bound(o => o.OrderID).Width(200);
            columns.Bound(o => o.ShippedDate).Format("{0:d}").Width(200);
            columns.Bound(o => o.ShipAddress);
        })
        .Sortable()
        .Filterable()
        .Scrollable()
        .Pageable()
        .DataBinding(dataBinding => dataBinding.Ajax().Select("_Select", "Home"))
%>
</asp:Content>
