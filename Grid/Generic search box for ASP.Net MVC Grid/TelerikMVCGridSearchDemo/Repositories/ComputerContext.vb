Imports TelerikMVCGridSearchDemo.Models

Public Module ComputerContext
    Public Property Computers As IList(Of ComputerIdentity)

    ''' <summary>
    ''' Generates the specified amount of Computers and adds them to the shared list of Computers
    ''' </summary>
    ''' <param name="Amount"></param>
    ''' <remarks></remarks>
    Public Sub GenerateComputers(Amount As Integer)

        ' Ensure instance of the list is available
        If IsNothing(Computers) Then
            Computers = New List(Of ComputerIdentity)
        End If

        Dim Names As New List(Of String)
        Names.Add("Demo")
        Names.Add("Test")
        Names.Add("Sample")

        ' Create specified amount of computers
        For x As Integer = 1 To Amount
            Dim NewComputer As New ComputerIdentity

            NewComputer.ID = x

            ' Create a bunch of different names for searching/filtering
            Dim BaseName As String = Names((x Mod Names.Count))
            NewComputer.Name = BaseName & x
            NewComputer.Description = BaseName & " computer " & x

            ' Add some random idenifiers
            NewComputer.UUID = Guid.NewGuid.ToString

            NewComputer.SerialNumber = NewComputer.UUID.Substring(0, 8)
            NewComputer.AssetTag = NewComputer.UUID.Substring(26, 8)

            NewComputer.MACAddress = GetRandomMac(x)

            Computers.Add(NewComputer)
        Next
    End Sub


    ''' <summary>
    ''' Generates a Random MAC address
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Private Function GetRandomMac(Seed As Byte) As String
        Dim MacBuilder As New StringBuilder()
        Dim First As Boolean = True

        For x As Integer = 0 To 4
            Dim NewByte As Byte = Convert.ToByte((Seed * x) Mod 255)

            If First Then
                MacBuilder.AppendFormat("{0:x2}", NewByte)
                First = False
            Else
                MacBuilder.AppendFormat(":{0:x2}", NewByte)
            End If

        Next

        Return MacBuilder.ToString().ToUpper
    End Function

End Module
