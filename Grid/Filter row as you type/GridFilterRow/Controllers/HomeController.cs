using System.Web.Mvc;
using GridFilterRow.Models;
using Telerik.Web.Mvc;

namespace GridFilterRow.Controllers
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
            return View(new GridModel(new NorthwindDataContext().Orders));
        }
    }
}
