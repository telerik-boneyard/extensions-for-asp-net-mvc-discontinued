<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    BatchEditing
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%: Html.AntiForgeryToken() %>

    <%: Html.Telerik().Grid<GridAntiForgeryToken.Models.Customer>()
            .Name("Grid")
            .ToolBar(tools =>
                {
                    tools.Insert();
                    tools.SubmitChanges();
                })
            .DataKeys(keys => keys.Add(c => c.ID))
            .Columns(columns =>
                {
                    columns.Bound(c => c.ID).ReadOnly().Width(100);
                    columns.Bound(c => c.Name);
                    columns.Command(commands =>
                        {
                            commands.Delete();
                        });
                })
            .ClientEvents(e => e
                .OnSubmitChanges("onSubmitChanges")
                .OnDataBinding("onDataBinding"))
            .DataBinding(dataBinding => dataBinding.Ajax()
                .Select("Select", "Home")
                .Update("SaveChanges", "Home"))
            .Editable(config => config.Mode(GridEditMode.InCell))
    %>

    <script type="text/javascript">

        function onSubmitChanges(e) {
            e.values["__RequestVerificationToken"] = $("input[name=__RequestVerificationToken]").val();
        }

        function onDataBinding(e) {
            e.data = {
                __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val()
            };
        }
    </script>

</asp:Content>
