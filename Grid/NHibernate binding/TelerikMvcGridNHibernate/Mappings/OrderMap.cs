using FluentNHibernate.Mapping;
using TelerikMvcGridNHibernate.Models;

namespace TelerikMvcGridNHibernate.Mappings
{
    public class OrderMap : ClassMap<Order>
    {
        public OrderMap()
        {
            Id(o => o.OrderID);
            
            Table("Orders");

            Map(map => map.ShipAddress);

            Map(map => map.ShippedDate);
        }
    }
}