using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CodeFirstEF.ViewModels
{
    public class OrderViewModel
    {
        public int OrderID { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}