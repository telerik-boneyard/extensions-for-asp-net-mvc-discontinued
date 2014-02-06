<%@ Control Language="VB" Inherits="System.Web.Mvc.ViewUserControl" %>
<% 
    Dim controlName = ViewData.TemplateInfo.GetFullHtmlFieldName(String.Empty)
    Html.Telerik().AutoComplete().Name(controlName) _
                                .DataBinding(Sub(dataBinding)
                                                 dataBinding.Ajax().Select("_AutoCompleteAjaxLoading", "Test")
                                             End Sub).HighlightFirstMatch(True).AutoFill(True).Filterable(Sub(filter)
                                                                                                              filter.MinimumChars(1)
                                                                                                          End Sub).Render()
    
%>

