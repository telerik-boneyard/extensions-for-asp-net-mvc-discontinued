<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	MVC Splitter WebForms
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
	<%= Html.Telerik().Splitter()
		.Name("Splitter")
		.Orientation(SplitterOrientation.Horizontal)
		.Panes(hpanes =>
		{
			//add the first pane and set its properties
			hpanes.Add()
			.Size("300px")
			.MinSize("300px")
			.Collapsible(false)
			.LoadContentFrom("ContentPanelBar", "Content");
			//add the second pane
			hpanes.Add();
		})
		
	%>
</asp:Content>
