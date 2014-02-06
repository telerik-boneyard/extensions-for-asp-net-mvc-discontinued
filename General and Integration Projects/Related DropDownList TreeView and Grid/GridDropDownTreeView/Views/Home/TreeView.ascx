<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<GridDropDownTreeView.Models.Plant>>" %>
<script type="text/javascript">
    // handling the OnSelect event
    function TreeView_onSelect(e) {
        var treeView = $('#TreeView').data('tTreeView');
        var selectedValue = treeView.getItemValue(e.item);


        $.get('<%= Url.Action("Grid", "Home") %>', // The url of the /Home/Grid action method
             {
                productionLineId: selectedValue 
             },  // arguments which need to be passed to the Grid action method
             function (result) { //JavaScript callback executed when the ajax request finishes
                 $('#grid-placeholder').html(result); // update the DIV which contains the grid
             }
        );
    }
</script>
<%-- 
TreeView Binding: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-treeview-data-binding.html
Handling the OnSelect event: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-treeview-client-api-and-events.html#ClientEvents
--%>
<%= Html.Telerik().TreeView()
        .Name("TreeView")
        .BindTo(Model, mappings =>
            {
                mappings.For<GridDropDownTreeView.Models.Plant>(binding =>
                    binding.ItemDataBound((node, plant) => 
                    {
                        node.Text = plant.Name;
                        node.Value = plant.ID.ToString();
                        node.Expanded = true;
                        node.Enabled = false;
                    })
                    .Children(plant => plant.ProductionLines));
                
                mappings.For<GridDropDownTreeView.Models.ProductionLine>(binding =>
                    binding.ItemDataBound((node, plant) => 
                    {
                        node.Text = plant.Name;
                        node.Value = plant.ID.ToString();
                    }));
            })
            .ClientEvents(e => e.OnSelect("TreeView_onSelect")) /* subscribing to the OnSelect event */
%>