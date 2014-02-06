Imports TelerikMVCGridSearchDemo.Models
Imports Telerik.Web.Mvc

Namespace Controllers
    Public Class HomeController
        Inherits System.Web.Mvc.Controller

        Private context As New ComputerRepository

        ''' <summary>
        ''' Returns the Default view
        ''' No other views implemented
        ''' </summary>
        ''' <returns></returns>
        ''' <remarks></remarks>
        Function Index() As ActionResult

            Return View()
        End Function


        ''' <summary>
        ''' Returns a list of computers
        ''' Called by Telerik Grid on sorting, paging, refresh, etc.
        ''' </summary>
        ''' <param name="searchstring">search string (optional)</param>
        ''' <returns></returns>
        ''' <remarks></remarks>
        <GridAction()>
        Function _Select(Optional searchstring As String = "") As ActionResult

            ' Rebind the Grid
            Return View(New GridModel(Of ComputerIdentity)(context.GetAll(searchstring)))
        End Function


        ''' <summary>
        ''' Inserts a new Computer record
        ''' Used by Telerik Grid
        ''' </summary>
        ''' <param name="searchstring">Search string (optional)</param>
        ''' <returns></returns>
        ''' <remarks></remarks>
        <GridAction()>
        Function _Insert(Optional searchstring As String = "") As ActionResult

            ' Create new instance
            Dim Computer As New ComputerIdentity

            ' Bind instance to supplied values
            If TryUpdateModel(Computer) Then

                ' Model is valid. Insert Computer
                context.Insert(Computer)
            End If

            ' Rebind the Grid
            Return View(New GridModel(Of ComputerIdentity)(context.GetAll(searchstring)))
        End Function


        ''' <summary>
        ''' Updates a computer record
        ''' Used by Telerik Grid
        ''' </summary>
        ''' <param name="ID">Computer ID</param>
        ''' <param name="searchstring">Search string (optional)</param>
        ''' <returns></returns>
        ''' <remarks></remarks>
        <GridAction()>
        Function _Update(ID As Integer, Optional searchstring As String = "") As ActionResult

            ' Find Computer
            Dim Computer = context.Get(ID)

            ' Update with supplied values
            TryUpdateModel(Computer)

            ' Update Computer
            context.Update(Computer)

            ' Rebind the Grid
            Return View(New GridModel(Of ComputerIdentity)(context.GetAll(searchstring)))
        End Function


        ''' <summary>
        ''' Deletes a computer record
        ''' </summary>
        ''' <param name="ID">Computer ID</param>
        ''' <param name="searchstring">search string (optional)</param>
        ''' <returns></returns>
        ''' <remarks></remarks>
        <GridAction()>
        Function _Delete(ID As Integer, Optional searchstring As String = "") As ActionResult

            ' Get Computer
            Dim Computer = context.Get(ID)

            If Not IsNothing(Computer) Then
                ' Delete computer
                context.Delete(Computer)
            End If

            ' Rebind the Grid
            Return View(New GridModel(Of ComputerIdentity)(context.GetAll(searchstring)))
        End Function


        Function About() As ActionResult
            Return View()
        End Function
    End Class
End Namespace