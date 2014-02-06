<%-- Home index --%>
<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
   
             
            
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
     <div  class="iqVerbiage" >
            <label><%=Resources.IqResource.greetHome%></label>
            </div>
   
</asp:Content>
