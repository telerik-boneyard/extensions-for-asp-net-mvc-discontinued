##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2011.3.1115 |
|.NET version                       |4.0|
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
This Code Library shows a way to deal with some common validation problems:

 1. Validation does not work for forms loaded with Ajax.
Whether you use jQuery ajax method or a Telerik control that provide the option to load the content on demand via Ajax, the form doesn't get the necessary data in order to perform client-side validation. The solution suggested in this code library is to use the **jquery.validator.unobtrusive.parse** method on the parent element of the form after the content has been loaded.

 2. Hidden inputs are not validated when using **jquery.validate 1.9**.
Some Telerik Controls use a Hidden input to hold the value and so the validation is not working. To avoid this, the default validation ignore settings should be changed. 

 3. Because of incompitability between **jQuery 1.6+** and **jquery.validate 1.8** when used in Internet Explorer prior to version 9, the validation is not working. Known solutions:
  1. Use earlier version of **jQuery(1.5.1)** with **jquery.validate 1.8**
  2. Use **jquery.validate 1.9**