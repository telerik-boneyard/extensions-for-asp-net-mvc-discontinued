using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using Validation.Models;
namespace Validation.Controllers
{
    public class HomeController : Controller
    {
        private UserRepository repositor = new UserRepository();

        public ActionResult AjaxLoadedValidation()
        {
            return View();
        }

        public ActionResult InsertUser()
        {
            User user = new User();
            return PartialView(user);
        }

        [HttpPost]
        public ActionResult InsertUser(User user)
        {            
            if (ModelState.IsValid)
            {
                repositor.InsertUser(user);
                return RedirectToAction("AjaxLoadedValidation");
            }
            else
            {
                return PartialView(user);
            }  
        }

        [GridAction]
        public ActionResult _Select()
        {
            var data = repositor.GetUsers();
            return View(new GridModel(data));
        }

        [GridAction]
        public ActionResult _SaveBatchEditing(IEnumerable<User> inserted,
            IEnumerable<User> updated)
        {
            if (inserted != null)
            {
                foreach (var user in inserted)
                {
                    repositor.InsertUser(user);
                }
            }
            if (updated != null)
            {
                foreach (var user in updated)
                {
                    repositor.UpdateUser(user);
                }
            }

            return View(new GridModel(repositor.GetUsers()));
        }

        public ActionResult IE8ValidationOlderJQuery()
        {
            return View();
        }

        public ActionResult IE8ValidationNewerJQuery()
        {
            return View();
        }

        public ActionResult HiddenInputsJQueryValidate1_9()
        {
            List<string> emails = new List<string>();
            emails.Add("");
            for (int i = 0; i < 10; i++)
            {
                emails.Add(i + "email@domain.com");
            }
            ViewData["emails"] = emails;
            return View(new User());
        }
    }
}
