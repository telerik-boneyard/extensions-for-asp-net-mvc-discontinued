<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
    <%:"" %>
    <h2>
        Telerik ASP.Net MVC Grid - Generic search demo</h2>

    <script type="text/javascript">
        var OldSearchValue = '';
        var timeout = 200;

        // Called when the Grid has finished its initial load
        function Grid_onLoad(e) {
            // Move Search Box into toolbar and add "search" class
            $('#GridSearch').addClass('search').appendTo($('#GridComputers > .t-toolbar.t-grid-toolbar.t-grid-top'));
        }

        // Called each time the Grid has been updated (paging/sorting/filtering)
        // re-establish Timeout method
        function Grid_onComplete(e) {
            setTimeout(checkSearchChanged, timeout);
        }


        // Called each time the grid is bound to a new query
        // Pass search box text to controller
        function Grid_onDataBinding(e) {
            var searchString = $('#GridSearch').val();

            e.data = {
                SearchString: searchString
            };
        }


        // Called each time the grid has changed (Add/Update/Delete)
        // Pass search box text to controller
        function Grid_onChange(e) {
            var searchString = $('#GridSearch').val();

            e.values.SearchString = searchString;
        }

        // Checks regularly if the search box has changed
        // Requests a Grid update on any change
        function checkSearchChanged() {
            var CurrentSearchValue = $('#GridSearch').val();

            if (CurrentSearchValue != OldSearchValue) {
                OldSearchValue = CurrentSearchValue;
                $("#GridComputers").data("tGrid").ajaxRequest();
            }
            else {
                setTimeout(checkSearchChanged, timeout);
            }
        }
    </script>

    <input type="text" id="GridSearch" />

    <%: Html.Telerik _
            .Grid(Of TelerikMVCGridSearchDemo.Models.ComputerIdentity)() _
            .Name("GridComputers") _
            .DataKeys(Function(key) key.Add(Function(computer) computer.ID)) _
            .DataBinding(Sub(binding)
                             binding.Ajax.Select("_Select", "Home")
                             binding.Ajax.Insert("_Insert", "Home")
                             binding.Ajax.Update("_Update", "Home")
                             binding.Ajax.Delete("_Delete", "Home")
                         End Sub) _
            .ClientEvents(Sub(events)
                              events.OnLoad("Grid_onLoad")
                              events.OnComplete("Grid_onComplete")
                              events.OnDataBinding("Grid_onDataBinding")
                              events.OnDelete("Grid_onChange")
                              events.OnSave("Grid_onChange")
                          End Sub) _
            .Editable(Sub(editing)
                          editing.DisplayDeleteConfirmation(True)
                          editing.Mode(GridEditMode.PopUp)
                      End Sub) _
            .Columns(Sub(columns)
                         columns.Bound(Function(computer) computer.Name)
                         columns.Bound(Function(computer) computer.Description).Hidden(True)
                         columns.Bound(Function(computer) computer.SerialNumber)
                         columns.Bound(Function(computer) computer.MACAddress)
                         columns.Bound(Function(computer) computer.AssetTag).Hidden(True)
                         columns.Bound(Function(computer) computer.UUID).Hidden(True)
                         columns.Command(Sub(command)
                                             command.Select.ButtonType(GridButtonType.ImageAndText)
                                             command.Edit.ButtonType(GridButtonType.ImageAndText)
                                             command.Delete.ButtonType(GridButtonType.ImageAndText)
                                         End Sub).IncludeInContextMenu(False)
                     End Sub) _
            .ColumnContextMenu _
            .Pageable(Sub(paging)
                          paging.PageSize(20)
                      End Sub) _
            .Sortable(Sub(sorting)
                          sorting.OrderBy(Sub(OrderBy)
                                              OrderBy.Add(Function(computer) computer.Name)
                                          End Sub)
                      End Sub) _
            .ToolBar(Sub(toolbar)
                         toolbar.Insert()
                     End Sub)
       %>
</asp:Content>
