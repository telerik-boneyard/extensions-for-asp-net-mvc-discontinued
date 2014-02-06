<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
  <%= Html.Telerik().Editor()
                      .Name("Editor1")
                      .FileBrowser(browser => browser.Browse("Browse", "ImageBrowser")
                                                     .Upload("Upload", "ImageBrowser")
                                                     .Image("Image", "ImageBrowser")
                                                     .DeleteDirectory("DeleteDirectory", "ImageBrowser")
                                                      .DeleteFile("DeleteFile", "ImageBrowser")
                                                     .CreateDirectory("CreateDirectory", "ImageBrowser")
                                                     .Thumbnail("Thumbnail", "ImageBrowser"))
    %>
</asp:Content>
