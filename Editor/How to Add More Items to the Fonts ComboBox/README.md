##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2010.3.+ |
|.NET version                       |3.5| 
|Visual Studio version              |2008| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
The MVC Editor component comes with a default list of font families that can be used, including Arial, Courier New, Georgia, Tahoma, Times New Roman, Verdana, and some more. In case you want additional items in the font tool, you can do the following:
1.  Subscribe to the Load client event of the Editor.
```C#
Html.Telerik().Editor()
           .Name("MyEditor1")
           .ClientEvents(ev => ev.OnLoad("addFonts"))

``` 
2. Add items to the font tool's datasource and rebind the component. The datasource is an Array of objects. Each new font should be an object with two properties - Text, which appears in the dropdown and Value, which is a valid value for the font-family CSS property.

Note that the logic for Internet Explorer is different and an auxiliary function is used to prevent code duplication.
```JavaScript
function addFonts(e) {
    if (!$.browser.msie) {
        var fontsCombo = $(".t-fontName", this).data("tComboBox");
        populateNewFonts(fontsCombo.data);
        fontsCombo.reload();
    } else {
        var fontsCombo = $(".t-fontName", this).data("tSelectBox");
        var dataSource = populateNewFonts($.fn.tEditor.defaults.fontName);
        fontsCombo.dropDown.dataBind(dataSource, false);
    }
}
 
function populateNewFonts(data) {
    data.push({ Text: 'Garamond', Value: "garamond,'times new roman',serif" });
    return data;
}
``` 