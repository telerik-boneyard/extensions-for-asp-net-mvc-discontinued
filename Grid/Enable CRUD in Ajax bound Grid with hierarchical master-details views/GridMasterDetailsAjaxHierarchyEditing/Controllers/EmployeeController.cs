using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GridMasterDetailsAjaxHierarchyEditing.Models;
using Telerik.Web.Mvc;

namespace GridMasterDetailsAjaxHierarchyEditing.Controllers
{
    public class EmployeeController : Controller
    {
        private NorthwindEntities dbContext = new NorthwindEntities();

        private IEnumerable<EmployeeViewModel> GetEmployees()
        {
            var employees = from e in dbContext.Employees
                            orderby e.EmployeeID
                            select new EmployeeViewModel
                            {
                                EmployeeID = e.EmployeeID,
                                City = e.City,
                                Country = e.Country,
                                FirstName = e.FirstName,
                                LastName = e.LastName,
                                Title = e.Title
                            };
            return employees;
        }

        [GridAction]
        public ActionResult _EmployeeSelect()
        {
            return View(new GridModel(GetEmployees()));
        }

        [GridAction]
        public ActionResult _EmployeeUpdate(int employeeID)
        {
            var emp = dbContext.Employees.FirstOrDefault(e => e.EmployeeID == employeeID);
            TryUpdateModel(emp);
            dbContext.SaveChanges();
            return View(new GridModel(GetEmployees()));
        }

        [GridAction]
        public ActionResult _EmployeeDelete(int employeeID)
        {
            var emp = dbContext.Employees.FirstOrDefault(e => e.EmployeeID == employeeID);
            dbContext.Employees.DeleteObject(emp);
            dbContext.SaveChanges();
            return View(new GridModel(GetEmployees()));
        }

        [GridAction]
        public ActionResult _EmployeeInsert()
        {
            Employee empToAdd = new Employee();
            if (TryUpdateModel(empToAdd))
            {
                dbContext.Employees.AddObject(empToAdd);
            }

            dbContext.SaveChanges();

            return View(new GridModel(GetEmployees()));
        }
    }
}
