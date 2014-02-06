using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CodeFirstEF.Models
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }
        [Range(1,int.MaxValue)]
        public int Quantity { get; set; }   
        [Range(1,int.MaxValue)]
        public decimal Price { get; set; }
        [ForeignKey("Customer")]
        public int CustomerID { get; set; }
        public virtual Customer Customer { get; set; }
    }
}