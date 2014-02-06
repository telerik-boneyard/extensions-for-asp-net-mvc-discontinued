<%@ Page Title="" Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage(Of MvcAutoCompleteInGrid.TestModel)" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%
        Html.Telerik().Grid(Of MvcAutoCompleteInGrid.TestModel)().Name("Test").DataKeys(Sub(key)
                                                                                            key.Add(Function(c) c.id)
                                                                                        End Sub).ToolBar(Sub(cmd)
                                                                                                             cmd.Insert()
                                                                                                         End Sub).DataBinding(Sub(dataBind)
                                                                                                                                  dataBind.Ajax().Select("_Index", "Test").Enabled(True) _
                                                                                                                                                     .Insert("_Create", "Test").Enabled(True) _
                                                                                                                                  .Update("_Edit", "Test").Enabled(True)
                                                                                                                              End Sub).Columns(Sub(columns)
                                                                                                                                                   columns.Bound(Function(c) c.id).Title("Id")
                                                                                                                                                   columns.Bound(Function(c) c.name).Title("Name")
                                                                                                                                                   columns.Command(Sub(cmd)
                                                                                                                                                                       cmd.Edit().ButtonType(GridButtonType.ImageAndText)
                                                                                                                                                                   End Sub).Title("Command")
                                                                                                                                               End Sub).Editable(Sub(e)
                                                                                                                                                                     e.Mode(GridEditMode.InLine).Enabled(True)
                                                                                                                                                                 End Sub).Pageable(Sub(p)
                                                                                                                                                                                       p.PageSize(30)
                                                                                                                                                                                   End Sub).Resizable(Sub(reSizable)
                                                                                                                                                                                                          reSizable.Columns(True)
                                                                                                                                                                                                      End Sub).Sortable().Filterable().Groupable().Footer(True).Render()
    %>

</asp:Content>
