<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<GridPopUpPosition.Models.Product>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div style="height: 500px">
        some space here...
    </div>
    <%=Html.Telerik().Grid(Model)
                 .Name("Products")
                 .DataKeys(dataKeys => dataKeys.Add(p => p.Id))
                 .Columns(columns =>
                              {
                                  columns.AutoGenerate(true);
                                  columns.Command(commands => commands.Edit());
                              })
                .DataBinding(dataBinding => dataBinding.Ajax()
                                                       .Select("Select", "Home")
                                                       .Update("Update", "Home"))
                .Editable(editable => editable.Mode(GridEditMode.PopUp))
                .ClientEvents(clientEvents => clientEvents.OnEdit("grid_edit"))
                .Pageable()
    %>

    <script type="text/javascript">
        function grid_edit(args) {
            $(args.form)
                .closest(".t-window")
                .data("tWindow")
                .center();
        }
    </script>
</asp:Content>
