<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: ViewData["Message"] %></h2>

    <%= Html.Telerik().Grid<Employee>()
        .Name("Grid")
        .DataKeys(keys => keys.Add("ID"))
        .Columns(columns =>
        {
            columns.Bound(c => c.Picture)
                .ClientTemplate("<img src='/Content/UserFiles/<#= Picture #>' alt='<#= Name #>' />")
                .Width(200)
                .Title("Picture");
            columns.Bound(c => c.Name);
            columns.Command(c => c.Edit()).Width(200);
        })
        .ToolBar(commands => commands.Insert())
        .DataBinding(dataBinding => dataBinding.Ajax()
            .Select("Select", "Home")
            .Update("Update", "Home")
            .Insert("Insert", "Home")
        )
        .ClientEvents(events => events
            .OnSave("onGridSave")
        )
    %>

    <script type="text/javascript">
        function onGridSave(e) {
            var values = e.values;
            if (!values.Picture) {
                // Retrieve the inserted picture name
                values.Picture = lastUploadedFile;
            }
        }
    </script>
</asp:Content>
