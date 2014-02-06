using BatchEditingWithComboBoxEditorTemplate.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace BatchEditingWithComboBoxEditorTemplate.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        [GridAction]
        public ActionResult _SelectBatchEditing()
        {
            using (var nw = new NWDataContext())
            {
                List<EditableOrder> list = nw.Orders
                                             .Select(o => new EditableOrder
                                             {
                                                 OrderID = o.OrderID,
                                                 OrderDate = o.OrderDate ?? DateTime.Now,
                                                 Employee = new EditableEmployee { EmployeeID = o.Employee.EmployeeID, FirstName = o.Employee.FirstName, LastName = o.Employee.LastName },
                                                 Freight = o.Freight ?? 0
                                             })
                                             .ToList();

                return View(new GridModel(list));
            }
        }

        [HttpPost]
        public ActionResult _SelectEmployees()
        {
            var employees = new NWDataContext().Employees
                                               .Select(e => new { Id = e.EmployeeID, Name = e.FirstName + " " + e.LastName })
                                               .OrderBy(e => e.Name);

            return new JsonResult { Data = new SelectList(employees.ToList(), "Id", "Name") };
        }

        [HttpPost]
        [GridAction]
        public ActionResult _SaveBatchEditing([Bind(Prefix = "inserted")]IEnumerable<EditableOrder> insertedOrders,
            [Bind(Prefix = "updated")]IEnumerable<EditableOrder> updatedOrders,
            [Bind(Prefix = "deleted")]IEnumerable<EditableOrder> deletedOrders)
        {
            var nw = new NWDataContext();

            if (insertedOrders != null)
            {
                foreach (var order in insertedOrders)
                {
                    nw.Orders.InsertOnSubmit(new Order { 
                        OrderID = order.OrderID,
                        OrderDate = order.OrderDate,
                        Employee = nw.Employees.Where(e => e.EmployeeID == order.Employee.EmployeeID).SingleOrDefault(),
                        Freight = order.Freight
                    });
                    nw.SubmitChanges();
                }
            }
            if (updatedOrders != null)
            {
                foreach (var order in updatedOrders)
                {
                    var target = nw.Orders.Where(o => o.OrderID == order.OrderID).SingleOrDefault();
                    if (target != null)
                    {
                        target.OrderDate = order.OrderDate;
                        target.Employee = nw.Employees.Where(e => e.EmployeeID == order.Employee.EmployeeID).SingleOrDefault();
                        target.Freight = order.Freight;
                    }
                }
                nw.SubmitChanges();
            }
            if (deletedOrders != null)
            {
                foreach (var order in deletedOrders)
                {
                    nw.Orders.DeleteOnSubmit(nw.Orders.Where(o => o.OrderID == order.OrderID).SingleOrDefault());
                    nw.SubmitChanges();
                }
            }

            List<EditableOrder> list = nw.Orders
                             .Select(o => new EditableOrder
                             {
                                 OrderID = o.OrderID,
                                 OrderDate = o.OrderDate ?? DateTime.Now,
                                 Employee = new EditableEmployee { EmployeeID = o.Employee.EmployeeID, FirstName = o.Employee.FirstName, LastName = o.Employee.LastName },
                                 Freight = o.Freight ?? 0
                             })
                             .ToList();

            return View(new GridModel(list));
        }        
    }
}
