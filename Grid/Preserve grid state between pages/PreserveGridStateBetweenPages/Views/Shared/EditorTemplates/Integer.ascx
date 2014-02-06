<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<int?>" %>

<%= Html.Telerik().IntegerTextBoxFor(m => m)
        .InputHtmlAttributes(new { style = "width:100%" })
        .MaxValue(int.MinValue)
        .MaxValue(int.MaxValue)
%>
