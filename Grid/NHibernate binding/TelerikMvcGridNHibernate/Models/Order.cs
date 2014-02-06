using System;

namespace TelerikMvcGridNHibernate.Models
{
    public class Order
    {
        public virtual int OrderID { get; set; }
        public virtual string ShipAddress { get; set; }
        public virtual DateTime ShippedDate { get; set; }
    }
}