<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <%: Html.Telerik().Grid<DropDownInGrid.Models.Product>()
            .Name("Grid")
            .DataKeys(keys => keys.Add(p => p.ProductID)
                                  .RouteKey("ProductID") // post the data key as "ProductID"
            )
            .ToolBar(toolbar => toolbar.Insert())
            .DataBinding(dataBinding => dataBinding.Ajax()
                .Select("Select", "Home")
                .Insert("Insert", "Home")
                .Delete("Delete", "Home")
                .Update("Update", "Home"))
            .Columns(columns =>
                {
                    columns.Bound(p => p.ProductID).ReadOnly().Width(100);
                    columns.Bound(p => p.ProductName).Width(400);
                    columns.Bound(p => p.Category).ClientTemplate("<#= Category.CategoryName #>"); // display the category name
                    columns.Command(commands => 
                        {
                            commands.Edit();
                            commands.Delete();
                        }).Width(200);
                })
            .Sortable(sort => sort.OrderBy(order => order.Add(p => p.ProductID).Descending())) // order by ProductID so that inserted items appear on top of the grid (optional)
            .Pageable()
    %>
</asp:Content>
