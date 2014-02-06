using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using CustomJsonSerializer.Models;
using Telerik.Web.Mvc;

namespace CustomJsonSerializer.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [GridAction]
        public ActionResult _Select()
        {
            return Json(new GridModel(GetTooLargeData()));
        }

        private IEnumerable<Product> GetTooLargeData()
        {
            return Enumerable.Range(1, 100000).Select(i => new Product { Id = i, Name = "Product" + i });
        }
    }
}
