##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2012.1.214|
|.NET version                       |4.0| 
|Visual Studio version              |2010| 
|Programming language               |VB.NET|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
This project shows how to implement a generic search/filter box for the grid, using Ajax binding, as an alternative to the built-in column specific search. It adds a textbox to the toolbar and hooks into the Grid calls to supply the search/filter string to the controller actions. The idea was to have a single textbox that will search for this text over various columns, maybe including information not even provided to the grid. 

It's based on an abstract sample of a [free web frontend](http://mdtwebfrontend.codeplex.com/releases/view/86208) that I published recently and I've also written a blog post that describes the details of this implementation. Please read ["Add a generic search box to Teleriks ASP.Net MVC Grid"](http://myitforum.com/cs2/blogs/maikkoster/archive/2012/04/26/adding-a-generic-search-box-to-teleriks-asp-net-mvc-grid.aspx) for more information.

As reference, the necessary snippets to make it work.

The controller action:
```VB
''' <summary>
''' Returns a list of computers
''' Called by Telerik Grid on sorting, paging, refresh, etc.
''' </summary>
''' <param name="searchstring">search string (optional)</param>
''' <returns></returns>
''' <remarks></remarks>
<GridAction()>
Function _Select(Optional searchstring As String = "") As ActionResult
 
    ' Rebind the Grid
    Return View(New GridModel(Of ComputerIdentity)(context.GetAll(searchstring)))
End Function
```

The Javascript used on the Grid view:
```JavaScript
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
```

And the definition of the grid in the view:
```VB
Html.Telerik _
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
```

Regards
Maik Koster