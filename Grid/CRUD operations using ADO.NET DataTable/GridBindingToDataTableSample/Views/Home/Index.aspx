<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DataTableViewModel>" %>
<%@ Import Namespace="System.Data" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h3>
        Server Binding
    </h3>
    <%= Html.Telerik().Grid(Model.Data)
                  .Name("Grid")     
                  .DataKeys(dataKeys => dataKeys.Add("ProductID"))
                  .ToolBar(toolBar => toolBar.Insert())
                  .Columns(columns =>
                               {
                                   columns.Bound("ProductID").ReadOnly();
                                   columns.Bound("ProductName");
                                   columns.Bound("SupplierID");
                                   columns.Bound("CategoryID");
                                   columns.Bound("UnitPrice");
                                   columns.Bound("QuantityPerUnit");
                                   columns.Command(command =>
                                                       {
                                                           command.Edit();
                                                           command.Delete();
                                                       });
                               })
                  .DataBinding(dataBinding => dataBinding.Server()
                                                         .Update("UpdateDataTableBinding", "Home")
                                                         .Delete("DeleteDataTableBinding", "Home")
                                                         .Insert("InsertDataTableBinding", "Home"))
                  .Editable(editable => editable.TemplateName("ProductItem").Mode(GridEditMode.InForm))
                  .Pageable()
                  .Sortable()
                  .Filterable()
                  .Groupable()
    %>
    <h3>
        Ajax Binding
    </h3>
    <%= Html.Telerik().Grid(Model.Data)
                .Name("AjaxGrid")     
                .DataKeys(dataKeys => dataKeys.Add("ProductID"))
                .ToolBar(toolBar => toolBar.Insert())
                .Columns(columns =>
                {
                    columns.Bound("ProductID");
                    columns.Bound("ProductName");
                    columns.Bound("SupplierID");
                    columns.Bound("CategoryID");
                    columns.Bound("UnitPrice");
                    columns.Bound("QuantityPerUnit");
                    columns.Command(command =>
                    {
                        command.Edit();
                        command.Delete();
                    });
                })
                .DataBinding(dataBinding => dataBinding.Ajax()
                                                        .Select("_AjaxDataTableBinding", "Home")
                                                        .Update("UpdateDataTableBinding", "Home")
                                                        .Delete("DeleteDataTableBinding", "Home")
                                                        .Insert("InsertDataTableBinding", "Home"))
                .Editable(editable => editable.TemplateName("ProductItem").Mode(GridEditMode.InForm))
                .Pageable()
                .Sortable()
                .Filterable()
                .Groupable()
    %>
</asp:Content>
