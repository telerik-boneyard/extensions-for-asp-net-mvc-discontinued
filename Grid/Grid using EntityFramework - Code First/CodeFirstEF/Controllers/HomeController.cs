using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CodeFirstEF.Models;
using Telerik.Web.Mvc;
using CodeFirstEF.ViewModels;

namespace CodeFirstEF.Controllers
{
    public class HomeController : Controller
    {
        CustomerContext dbContext = new CustomerContext();


        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";           
            return View();
        }

        [GridAction]
        public ActionResult GetCustomers()
        {
            return View(new GridModel(GetCustomerViewModels()));
        }

        [GridAction]
        public ActionResult UpdateCustomer(int id)
        {
            var customerToUpdate = dbContext.Customers.First(cust => cust.CustomerID == id);

            TryUpdateModel(customerToUpdate);
            dbContext.SaveChanges();

            return View(new GridModel(GetCustomerViewModels()));
        }

        

        [GridAction]
        public ActionResult InsertCustomer(Customer customerToAdd)
        {
            if (ModelState.IsValid)
            {
                dbContext.Customers.Add(customerToAdd);
                dbContext.SaveChanges();
            }

            return View(new GridModel(GetCustomerViewModels()));
        }

        [GridAction]
        public ActionResult DeleteCustomer(int id)
        {
            var customerToDelete = dbContext.Customers.First(cust => cust.CustomerID == id);

            if (customerToDelete!=null)
            {
                dbContext.Customers.Remove(customerToDelete);
                dbContext.SaveChanges();
            }

            return View(new GridModel(GetCustomerViewModels()));
        }

        //########################
        [GridAction]
        public ActionResult GetOrders(int customerID)
        {
            return View(new GridModel(GetOrderViewModelsForCustomer(customerID)));
        }

        

        [GridAction]
        public ActionResult UpdateOrder(int orderID,int customerID)
        {
            var orderToUpdate = dbContext.Orders.First(o => o.OrderID== orderID);

            TryUpdateModel(orderToUpdate);
            dbContext.SaveChanges();

            return View(new GridModel(GetOrderViewModelsForCustomer(customerID)));
        }

        [GridAction]
        public ActionResult InsertOrder(Order orderToAdd,int customerID)
        {
            if (ModelState.IsValid)
            {
                dbContext.Orders.Add(orderToAdd);
                dbContext.SaveChanges();
            }

            return View(new GridModel(GetOrderViewModelsForCustomer(customerID)));
        }

        [GridAction]
        public ActionResult DeleteOrder(int orderID,int customerID)
        {
            var orderToDelete = dbContext.Orders.First(order => order.OrderID == orderID);

            if (orderToDelete != null)
            {
                dbContext.Orders.Remove(orderToDelete);
                dbContext.SaveChanges();
            }

            return View(new GridModel(GetOrderViewModelsForCustomer(customerID)));
        }

        private IQueryable<CustomerViewModel> GetCustomerViewModels()
        {
            return dbContext.Customers
                            .Select(
                            c => new CustomerViewModel
                            {
                                CustomerID = c.CustomerID,
                                Name = c.Name,
                                Email=c.Email,
                                Phone=c.Phone
                            });
        }

        private IQueryable<OrderViewModel> GetOrderViewModelsForCustomer(int customerID)
        {
            return dbContext.Orders.Where(o => o.CustomerID == customerID)
                            .Select(
                            o => new OrderViewModel
                            {
                                OrderID = o.OrderID,
                                Price = o.Price,
                                Quantity = o.Quantity
                            })
                        ;
        }

    }
}
