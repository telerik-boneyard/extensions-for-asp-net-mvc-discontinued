<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<decimal?>" %>

<%= Html.Telerik().CurrencyTextBoxFor(m => m)
        .InputHtmlAttributes(new {style="width:100%"})
        .MinValue(0)
%>
