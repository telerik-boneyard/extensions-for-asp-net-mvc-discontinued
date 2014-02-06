<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <%: Html.Telerik().Grid<GridToolbarCrud.Models.Customer>()
        .Name("Grid")
        .DataKeys(keys => keys.Add(c => c.ID))
        .ToolBar(tools => 
        {
            // "Create" button - when pressed shows the "new record" user interface
            tools.Custom().Text("Create").HtmlAttributes(new { onclick = "return beginInsert()", @class="create" });
            // "Insert" button - when pressed inserts the new record. Initially hidden. Shown when the "Create" button is pressed.
            tools.Custom().Text("Insert").HtmlAttributes(new { onclick = "return endInsert()", style = "display:none", @class = "insert" });
            
            // "Edit" button - when pressed edits the selected record. Initially disabled. Enabled once a record is selected
            tools.Custom().Text("Edit").HtmlAttributes(new { onclick = "return beginEdit()", @class = "edit disabled" });
            // "Update" button - when pressed updates the selected record. Initially hidden. Shown when the "Edit" button is pressed.
            tools.Custom().Text("Update").HtmlAttributes(new { onclick = "return endEdit()", style = "display:none", @class = "save" });

            // "Delete" button - when pressed deletes the selected record. Initially disabled. Enabled once a record is selected
            tools.Custom().Text("Delete").HtmlAttributes(new { onclick = "return doDelete()", @class = "delete disabled" });

            // "Cancel" button - cancels insert or edit operation. Initially hidden. Shown when the "Edit" or "Create" button is pressed.
            tools.Custom().Text("Cancel").HtmlAttributes(new { onclick = "return cancel()", style = "display:none", @class="cancel" });
        })
        .Columns(columns =>
        {
            columns.Bound(c => c.ID).ReadOnly().Width(100);
            columns.Bound(c => c.Name);
        })
        .Scrollable()
        .Selectable()
        .Pageable()
        .ClientEvents(e => e.OnRowSelect("Grid_onRowSelect").OnDataBound("Grid_onDataBound"))
        .Editable(editing => editing.Enabled(true))
        .DataBinding(dataBinding => dataBinding.Ajax()
                .Select("_Select", "Home")
                .Update("_Update", "Home")
                .Insert("_Insert", "Home")
                .Delete("_Delete", "Home")
        )
    %>
    <style type="text/css">
        /* style for disabled buttons */
        .disabled
        {
            border-color: #ccc;
            color: #aaa;
        }
    </style>
    <script type="text/javascript">

        // tracks the selected table row (<TR> tag)
        var selectedRow;

        // deletes the selected row
        function doDelete() {
            var grid = $('#Grid').data('tGrid');
            if (selectedRow) {
                grid.deleteRow($(selectedRow));
            }
            return false;
        }

        // puts the grid in insert mode
        function beginInsert() {
            var grid = $('#Grid').data('tGrid');
            
            // enter insert mode
            grid.addRow();
            
            // update the selected row
            selectedRow = $('#Grid .t-grid-new-row');
            
            // show the 'Insert' and 'Cancel' buttons and hide the 'Delete', 'Create' and 'Edit' buttons
            toggleInsertButtons(true);

            return false;
        }

        function endInsert() {
            var grid = $('#Grid').data('tGrid');
            
            // perform the insertion - call the _Insert action method
            grid.insertRow($(selectedRow));

            // hide the 'Insert' and 'Cancel' buttons and show the 'Delete', 'Create' and 'Edit' buttons
            toggleInsertButtons(false);

            return false;
        }

        function toggleInsertButtons(insert) {
            $('#Grid').find('.save').hide().end()
                  .find('.edit, .create, .delete').toggle(!insert).end()
                  .find('.insert, .cancel').toggle(insert);
        }

        // puts the grid in edit mode
        function beginEdit() {
            if (selectedRow) {
                var grid = $('#Grid').data('tGrid');
                // enter edit mode
                grid.editRow($(selectedRow));
                
                // show the 'Update' and 'Cancel' buttons and hide the 'Delete', 'Create' and 'Edit' buttons
                toggleEditButtons(true);
            }

            return false;
        }

        function endEdit() {
            var grid = $('#Grid').data('tGrid');
            // perform the update - call the _Update action method
            grid.updateRow($(selectedRow));

            // hide the 'Update' and 'Cancel' buttons and show the 'Delete', 'Create' and 'Edit' buttons
            toggleEditButtons(false);

            return false;
        }

        function cancel() {
            var grid = $('#Grid').data('tGrid');
            // hide the insert or update interface
            grid.cancelRow($(selectedRow));

            // hide the 'Update' (or 'Insert") and 'Cancel' buttons and show the 'Delete', 'Create' and 'Edit' buttons
            toggleEditButtons(false);

            return false;
        }

        function toggleEditButtons(edit) {
            $('#Grid').find('.insert').hide().end()
                  .find('.edit, .create, .delete').toggle(!edit).end()
                  .find('.save, .cancel').toggle(edit);
        }

        // handle the OnRowSelect event
        function Grid_onRowSelect(e) {
            // update the selected row
            selectedRow = e.row;
            // enable the 'Edit' an 'Delete' buttons
            $('#Grid .disabled').removeClass('disabled');
        }
        
        // handle the OnDataBound event
        function Grid_onDataBound(e) {
            // clear the selected row
            selectedRow = null;
            // disable the 'Edit' an 'Delete' buttons
            $('#Grid .edit, #Grid .delete').addClass('disabled');
        } 
    
    </script>
</asp:Content>
