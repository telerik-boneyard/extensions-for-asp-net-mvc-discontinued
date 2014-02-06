using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TelerikEditorTemplates.Core.Formatting
{
    public static class Boolean
    {
        public static string YesNo(bool input)
        {
            return input ? "Yes" : "No";
        }
    }
}
