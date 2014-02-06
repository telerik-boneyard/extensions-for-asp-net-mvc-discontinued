using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TelerikEditorTemplates.Core.Interfaces
{
    public interface IContactModel
    {
        string Name { get; set; }
        string Email { get; set; }
        string Subject { get; set; }
        string Message { get; set; }
    }
}
