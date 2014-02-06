using System.Web.Mvc;
using Telerik.Web.Mvc;
using T4TemplatesIntegration.Models;
using System.Collections.Generic;
using System;

namespace T4TemplatesIntegration.Controllers
{
    [HandleError]
    public partial class HomeController : Controller
    {
        public virtual ActionResult Index()
        {
            ViewData["Message"] = "Welcome to ASP.NET MVC!";

            return View();
        }

        [GridAction]
        public virtual ActionResult _AjaxBinding()
        {
            List<Customer> list = new List<Customer> { 
                new Customer
                {
                    ID = 1,
                    Name = "John",
                    Birthday = new DateTime()
                },
                
                new Customer
                {
                    ID = 2,
                    Name = "Smith",
                    Birthday = DateTime.Now.AddDays(10)
                },

                new Customer
                {
                    ID = 3,
                    Name = "Scott",
                    Birthday = DateTime.Now.AddMonths(-20)
                },

                new Customer
                {
                    ID = 4,
                    Name = "David",
                    Birthday = DateTime.Now
                },

                new Customer
                {
                    ID = 5,
                    Name = "Steve",
                    Birthday = DateTime.Now.AddYears(5)
                }
            };

            return View(new GridModel<Customer>
            {
                Data = list
            });
        }


        public virtual ActionResult About()
        {
            return View();
        }

        public virtual ActionResult Param(int id)
        {
            return View();
        }
    }
}
