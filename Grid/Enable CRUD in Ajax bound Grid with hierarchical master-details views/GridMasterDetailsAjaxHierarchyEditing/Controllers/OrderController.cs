using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GridMasterDetailsAjaxHierarchyEditing.Models;
using Telerik.Web.Mvc;

namespace GridMasterDetailsAjaxHierarchyEditing.Controllers
{
    public class OrderController : Controller
    {
        private NorthwindEntities dbContext = new NorthwindEntities();

        private IEnumerable<OrderViewModel> GetOrders(int employeeID)
        {
            var orders = from o in dbContext.Orders
                         where o.EmployeeID == employeeID
                         select new OrderViewModel
                         {
                             OrderID = o.OrderID,
                             ShipAddress = o.ShipAddress,
                             ShipCountry = o.ShipCountry,
                             ShipName = o.ShipName,
                         };
            return orders;
        }

        [GridAction]
        public ActionResult _OrderSelect(int employeeID)
        {
            return View(new GridModel(GetOrders(employeeID)));
        }

        [GridAction]
        public ActionResult _OrderUpdate(int orderID, int employeeID)
        {
            var order = dbContext.Orders.FirstOrDefault(o => o.OrderID == orderID);
            TryUpdateModel(order);
            dbContext.SaveChanges();
            return View(new GridModel(GetOrders(employeeID)));
        }

        [GridAction]
        public ActionResult _OrderDelete(int orderID, int employeeID)
        {
            var order = dbContext.Orders.FirstOrDefault(o => o.OrderID == orderID);
            dbContext.Employees.FirstOrDefault(e => e.EmployeeID == employeeID).Orders.Remove(order);

            dbContext.SaveChanges();
            return View(new GridModel(GetOrders(employeeID)));
        }

        [GridAction]
        public ActionResult _OrderInsert(int employeeID)
        {
            Order orderToAdd = new Order();
            if (TryUpdateModel(orderToAdd))
            {
                dbContext.Employees.FirstOrDefault(e => e.EmployeeID == employeeID).Orders.Add(orderToAdd);
            }

            dbContext.SaveChanges();
            return View(new GridModel(GetOrders(employeeID)));
        }
    }
}
