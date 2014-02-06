using System.Linq;
using System.Web.Mvc;
using GroupPersistence.Models;
using Telerik.Web.Mvc;

namespace GroupPersistence.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View();
        }


        [GridAction]
        public ActionResult Select()
        {
            var products = Enumerable.Range(0, 50).Select(index =>
                new Product
                {
                    ID = index,
                    Name = "Product " + index,
                    Category = new [] {"Beverages", "Meat", "Pastry", "Vegetables" }[index % 4]
                });

            return View(new GridModel(products));
        }
    }
}
