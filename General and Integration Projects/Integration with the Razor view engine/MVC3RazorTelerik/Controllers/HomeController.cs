using System.Web.Mvc;
using MVC3RazorTelerik.Models;

namespace MVC3RazorTelerik.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View(new[] { new Product { ID = 1, Name = "Name 1" } });
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
