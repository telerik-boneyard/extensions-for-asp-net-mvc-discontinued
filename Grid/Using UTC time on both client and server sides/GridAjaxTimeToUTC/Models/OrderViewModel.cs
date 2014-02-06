using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GridAjaxTimeToUTC.Models
{
    public class OrderViewModel
    {
        private DateTime dateOfOrder;

        public int OrderID { get; set; }

        //Explicitly specifying the kind of the dates to be UTC
        public DateTime DateOfOrder
        {
            get
            {
                return DateTime.SpecifyKind(dateOfOrder, DateTimeKind.Utc);
            }
            set
            {
                this.dateOfOrder = DateTime.SpecifyKind(value, DateTimeKind.Utc);
            }
        }
    }
}