using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GridAjaxTimeToUTC.Models;
using Telerik.Web.Mvc;

namespace GridAjaxTimeToUTC.Controllers
{
    public class HomeController : Controller
    {
        OrdersDBEntities dbContext = new OrdersDBEntities();

        public HomeController()
        {
            //AddNewOrder();
        }

        public ActionResult Index()
        {

            return View();
        }


        [GridAction]
        public ActionResult _GetOrders()
        {
            var orders = dbContext.Orders.Select(
                o => new OrderViewModel
                {
                    OrderID = o.OrderID,
                    DateOfOrder = o.DateOfOrder
                });

            return View(new GridModel(orders));
        }

        [HttpPost]
        [GridAction]
        public ActionResult UpdateOrder(OrderViewModel updated)
        {
            var order = dbContext.Orders.FirstOrDefault(o => o.OrderID == updated.OrderID);

            order.DateOfOrder = updated.DateOfOrder;
            order.OrderID = updated.OrderID;

            dbContext.SaveChanges();

            var orders = dbContext.Orders.Select(
                o => new OrderViewModel
                {
                    OrderID = o.OrderID,
                    DateOfOrder = o.DateOfOrder
                });


            return View(new GridModel(orders));
        }

        public ActionResult About()
        {
            return View();
        }

        //Add one new record and keep the last five
        private void AddNewOrder()
        {
            var ordersToDel = dbContext.Orders.Take(dbContext.Orders.Count() - 5);
            foreach (var item in ordersToDel)
            {
                dbContext.Orders.DeleteObject(item);
            }
            dbContext.Orders.AddObject(new Order { DateOfOrder = DateTime.UtcNow });
            dbContext.SaveChanges();
        }
    }
}
