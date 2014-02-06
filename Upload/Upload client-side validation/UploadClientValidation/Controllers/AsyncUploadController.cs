namespace UploadClientValidation.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Web;
    using System.Web.Mvc;

    public class AsyncUploadController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Save(IEnumerable<HttpPostedFileBase> attachments)
        {
            // The Name of the Upload component is "attachments" 
            foreach (var file in attachments)
            {
                // Some browsers send file names with full path. This needs to be stripped.
                var fileName = Path.GetFileName(file.FileName);
                var physicalPath = Path.Combine(Server.MapPath("~/App_Data"), fileName);

                // The files are not actually saved in this demo
                // file.SaveAs(physicalPath);
            }

            // Return an empty string to signify success
            return Content("");
        }

        [HttpPost]
        public ActionResult ProcessSubmit()
        {
            return RedirectToAction("Index");
        }
    }
}
