using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CascadingComboBoxes.Models;
using Telerik.Web.Mvc;

namespace CascadingComboBoxes.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new NWDataContext().Categories.ToList());
        }

        public JsonResult _GetProducts(int? categoryId) 
        {
            NWDataContext nw = new NWDataContext();
            IQueryable<Product> products = nw.Products.AsQueryable<Product>();

            if (categoryId.HasValue)
                products = products.Where(p => p.CategoryID == categoryId.Value);

            return Json(new SelectList(products, "ProductID", "ProductName"), JsonRequestBehavior.AllowGet);
        }

        [GridAction]
        public ActionResult _GetOrders(int? productId)
        {
            NWDataContext nw = new NWDataContext();
            IList<Order> orders = new List<Order>();

            if (productId.HasValue)
                orders = nw.Order_Details.Where(od => od.ProductID == productId).Select(od => od.Order).ToList();

            return View(new GridModel<Order>
            {
                Data = orders
            });
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
