Imports TelerikMVCGridSearchDemo.Models

Public Class ComputerRepository

    Public Sub New()
        If IsNothing(ComputerContext.Computers) OrElse ComputerContext.Computers.Count = 0 Then
            ComputerContext.GenerateComputers(100)
        End If
    End Sub


    Public Function [GetAll](Optional SearchString As String = "") As IQueryable(Of ComputerIdentity)
        Return ComputerContext.Computers.AsQueryable.Where(Function(c) c.Name.Contains(SearchString) _
                                                   Or c.Description.Contains(SearchString) _
                                                   Or c.SerialNumber.Contains(SearchString) _
                                                   Or c.MACAddress.Contains(SearchString) _
                                                   Or c.AssetTag.Contains(SearchString) _
                                                   Or c.UUID.Contains(SearchString))
    End Function


    Public Function [Get](ID As Integer) As ComputerIdentity
        Return ComputerContext.Computers.Where(Function(computer) computer.ID = ID).FirstOrDefault
    End Function


    Public Sub Insert(Computer As ComputerIdentity)
        Computer.ID = ComputerContext.Computers.OrderByDescending(Function(c) c.ID).First().ID + 1

        ' Ensure strings are not set to Nothing
        If String.IsNullOrEmpty(Computer.Description) Then Computer.Description = ""
        If String.IsNullOrEmpty(Computer.SerialNumber) Then Computer.SerialNumber = ""
        If String.IsNullOrEmpty(Computer.MACAddress) Then Computer.MACAddress = ""
        If String.IsNullOrEmpty(Computer.AssetTag) Then Computer.AssetTag = ""
        If String.IsNullOrEmpty(Computer.UUID) Then Computer.UUID = ""

        ComputerContext.Computers.Add(Computer)
    End Sub


    Public Sub Update(Computer As ComputerIdentity)
        Dim Target = [Get](Computer.ID)

        If Not IsNothing(Target) Then
            Target.Name = Computer.Name
            Target.Description = If(Computer.Description, "")
            Target.SerialNumber = If(Computer.SerialNumber, "")
            Target.MACAddress = If(Computer.MACAddress, "")
            Target.AssetTag = If(Computer.AssetTag, "")
            Target.UUID = If(Computer.UUID, "")
        End If
    End Sub


    Public Sub Delete(Computer As ComputerIdentity)
        Dim Target = [Get](Computer.ID)

        If Not IsNothing(Target) Then
            ComputerContext.Computers.Remove(Target)
        End If
    End Sub
End Class
