using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NullableEnum.Models;

namespace NullableEnum.Controllers
{
    public class HomeController : Controller
    {
        public static List<Person> persons = new List<Person>()
        {
            new Person{PersonID=1,Name="John",DateOfBirth=new DateTime(1978,12,13),UserRole=Role.Admin},
            new Person{PersonID=2,Name="Sarah",DateOfBirth=new DateTime(1956,8,25)}
        };

        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View(persons);
        }

        public ActionResult UpdatePerson(Person updated)
        {
            var per = persons.FirstOrDefault(p => p.PersonID == updated.PersonID);
            TryUpdateModel(per);

            return RedirectToAction("Index");
        }
    }
}
