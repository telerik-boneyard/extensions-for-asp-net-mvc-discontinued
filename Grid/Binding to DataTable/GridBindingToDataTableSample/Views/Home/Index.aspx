<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DataTable>" %>
<%@ Import Namespace="System.Data" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h3>
        Grid columns created from DataTable columns
    </h3>
    <%= Html.Telerik().Grid(Model)
                  .Name("Grid")     
                  .Columns(columns =>
                   {
                       foreach (DataColumn column in Model.Columns)
                       {
                           columns.Bound(column.DataType, column.ColumnName);     
                       }
                   })
                  .DataBinding(dataBinding => dataBinding.Ajax().Select("Select", "Home"))
                  .Pageable()
                  .Sortable()
                  .Filterable()
                  .Groupable()
    %>
    <h3>
        Predefined grid columns    
    </h3>
    <%= Html.Telerik().Grid(Model)
                .Name("AjaxGrid")     
                .Columns(columns =>
                {
                    columns.Bound("ProductID");
                    columns.Bound("ProductName");
                    columns.Bound("SupplierID");
                    columns.Bound("CategoryID");
                    columns.Bound("UnitPrice");
                    columns.Bound("QuantityPerUnit");
                })
                .DataBinding(dataBinding => dataBinding.Ajax().Select("Select", "Home"))
                .Pageable()
                .Sortable()
                .Filterable()
                .Groupable()
    %>
</asp:Content>
