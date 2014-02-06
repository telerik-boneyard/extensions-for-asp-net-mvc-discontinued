namespace UploadClientValidation.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class SyncUploadController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Result()
        {
            return View();
        }
        
        [HttpPost]
        public ActionResult ProcessSubmit(IEnumerable<HttpPostedFileBase> attachments)
        {
            if (attachments != null)
            {
                TempData["UploadedAttachments"] = GetFileInfo(attachments);
            }

            return RedirectToAction("Result");
        }

        private IEnumerable<string> GetFileInfo(IEnumerable<HttpPostedFileBase> attachments)
        {
            return
                from a in attachments
                where a != null
                select string.Format("{0} ({1} bytes)", Path.GetFileName(a.FileName), a.ContentLength);
        }
    }
}
