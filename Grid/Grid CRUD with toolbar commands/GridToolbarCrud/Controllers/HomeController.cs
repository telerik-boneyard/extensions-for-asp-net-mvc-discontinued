using GridToolbarCrud.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace GridToolbarCrud.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        
        /// <summary>
        /// Returns a list of Customer objects which are stored in session.
        /// </summary>
        private IList<Customer> GetCustomers()
        {
            var model = Session["customers"] as IList<Customer>;
            
            if (model == null)
            {
                Session["customers"] = model = Enumerable.Range(10, 100)
                    .Select((i) => new Customer
                    {
                        ID = i,
                        Name = "Customer " + i
                    })
                    .ToList();
            }

            return model;
        }

        /// <summary>
        /// Invoked when the grid is paged, sorted etc
        /// </summary>
        [GridAction]
        public ActionResult _Select()
        {
            return View(new GridModel(GetCustomers()));
        }
        
        /// <summary>
        /// Invoked when a customer is updated
        /// </summary>
        [GridAction]
        public ActionResult _Update(Customer customer)
        {
            var customers = GetCustomers();

            var target = customers.FirstOrDefault(c => c.ID == customer.ID);

            if (target != null)
            {
                target.Name = customer.Name;
            }
            
            return View(new GridModel(customers));
        }
        
        /// <summary>
        /// Invoked when a customer is deleted
        /// </summary>
        [GridAction]
        public ActionResult _Delete(Customer customer)
        {
            var customers = GetCustomers();

            var target = customers.FirstOrDefault(c => c.ID == customer.ID);

            if (target != null)
            {
                customers.Remove(target);
            }
            
            return View(new GridModel(customers));
        }

        /// <summary>
        /// Invoked when a customer is inserted
        /// </summary>
        [GridAction]
        public ActionResult _Insert(Customer customer)
        {
            var customers = GetCustomers();

            customer.ID = customers.Min(c => c.ID) - 1;

            customers.Insert(0, customer);
            
            return View(new GridModel(customers));
        }        
    }
}
