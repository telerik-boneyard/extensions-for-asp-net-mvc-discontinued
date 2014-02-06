using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GridMasterDetailsAjaxHierarchyEditing.Models
{
    public class OrderDetailsViewModel
    {
        public string ProductName
        {
            get;
            set;
        }

        public short Quantity
        {
            get;
            set;
        }

        public decimal UnitPrice
        {
            get;
            set;
        }

        public float Discount
        {
            get;
            set;
        }

        public int OrderID { get; set; }

        public int ProductID { get; set; }
    }
}