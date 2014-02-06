using GridAntiForgeryToken.Models;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using System.Linq;
using System.Collections.Generic;
namespace GridAntiForgeryToken.Controllers
{
    public class HomeController : Controller
    {
        private static List<Customer> customers;

        static HomeController()
        {
            customers = new List<Customer>();
            for (int i = 1; i < 10; i++)
            {
                customers.Add(new Customer() 
                {
                     ID = i,
                     Name = "Customer" + i
                });
            }
        }

        public ActionResult RowEditing()
        {
            return View();
        }

        public ActionResult BatchEditing()
        {
            return View();
        }

        [GridAction]
        [ValidateAntiForgeryToken]
        public ActionResult Select()
        {
            return View(new GridModel(customers));
        }

        [GridAction]
        [ValidateAntiForgeryToken]
        public ActionResult Update(Customer customer)
        {            
            return View(new GridModel(customers));
        }

        [GridAction]
        [ValidateAntiForgeryToken]
        public ActionResult Insert(Customer customer)
        {
            return View(new GridModel(customers));
        }

        [GridAction]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(Customer customer)
        {
            return View(new GridModel(customers));
        }

        [GridAction]
        [ValidateAntiForgeryToken]
        public ActionResult SaveChanges(IEnumerable<Customer> inserted,
            IEnumerable<Customer> updated,
            IEnumerable<Customer> deleted)
        {
            return View(new GridModel(customers));
        }
    }
}
