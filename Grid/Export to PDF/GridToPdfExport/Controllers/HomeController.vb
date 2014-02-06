Imports Telerik.Web.Mvc
Imports iTextSharp.text
Imports Telerik.Web.Mvc.Extensions
Imports System.IO
<HandleError()> _
Public Class HomeController
    Inherits System.Web.Mvc.Controller
    Private _repository As ICustomer
    Public Sub New()
        Me.New(New SqlCustomer())
    End Sub
    Public Sub New(ByVal repository As ICustomer)
        _repository = repository
    End Sub
    Function Index() As ActionResult
        ViewData("Message") = "Welcome to ASP.NET MVC!"

        Return View()
    End Function
    <GridAction()>
    <HttpPost()>
    Function _Index() As ActionResult
        Return View(New GridModel(Of Customer)(_repository.FindAllCustomers().AsEnumerable()))
    End Function

    Function About() As ActionResult
        Return View()
    End Function

    Public Function ExportToPdf(ByVal page As Integer, ByVal groupBy As String, ByVal orderBy As String, ByVal filter As String) As ActionResult
        Dim customers = _repository.FindAllCustomers()
        customers = customers.ToGridModel(page, 10, groupBy, orderBy, filter).Data

        ' step 1: creation of a document-object
        Dim document As Document
        document = New Document(PageSize.A4.Rotate, 10, 10, 10, 10)

        'step 2: we create a memory stream that listens to the document
        Dim output As New MemoryStream()
        pdf.PdfWriter.GetInstance(document, output)


        'step 3: we open the document
        document.Open()

        'step 4: we add content to the document
        Dim numOfColumns As Integer = 8
        Dim dataTable As pdf.PdfPTable
        dataTable = New pdf.PdfPTable(numOfColumns)

        dataTable.DefaultCell.Padding = 3

        ' This will set the header width

        '     int[] headerwidths = {9, 4, 8, 10, 8, 11, 9, 7, 9, 10, 4, 10}; // percentage
        'datatable.setWidths(headerwidths);
        'datatable.setWidthPercentage(100); // percentage
        'Dim headerwidths() As Single = {9, 4, 8, 10, 11, 12, 13, 14}
        ''dataTable.SetWidths(headerwidths)
        'dataTable.SetWidthPercentage(headerwidths, PageSize.A4.Rotate)


        dataTable.DefaultCell.BorderWidth = 2
        dataTable.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER

        ' Adding headers
        dataTable.AddCell("Customer Id")
        dataTable.AddCell("Contact Name")
        dataTable.AddCell("Company Name")
        dataTable.AddCell("Address")
        dataTable.AddCell("City")
        dataTable.AddCell("Phone")
        dataTable.AddCell("Postal Code")
        dataTable.AddCell("Region")
        
        dataTable.HeaderRows = 1
        dataTable.DefaultCell.BorderWidth = 1

        For Each cust In customers
            dataTable.AddCell(cust.CustomerID)
            dataTable.AddCell(cust.ContactName)
            dataTable.AddCell(cust.CompanyName)
            dataTable.AddCell(cust.Address)
            dataTable.AddCell(cust.City)
            dataTable.AddCell(cust.Phone)
            dataTable.AddCell(cust.PostalCode)
            dataTable.AddCell(cust.Region)
        Next

        ' Add table to the document
        document.Add(dataTable)

        ' This is important don't forget to close the document
        document.Close()

        'Return File(output, "mulitipart/form-data", "CustomerData.pdf")
        ' this is something different, we used output.toarray(), because document is closed; you can't directly access the stream, though when you use toarray you can.. strange !!
        Return File(output.ToArray(), "application/pdf", "CustomerData.pdf")

    End Function
End Class
