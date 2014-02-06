Imports System.ComponentModel.DataAnnotations
Imports System.ComponentModel

Namespace Models
    Public Class ComputerIdentity
        <ScaffoldColumn(False)>
        Public Property ID As Integer

        <DisplayName("Computer name")>
        <Required()>
        Public Property Name As String

        Public Property Description As String

        <DisplayName("Serial number")>
        Public Property SerialNumber As String

        <DisplayName("MAC address")>
        Public Property MACAddress As String

        <DisplayName("Asset tag")>
        Public Property AssetTag As String

        <DisplayName("Unique Identifier")>
        Public Property UUID As String
    End Class
End Namespace