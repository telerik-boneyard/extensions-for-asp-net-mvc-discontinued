<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<DropDownInGrid.Models.Category>" %>

<%: Html.Telerik().DropDownListFor(c => c.CategoryID) // Create a dropdownlist bound to the Category.CategoryID property
         // Populate the dropdownlist with all avaiable  Categories - check HomeController.Index
        .BindTo(new SelectList((IEnumerable)ViewBag.Categories, "CategoryID", "CategoryName"))
%>
