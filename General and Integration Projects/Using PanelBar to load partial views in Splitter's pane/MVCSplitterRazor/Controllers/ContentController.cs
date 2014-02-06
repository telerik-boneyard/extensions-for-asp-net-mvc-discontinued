using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCSplitterRazor.Controllers
{
    public class ContentController : Controller
    {
        //
        // GET: /Content/

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
