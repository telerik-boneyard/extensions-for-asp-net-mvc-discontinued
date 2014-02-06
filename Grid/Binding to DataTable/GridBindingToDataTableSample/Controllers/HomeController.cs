namespace GridBindingToDataTableSample.Controllers
{
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.Web.Mvc;
    using Telerik.Web.Mvc;

    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(Products());
        }

        private DataTable Products()
        {
            var connection = ConfigurationManager.ConnectionStrings["Northwind"].ConnectionString;
            using (var dataAdapter = new SqlDataAdapter("SELECT * from Products", connection))
            {
                var dataTable = new DataTable();

                dataAdapter.Fill(dataTable);
                return dataTable;
            }
        }

        [GridAction]
        public ActionResult Select()
        {
            return View(new GridModel(Products()));
        }
    }
}
