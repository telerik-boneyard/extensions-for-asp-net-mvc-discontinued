##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2011.1.414 |
|.NET version                       |4.0| 
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
This project demonstrates how to use a custom JsonResult implementation, in order to workaround JavaScriptSerializer deserialization error due to exceeding the value set on the maxJsonLength property. This is achieved through registration (with the DI) of custom GridActionResultFactory implementation on application start event.