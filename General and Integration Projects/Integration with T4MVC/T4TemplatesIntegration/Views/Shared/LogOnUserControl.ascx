<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%
    if (Request.IsAuthenticated) {
%>
        Welcome <b><%= Html.Encode(Page.User.Identity.Name) %></b>!
        [ <%= Html.ActionLink("Log Off", MVC.Account.LogOff())%> ]
<%
    }
    else {
%> 
        [ <%= Html.ActionLink("Log On", MVC.Account.LogOn())%> ]
<%
    }
%>
