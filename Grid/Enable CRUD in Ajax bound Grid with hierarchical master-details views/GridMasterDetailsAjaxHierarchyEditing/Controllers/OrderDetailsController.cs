using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using GridMasterDetailsAjaxHierarchyEditing.Models;

namespace GridMasterDetailsAjaxHierarchyEditing.Controllers
{
    public class OrderDetailsController : Controller
    {
        private NorthwindEntities dbContext = new NorthwindEntities();

        private IEnumerable<OrderDetailsViewModel> GetOrderDetails(int orderID)
        {
            var orderDetails = from o in dbContext.Order_Details
                               where o.OrderID == orderID
                               select new OrderDetailsViewModel
                               {
                                   Discount = o.Discount,
                                   ProductName = o.Product.ProductName,
                                   Quantity = o.Quantity,
                                   UnitPrice = o.UnitPrice,
                                   ProductID = o.ProductID,
                                   OrderID = o.OrderID
                               };
            return orderDetails;
        }

        [GridAction]
        public ActionResult _OrderDetailsSelect(int orderID)
        {
            return View(new GridModel(GetOrderDetails(orderID)));
        }

        [GridAction]
        public ActionResult _OrderDetailsUpdate(int productID, int orderID)
        {
            var orderDetails = dbContext.Order_Details.FirstOrDefault(od => od.ProductID == productID && od.OrderID == orderID);
            TryUpdateModel(orderDetails);
            dbContext.SaveChanges();
            return View(new GridModel(GetOrderDetails(orderID)));
        }

        [GridAction]
        public ActionResult _OrderDetailsDelete(int productID, int orderID)
        {
            var orderDetails = dbContext.Order_Details.FirstOrDefault(od => od.ProductID == productID && od.OrderID == orderID);
            dbContext.Orders.FirstOrDefault(o => o.OrderID == orderID).Order_Details.Remove(orderDetails);
            dbContext.SaveChanges();
            return View(new GridModel(GetOrderDetails(orderID)));
        }

    }
}
