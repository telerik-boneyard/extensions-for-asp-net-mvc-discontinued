##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2011.3.1115|
|.NET version                       |4.0| 
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
In numerous cases you may need to export the data displayed by the Grid. This Code Library shows how to implement Excel export in a few lines of code.
The Excel export relies on the open source project [NPOI](http://npoi.codeplex.com/). 
The project contains a View with a Grid and a hyperlink. The hyperlink requests  the controller which will export the Grid's data and stream it back as Excel file. The "onDataBound" client-side event of the grid is handled to update the URL arguments required for export (current page, order and filter expressions).