##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2012.1.214|
|.NET version                       |4.0| 
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
This project shows how to keep a **DateTime** property in **UTC** format on both server and client sides when using a Grid with Ajax Binding and editing.
Every time a date is being retrieved from the database or received from the client, the **DateTime Kind** property is left unspecified. The .NET framework implicitly converts such dates to local format.
Similar thing happens on the client side. Browsers convert all dates according to local time.
So in order to keep time in **UTC**, explicit transformation should be applied to the dates on both client and server sides.
Hence there are two steps to be covered:  
 1.  Use a ViewModel with setter and getter that explicitly set the DateTime Kind to UTC:  
```
public class OrderViewModel
{
    private DateTime dateOfOrder;
 
    public int OrderID { get; set; }
 
    public DateTime DateOfOrder
    {
        get
        {
            return DateTime.SpecifyKind(dateOfOrder, DateTimeKind.Utc);
        }
        set
        {
            this.dateOfOrder = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
    }
}
``` 
2.  Modify the incoming value on the first RowDataBound event, so it shows UTC time properly:
```JavaScript
.ClientEvents(events=> events.OnRowDataBound("OnRowDataBound"))
 
function OnRowDataBound(e) {
    if (!e.dataItem.utc) {
        e.dataItem.utc = true;
        e.dataItem.DateOfOrder = toUTC(e.dataItem.DateOfOrder);
        e.row.cells[1].innerHTML = $.telerik.formatString("{0:G}", e.dataItem.DateOfOrder);
    }
 }
 
function toUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(),date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}
```
