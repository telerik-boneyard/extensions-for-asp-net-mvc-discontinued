<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<GridAlphabeticPaging.Models.AlphabeticProductsViewModel>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <%Html.Telerik()
            .Grid(Model.Products)
            .Name("Products")
            .ToolBar(toolBar => toolBar.Template(() =>
            {%>
                <div class="t-pager-wrapper" style="border-bottom:0">
                    <div class="t-pager t-reset">                                
                        <%foreach (var letter in Model.Letters){%>
                            <%=Html.ActionLink(letter, "Index", new { letter }, new { @class = "t-link" })%>
                        <%}%>
                        <%=Html.ActionLink("All", "Index")%>                                                        
                    </div>
                </div>
            <%}))
            .Columns(columns =>
                            {
                                columns.Bound(p => p.ProductName).Width(200).Filterable(false);
                                columns.Bound(p => p.QuantityPerUnit).Width(100).Filterable(false);
                                columns.Bound(p => p.UnitPrice).Width(50).Format("{0:c}").Filterable(false);
                                columns.Bound(p => p.Discontinued).Width(50).Filterable(false);
                            })
            .Filterable(filtarable => filtarable.Filters(filters =>
                                                {
                                                    if(!string.IsNullOrEmpty(Model.SelectedLetter))
                                                    {
                                                        filters.Add(p => p.ProductName).StartsWith(Model.SelectedLetter);
                                                    }
                                                }))
            .Scrollable()
            .Render();
    %>
</asp:Content>
