using NHibernate.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using TelerikMvcGridNHibernate.Models;

namespace TelerikMvcGridNHibernate.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [GridAction]
        public ActionResult _Select()
        {
            var orders = MvcApplication.NorthwindSession.Query<Order>();

            return View(new GridModel(orders));
        }
    }
}
