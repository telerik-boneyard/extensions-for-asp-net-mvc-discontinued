<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<ul class="edit-form"> 
    <li>
        <label for="ProductName">ProductName:</label> <%= Html.TextBox("ProductName")%>
    </li>
    <li>
        <label for="SupplierID">SupplierID:</label> <%= Html.TextBox("SupplierID")%>
    </li>
    <li>
        <label for="CategoryID">CategoryID:</label> <%= Html.TextBox("CategoryID")%>
    </li>
    <li>
        <label for="UnitPrice">UnitPrice:</label> <%= Html.TextBox("UnitPrice")%>
    </li>
    <li>
        <label for="QuantityPerUnit">QuantityPerUnit:</label> <%= Html.TextBox("QuantityPerUnit")%>
    </li>
</ul>