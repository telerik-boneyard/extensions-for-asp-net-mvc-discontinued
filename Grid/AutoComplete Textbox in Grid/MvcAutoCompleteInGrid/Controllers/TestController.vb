
Imports Telerik.Web.Mvc
Imports System.Threading
Namespace SCWMCTS
    Public Class TestController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /Test
        Private dbContext As DataClasses1DataContext

        Sub New()
            dbContext = New DataClasses1DataContext()
        End Sub

        Function Index() As ActionResult
            Return View()
        End Function

        '
        ' GET: /Test/Details/5
        <GridAction()> _
        Function _Index() As ActionResult
            Try
                'Return View(New GridModel(Of CityModel)(_repository.ListAll()))
                'PopulateStateList()
                Return View(New GridModel(Of TestModel)(GetList()))

            Catch ex As Exception
                '
                'Return View(New GridModel(_repository.ListAll()))
                Return View(New GridModel(Of TestModel)(GetList()))
            End Try
        End Function

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /Test/Create

        Function Create() As ActionResult
            Return View()
        End Function

        '
        ' POST: /Test/Create

        <HttpPost()> _
        <GridAction()> _
        Function _Create(ByVal test As TestModel) As ActionResult
            Try
                ' TODO: Add insert logic here
                'City.stateid = stateid
                
                Return View(New GridModel(Of TestModel)(GetList()))
            Catch
                Return View(New GridModel(Of TestModel)(GetList()))
            End Try
        End Function

        '
        ' GET: /Test/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Test/Edit/5

        <HttpPost()> _
        Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add update logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /Test/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Test/Delete/5

        <HttpPost()> _
        Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add delete logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        Private Function GetList() As IEnumerable(Of TestModel)



            Return From p In dbContext.Products Select New TestModel With {.name = p.ProductName}

        End Function
        <HttpPost()>
        Public Function _AutoCompleteAjaxLoading(ByVal text As String) As ActionResult
            Thread.Sleep(1000)

            Dim dbContext = New DataClasses1DataContext()
            Dim products = dbContext.Products.AsQueryable()
            If String.IsNullOrEmpty(text) = False Then
                products = products.Where(Function(p) p.ProductName.StartsWith(text))
            End If

            Return New JsonResult With {.Data = products.Select(Function(n) n.ProductName).ToList()}

        End Function
        

    End Class
End Namespace