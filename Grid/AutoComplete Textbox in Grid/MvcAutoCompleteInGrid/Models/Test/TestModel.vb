Imports System.ComponentModel
Imports System.ComponentModel.DataAnnotations
Public Class TestModel

    'Private _isFreshPurchaseAvailable As Boolean
    'Private _isAdditionalPurchaseAvailable As Boolean

    'Sub New()
    '    _isFreshPurchaseAvailable = False
    '    _isAdditionalPurchaseAvailable = False
    'End Sub

    <ScaffoldColumn(False)>
    Public Property id As Integer

    <DisplayName("Name")>
    <UIHint("Autocomplete")>
    Public Property name As String
End Class
