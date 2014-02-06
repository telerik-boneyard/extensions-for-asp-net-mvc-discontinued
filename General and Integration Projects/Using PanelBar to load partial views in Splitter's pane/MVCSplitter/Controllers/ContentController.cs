using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCSplitter.Controllers
{
    public class ContentController : Controller
    {
        //
        // GET: /Content/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ContentPanelBar()
        {
            return PartialView();
        }


        public ActionResult Item1Content()
        {
            return PartialView();
        }

        public ActionResult Item2Content()
        {
            return PartialView();
        }

    }
}
