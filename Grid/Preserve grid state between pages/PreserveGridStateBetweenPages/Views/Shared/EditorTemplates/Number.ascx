<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<double?>" %>

<%= Html.Telerik().NumericTextBoxFor(m => m)
        .InputHtmlAttributes(new { style = "width:100%" })
%>
