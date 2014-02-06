namespace GridPopUpPosition.Controllers
{
    using System.Collections.Generic;
    using Telerik.Web.Mvc;
    using System.Web.Mvc;
    using System.Linq;
    using Models;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(GetProducts());
        }

        [GridAction]
        public JsonResult Select()
        {
            return Json(new GridModel(GetProducts()));
        }

        [GridAction]
        public JsonResult Update(int id)
        {
            //update the product here....

            return Json(new GridModel(GetProducts()));
        }

        private static IEnumerable<Product> GetProducts()
        {
            return Enumerable.Range(1, 10).Select(i => new Product {Id = i, Name = "Product" + i});
        }
    }
}