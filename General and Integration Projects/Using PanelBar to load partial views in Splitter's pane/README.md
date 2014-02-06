##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2011.2.712.340 |
|.NET version                       |4.0|
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|



##### **Project Description** #####
This code library shows how to load different partial views in Splitter's pane (via Ajax) by clicking on PanelBar items.  

 1. Define Splitter component in your page: 
 ```C#

    <%= Html.Telerik().Splitter()
    .Name("Splitter")
    .Orientation(SplitterOrientation.Horizontal)
    .Panes(hpanes =>
    {
        //add the first pane and set its properties
        hpanes.Add()
        .Size("300px")
        .MinSize("300px")
        .Collapsible(false)
        .LoadContentFrom("ContentPanelBar", "Content");
        //add the second pane
        hpanes.Add();
    })
%>  
```
 2. Create the partial views - one for the PanelBar in the left pane and two for the content that will be loaded. 
 3. Set up the PanelBar in the partial view - add a new HTML attribute that would allow you to set the Url of the partial view and hook to the OnSelect event: 
 ```C#
<%= Html.Telerik().PanelBar()
       .Name("PanelBar")
       .Items(items =>
       {
           items.Add().Text("Item 1").HtmlAttributes(new { data_url = Url.Action("Item1Content", "Content") }); 
                
           items.Add().Text("Item 2").HtmlAttributes(new { data_url = Url.Action("Item2Content", "Content") }); 
       })
      .ClientEvents(events =>
        {
            events.OnSelect("Select");
             
        })
%>
```
 4. In the same view, add the client code that would load the views in the second Splitter's pane via Ajax:
 ```JavaScript
function Select(e)
{
        //get the clicked item and its Url set as an HTML Attribute
        var item = $(e.item);
        var url = item.data("url");
        //get a reference to the splitter and load the corresponding content in the second pane
        splitter = $("#Splitter");
     
        if (splitter[0] && url)
        {
            splitter.data("tSplitter").ajaxRequest(splitter.find(".t-pane")[1], url);
        }
}
```
 5. Compile and run


The attached project contains both WebForms and Razor applications. 