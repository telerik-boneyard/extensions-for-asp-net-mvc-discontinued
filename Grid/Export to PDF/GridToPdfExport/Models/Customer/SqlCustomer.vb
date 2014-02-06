Public Class SqlCustomer : Implements ICustomer

    Private _Customer As DbContext       'Declaration

    'Object Initialization
    Sub New()
        _Customer = New DbContext
    End Sub
    Public Function FindAllCustomers() As System.Linq.IQueryable(Of Customer) Implements ICustomer.FindAllCustomers
        Return _Customer.Customers
    End Function

End Class
