##### **Requirements** #####
|Item                               |Description|
|----------                         |:-------------|
|Telerik Extension for ASP.NET MVC  |2011.2.712|
|.NET version                       |4.0|
|Visual Studio version              |2010| 
|Programming language               |C#|
|Browser                            |all browsers supported by Telerik Extensions for ASP.NET MVC|

##### **Project Description** #####
Bind a treeview to an XElement::
```C#
@using Telerik.Web.Mvc.UI.Fluent;
@using System.Xml.Linq;
@model XElement
 
@functions {
    void BindXElement(TreeViewItemFactory item, XElement elem){
        var node = item.Add().Text(elem.Name.LocalName);
        foreach (var e in elem.Elements()) {
            node.Items(subItem => BindXElement(subItem, e));
        }
    }
}
 
@(Html.Telerik().TreeView()
        .Name("TreeView")
        .Items(item => BindXElement(item, Model))
)
```

TreeView along with the other navigational components support [binding to model](http://www.telerik.com/help/aspnet-mvc/m_telerik_web_mvc_ui_navigationitemcontainerextensions_bindto__1_2.html). Here is an example of binding the TreeView to XElement:
```C#

@(Html.Telerik().TreeView()
    .Name("TreeView")
    .BindTo(new List<XElement> { Model }, mappings =>
    {
        mappings.For<XElement>(binding => binding
            .ItemDataBound((item, elem) => {
                item.Text = elem.Name.LocalName;
            })
            .Children(elem => elem.Elements())
        );
    })
)

```