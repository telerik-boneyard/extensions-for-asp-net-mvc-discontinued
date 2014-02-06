<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%= Html.Telerik().Grid<CustomPopUpForm.Models.Customer>()
            .Name("Customers")
            .DataKeys(dataKeys => dataKeys.Add(c => c.CustomerID))
            .DataBinding(dataBinding => dataBinding.Ajax()
                .Select("_Select", "Home")
                .Update("_Update", "Home"))
            .Columns(columns =>
            {
                columns.Bound(c => c.CustomerID).Width(130);
                columns.Bound(c => c.CompanyName).Width(250);
                columns.Bound(c => c.ContactName);
                columns.Bound(c => c.Country).Width(200);
                columns.Command(c => c.Edit()).Width(100);
            })
            .Editable(editing => editing.Mode(GridEditMode.PopUp))
            .Pageable()
            .Sortable()
    %>
</asp:Content>