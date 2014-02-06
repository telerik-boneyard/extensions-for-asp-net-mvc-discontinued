<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<List<Category>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <p>
            <label for="Categories-input">Categories:</label>
            <%= Html.Telerik().ComboBox()
                .Name("Categories")
                .SelectedIndex(-1)
                .BindTo(new SelectList(Model, "CategoryID", "CategoryName"))
                .ClientEvents(events => events.OnChange("categoryChanged"))
            %>
    </p>
    <p>
            <label for="Products-input">Products:</label>
            <%= Html.Telerik().ComboBox()
                    .Name("Products")
                    .ClientEvents(events => events.OnChange("productChanged"))
                    .Enable(false)
            %>
    </p>
    <p>
            Orders:
            <%= Html.Telerik().Grid<Order>()
                    .Name("Orders")
                    .DataBinding(binding => binding.Ajax().Select("_GetOrders", "Home"))
                    .Columns(columns => 
                    {
                        columns.Bound(o => o.OrderID);
                        columns.Bound(o => o.ShipName);
                        columns.Bound(o => o.ShippedDate).Format("{0:MM/dd/yyyy}");
                    })
                    .Pageable()
            %>
    </p>

    <script type="text/javascript">
        function categoryChanged(e) {
            var url = '<%= Url.Action("_GetProducts", "Home") %>';
            var productCombo = $('#Products').data('tComboBox');
            productCombo.loader.showBusy();

            $.get(url, { categoryId: e.value }, function (data) {
                productCombo.dataBind(data);
                productCombo.loader.hideBusy();
                productCombo.enable();
            });
        }

        function productChanged(e) {
            var productId = e.value;
            $("#Orders").data("tGrid").rebind({
                productId: productId
            });
        }

    </script>
</asp:Content>
