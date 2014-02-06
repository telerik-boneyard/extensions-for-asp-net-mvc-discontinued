using CustomPopUpForm.Models;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace CustomPopUpForm.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [GridAction]
        public ActionResult _Select()
        {
            return View(new GridModel(GetCustomers()));
        }

        [GridAction]
        public ActionResult _Update(Customer customer)
        {
            var northwind = new NorthwindDataContext();
            
            var target = northwind.Customers.FirstOrDefault(c => c.CustomerID == customer.CustomerID);

            if (target != null)
            {
                target.CompanyName = customer.CompanyName;
                target.ContactName = customer.ContactName;
                northwind.SubmitChanges();
            }

            return View(new GridModel(GetCustomers()));
        }

        private IQueryable<Customer> GetCustomers()
        {
            var northwind = new NorthwindDataContext();
            return northwind.Customers;
        }
    }
}