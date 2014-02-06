using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OverlappingTabs.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult EasyTabs()
        {
            ViewBag.Message = "Easy Tabs";

            return View();
        }

        public ActionResult TabsWithImages()
        {
            ViewBag.Message = "Tabs With Images";

            return View();
        }
    }
}
