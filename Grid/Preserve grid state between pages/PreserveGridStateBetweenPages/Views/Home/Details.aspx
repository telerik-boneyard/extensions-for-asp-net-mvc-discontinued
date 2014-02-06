<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Details
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

<h2>Details </h2>

<%: Html.DisplayForModel() %>

<h3><%: Html.ActionLink("Back", "Index", (RouteValueDictionary)ViewBag.GridState) %></h3>

</asp:Content>
