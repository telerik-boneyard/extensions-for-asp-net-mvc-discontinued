##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2010.3.+ |
|.NET version                       |3.5| 
|Visual Studio version              |2008| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
With regard to line breaks and paragraphs, the Editor works in accordance with the generally accepted convention - **Enter** is for paragraphs, while **Shift+Enter** is for line breaks.

However, some users my find it more convenient or desared to use only line breaks. In order to achieve this, one can subscribe to the Editor's [Load client event](http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-editor-client-api-and-events.html#OnLoad) and override the way the component handles Enter keystrokes and reverse the logic:
```JavaScript
function Editor_onLoad()
{
    var editor = $(this).data('tEditor');
     
    var paragraphCommand = editor.tools.insertParagraph.command,
        lineBreakCommand = editor.tools.insertLineBreak.command;
 
    editor.tools.insertParagraph.command = function (commandArguments) {
        return lineBreakCommand(commandArguments);
    }
 
    editor.tools.insertLineBreak.command = function (commandArguments) {
        return paragraphCommand(commandArguments);
    }
}
```