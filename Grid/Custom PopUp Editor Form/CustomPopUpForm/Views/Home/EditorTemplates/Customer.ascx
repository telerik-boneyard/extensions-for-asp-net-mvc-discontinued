<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<CustomPopUpForm.Models.Customer>" %>

<fieldset>
    <legend>Customer</legend>
    
    <%-- Requred to identify the customer when doing update --%>
    
    <%= Html.HiddenFor(c => c.CustomerID) %>
    
    <div>
        Contact Name: <%= Html.EditorFor(c => c.ContactName) %>
    </div>
    <div>
        Company Name: <%= Html.EditorFor(c => c.CompanyName) %>
    </div>
</fieldset>