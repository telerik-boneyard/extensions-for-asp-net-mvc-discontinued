using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CodeFirstEF.ViewModels
{
    public class CustomerViewModel
    {
        public int CustomerID { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}