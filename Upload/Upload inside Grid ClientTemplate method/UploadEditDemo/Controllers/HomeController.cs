using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UploadEditDemo.Models;
using Telerik.Web.Mvc;

namespace UploadEditDemo.Controllers
{
    public class HomeController : Controller
    {
        NORTHWNDEntities dbContext = new NORTHWNDEntities();

        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View();
        }

        public ActionResult About()
        {
            return View();
        }


        [GridAction]
        public ActionResult GetCustomers()
        {
            return View(new GridModel(dbContext.Customers));
        }


        // This action method does not actually change the image src in the database(or overwrite the file)
        // it just updates the src of the image on the current page temporary !
        public ActionResult UploadImage(HttpPostedFileBase image, string customerID)
        {
            var relativePath = "/Content/Customers/" + customerID + "-image.jpg";
            var path = Server.MapPath("~"+relativePath);
            image.SaveAs(path);
            return Json(new { relativeUrl = relativePath });
        }
    }
}
