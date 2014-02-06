<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <%--    
    Binding the dropdown: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-combobox-data-binding-server-binding.html
    Handling the OnChange event: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-editor-client-api-and-events.html#OnChange
    --%>
    <fieldset>
        <legend>Pick a plant to see its production lines</legend>
        <%= Html.Telerik().DropDownList()
        .Name("DropDownList")
        .BindTo(new SelectList((IEnumerable<GridDropDownTreeView.Models.Plant>)ViewData["plants"], "ID", "Name"))
        .ClientEvents(e => e.OnChange("DropDown_onChange")) /* subscribing to the OnChange event */
        %>
    </fieldset>
    <script type="text/javascript">
        
        // handling the OnChange event
        function DropDown_onChange() {
            var dropDown = $(this).data('tDropDownList');

            // using $.get to make ajax request which returns html (the treeview partial view)
            // $.get : http://api.jquery.com/jQuery.get/
            
            $.get('<%= Url.Action("TreeView", "Home") %>', // URL to the /Home/TreeView action method
                {
                    plantId: dropDown.value() 
                }, // arguments which need to be passed to the TreeView action method
                
                function (result) { //JavaScript callback executed when the ajax request finishes
                
                    $('#treeview-placeholder').html(result); // update the DIV which contains the treeview
                
                    $('#grid-placeholder').empty(); // clear the DIV which contains the grid
                });
        }
    </script>
    <fieldset>
        <legend>Pick a production line to see its production requests</legend>
        <div id="treeview-placeholder">
            <%-- Render the treeview which corresponds to the first selected dropdown item --%>
            <% Html.RenderAction("TreeView", new { plantId = 1 }); %>
        </div>
    </fieldset>
    <fieldset>
        <legend>Production Requests</legend>
        <div id="grid-placeholder">
            <%-- Grid div is empty by default - the user needs to seelect a node first --%>
        </div>
    </fieldset>
</asp:Content>
