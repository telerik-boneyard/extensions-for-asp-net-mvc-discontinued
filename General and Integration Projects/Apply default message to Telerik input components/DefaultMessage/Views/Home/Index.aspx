<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
   <style type="text/css">
       .defaultText
       {
           color: #5C87B2;
           cursor: text;
           font-style: italic;
           left: 3px;
           margin: 0;
           padding: 0;
           position: absolute;
           top: 4px;
       }
   </style>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">

    <h3>ComboBox</h3>
    <%= Html.Telerik().ComboBox()
            .Name("ComboBox")
            .AutoFill(true)
            .DataBinding(binding => binding.Ajax().Select("_AjaxLoading", "Home"))
            .HtmlAttributes(new { style = "width:200px;", Title = "Default text here" })
            .HighlightFirstMatch(true)
    %>
    
    <h3>AutoComplete</h3>
    <%= Html.Telerik().AutoComplete()
            .Name("AutoComplete")
            .DataBinding(binding => binding.Ajax().Select("_AutoCompleteAjaxLoading", "Home"))
            .AutoFill(true)
            .HighlightFirstMatch(true)
            .HtmlAttributes(new { style = "width: 200px;", Title = "Default text here" })
    %>

    <h3>AutoCompleteWithoutDefaultText</h3>
    <%= Html.Telerik().AutoComplete()
            .Name("AutoCompleteWithoutDefaultText")
            .DataBinding(binding => binding.Ajax().Select("_AutoCompleteAjaxLoading", "Home"))
            .AutoFill(true)
            .HighlightFirstMatch(true)
            .HtmlAttributes(new { style = "width: 200px;", Title = "Default text here" })
    %>

    <h3>DatePicker</h3>
    <%= Html.Telerik().DatePicker()
            .Name("DatePicker")
            .HtmlAttributes(new { style = "width: 200px; position: relative;", Title = "Default text here" })
    %>

    <h3>TimePicker</h3>
    <%= Html.Telerik().TimePicker()
            .Name("TimePicker")
            .HtmlAttributes(new { style = "width: 200px; position: relative;", Title = "Default text here" })    
    %>

    <h3>DateTimePicker</h3>
    <%= Html.Telerik().DateTimePicker()
            .Name("DateTimePicker")
            .HtmlAttributes(new { style = "width: 200px; position: relative;", Title = "Default text here" })    
    %>

    <% Html.Telerik().ScriptRegistrar().OnDocumentReady(() => { %>
    
        function insertLabel(value) {
            var label = $('<label class="defaultText" for="'+ value.id +'-input">'+ value.title + '</label>')
            label.appendTo(value);

            bindCompactLabel($(value).find('.t-input'), label);
        }

        function insertDivAndLabel(value) {
            $(value).wrap('<div style="position:relative;"></div>');
            var label = $('<label class="defaultText" for=' + value.id +'>'+ value.title + '</label>')
            label.appendTo($(value).parent());

            bindCompactLabel($(value), label);
        }

        function bindCompactLabel(input, label) {
            label.mousedown(function () { setTimeout(function() { input.focus(); }); })

            input.focus(function () { label.hide(); })
                 .blur(function () {
                     if (this.value == '')
                         label.show();
                 });
        }

        $.fn.compactLabels = function() {
            $.each(this, function(index, htmlNode) {
                 $(htmlNode).hasClass('t-autocomplete') ? insertDivAndLabel(htmlNode) : insertLabel(htmlNode);
            });
        };

        $('.t-combobox,.t-autocomplete,.t-datepicker,.t-timepicker,.t-datetimepicker')
            .filter(':not(#AutoCompleteWithoutDefaultText)')
                .compactLabels();
    <% }); %>
   
</asp:Content>