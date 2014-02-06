<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="aboutTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Tabs With Images
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="HeadContent" runat="server">

<style type="text/css">

/* Overlapping Tabs */

.t-tabstrip-items
{
    margin-bottom:-1px;
}

.t-tabstrip-items .t-item
{
    border-width:0;
    margin-left: -11px; /* size of overlapping area */
    padding-left:9px;
    
    background: 0 0 no-repeat url('/Content/TabStripStates.png'); /* default state */
}

.t-tabstrip-items .t-link
{
    padding: 3px 1.3em 4px 0;
    background: 100% 0 no-repeat url('/Content/TabStripStates.png'); /* default state */
}

.t-tabstrip .t-tabstrip-items
{
    padding-left: 14px; /* enough space so that the first tab does not go outside tabstrip = size of overlapping area + offset of content area */
}

.t-tabstrip .t-tabstrip-items, #ie8#skips
{
    padding-left: 15px; /* for all browsers, except IE8 */
}

.t-tabstrip-items .t-state-active
{
    background: 0 -26px no-repeat url('/Content/TabStripStates.png'); /* active (selected) state */
    z-index: 5; /* change in z-index in order to place the active tab on top */
}

.t-tabstrip-items .t-state-active .t-link
{
    background: 100% -26px no-repeat url('/Content/TabStripStates.png'); /* active (selected) state */
}
        
</style>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Tabs With Background Images</h2>

    <p>This method uses background images (no tab borders). It will work in all browsers.</p>

    <%  Html.Telerik().TabStrip()
            .Name("TabStrip")
            .Items(tabstrip =>
            {
                tabstrip.Add()
                    .Text("ASP.NET MVC")
                    .Content(() =>
                    { %>
                        <h2>Native UI Extensions for ASP.NET MVC</h2>

                        <p>Telerik Extensions for ASP.NET MVC extend the ASP.NET MVC platform by delivering reusable UI controls built specifically for MVC. A server-based framework integrates with client-side modules built on the popular JavaScript library, jQuery, to deliver productivity enhancing controls for MVC that do not violate the patterns, practices, and guidance of the platform. The Telerik Extensions restore developer productivity to ASP.NET MVC and make it possible to build clean rendering web applications without writing all code by hand. </p>
                    <% })
                    .Selected(true);
                
                tabstrip.Add()
                    .Text("Silverlight")
                    .Content(() =>
                    { %>
                        <h2>The UI suite that brings LOB applications to the RIA world</h2>

                        <p>RadControls are built on Microsoft Silverlight and include 40+ UI controls for building rich line-of-business Silverlight applications. Sharing the same codebase with Telerik WPF controls, the Silverlight controls offer a clean and intuitive API, Expression Blend support, Visual Studio 2010 and SharePoint 2010 support,  and powerful theming capabilities that will radically improve your RIA development.</p>
                    <% });
                
                tabstrip.Add()
                    .Text("ASP.NET AJAX")
                    .Content(() =>
                    { %>
                        <h2>The Industry's Leading AJAX Components</h2>

                        <p>Telerik RadControls for ASP.NET AJAX includes more than 70 controls with proven reliability that help you build high-quality, professional line of business web applications. From the leading AJAX data grid to the full-featured HTML editor used by Microsoft on sites like MSDN, you have all the building blocks for maximizing productivity and creating rich, SEO-friendly, high-performance Enterprise web applications. </p>
                    <% });
                
                tabstrip.Add()
                    .Text("Reporting")
                    .Content(() =>
                    { %>
                        <h2>The Easiest Way to Create and Style .Net Reports</h2>

                        <p>Telerik Reporting is a lightweight .NET reporting solution. It supports all .Net desktop and web platforms, which means  you can easily embed reports in Silverlight, WPF, WebForms and Windows Forms applications. The tool also supports data exports to all popular file formats such as PDF, Excel, RTF, TIFF, etc. Enjoy unique styling capabilities, a very intuitive report designer, and a powerful API, which will allow you to create elegant reports with ease in Visual Studio 2005/2008/2010. The tool also lets you reuse existing XtraReports, Crystal Reports and Active Reports*. Unlike other products, Telerik Reporting offers seamless run-time royalty free deployment. </p>
                    <% });
                
                tabstrip.Add()
                    .Text("Sitefinity ASP.NET CMS")
                    .Content(() =>
                    { %>
                        <h2>Sitefinity Web CMS Features</h2>

                        <p>Sitefinity offers revolutionary user interface, simplicity, scalability, excellent SEO results - everything you need beautifully crafted in one product. It puts you in full control of your web presence and the experiences you deliver to your website visitors. </p>
                    <% });
            })
            .Render(); 
    %>
    
</asp:Content>