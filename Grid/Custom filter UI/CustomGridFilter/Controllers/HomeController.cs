using System.Web.Mvc;
using CustomGridFilter.Models;
using Telerik.Web.Mvc;

namespace CustomGridFilter.Controllers
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
            return View(new GridModel(new[] {
						new Product
						{
							ID = 1,
							Name = "Product 1",
                            Category = "Food"
						},
						new Product
						{
							ID = 2,
							Name = "Product 2",
                            Category = "Beverages"
						}
					}));
        }
    }
}
