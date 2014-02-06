<%-- Tooltip page --%>
<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master"
 Inherits="System.Web.Mvc.ViewPage"   %>
 
<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
  <div class="iqVerbiage">
            <label><%=Resources.IqResource.greetTooltips%></label> 
            </div> 
     
            
   <% Html.Telerik().TabStrip()
            .Name("iqMainTab")
            .Items(tabstrip =>
            {
                tabstrip.Add()
                 .Text((String)Resources.IqResource.Std_CurrentSamples)
                 .Content(() =>
                    {%>
                        <%= Resources.IqResource.Std_Instructions%>
			         <%});

                tabstrip.Add()
                 .Text((String)Resources.IqResource.Std_TooltipOverColumns)
                 .LoadContentFrom("TooltipOverColumn", "Tooltips");


                tabstrip.Add()
                    .Text((String)Resources.IqResource.Std_TooltipFromData)
                    .LoadContentFrom("TooltipFromData", "Tooltips");

            })
            .SelectedIndex(Convert.ToInt32(TempData["workIndex"])) 
            .Render();
        %>
       
</asp:Content>

              