using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using PreserveGridStateBetweenPages.Models;
using Telerik.Web.Mvc.Extensions;

namespace PreserveGridStateBetweenPages.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.GridState = this.GridRouteValues();

            return View(Data());
        }

        public ActionResult Details(int id)
        {
            ViewBag.GridState = this.GridRouteValues();

            var product = Data().FirstOrDefault(p => p.ID == id);

            return View(product);
        }

        public IEnumerable<Product> Data()
        {
            return Enumerable.Range(1, 100).Select(index =>
                new Product
                {
                    ID = index,
                    Name = "Product " + index
                });
        }
    }
}
