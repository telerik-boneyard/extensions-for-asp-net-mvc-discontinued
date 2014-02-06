using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using UploadGridIntegration_MVC2.Models;

namespace UploadGridIntegration_MVC2.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        private const string SessionKey = "employees";

        private ICollection<Employee> Model
        {
            get
            {
                var employees = (ICollection<Employee>)Session[SessionKey];
                if (employees == null)
                {
                    employees = new List<Employee>
                    {
                        new Employee
                        {
                            ID = "1",
                            Name = "John Doe",
                            Picture = "johndoe.jpg"
                        }
                    };

                    Model = employees;
                }

                return employees;
            }

            set
            {
                Session[SessionKey] = value;
            }
        }

        public ActionResult Index()
        {
            return View(Model);
        }

        [HttpPost]
        public ActionResult Save(string id, HttpPostedFileBase attachment)
        {
            var attachmentName = Path.GetFileName(attachment.FileName);
            var imagesPath = Server.MapPath("~/Content/UserFiles");
            attachment.SaveAs(Path.Combine(imagesPath, attachmentName));

            return Json(new { fileName = attachmentName }, "text/plain");
        }

        [GridAction]
        public ActionResult Select()
        {
            return View(new GridModel(Model));
        }

        [HttpPost]
        [GridAction]
        public ActionResult Update(string id)
        {
            var employee = Model.First(e => e.ID == id);
            TryUpdateModel(employee);

            return View(new GridModel(Model));
        }

        [HttpPost]
        [GridAction]
        public ActionResult Insert(string lastUpload)
        {
            var employee = new Employee();
            if (TryUpdateModel(employee))
            {
                employee.ID = Guid.NewGuid().ToString();
                Model.Add(employee);
            }

            return View(new GridModel(Model));
        }
    }
}
