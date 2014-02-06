<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%: Html.Telerik().TabStrip()
            .Name("TabStrip")
            .SelectedIndex(0)
            .Items(tabs => 
            {
                tabs.Add().Text("First").Content("Select the 'Grid' tab");
                tabs.Add().Text("Grid").LoadContentFrom("Grid", "Home"); // Define the action method which will render the partial view (Grid.ascx)
            })
    %>

</asp:Content>
