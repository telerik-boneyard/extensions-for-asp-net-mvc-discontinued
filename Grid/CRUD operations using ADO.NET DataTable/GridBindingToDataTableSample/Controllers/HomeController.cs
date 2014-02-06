namespace GridBindingToDataTableSample.Controllers
{
    using System.Web.Mvc;
    using Models;
    using Telerik.Web.Mvc;

    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new DataTableViewModel
            {
                Data = new ProductsRepository().All()
            });
        }

        [GridAction]
        public ActionResult _AjaxDataTableBinding()
        {
            return View(new GridModel(new ProductsRepository().All()));
        }

        public ActionResult UpdateDataTableBinding(int id, string productName, int supplierID, int categoryID,
            decimal unitPrice, string quantityPerUnit)
        {
            new ProductsRepository().Update(id, productName, supplierID, categoryID, unitPrice, quantityPerUnit);
            return RedirectToAction("Index");
        }

        public ActionResult DeleteDataTableBinding(int id)
        {
            new ProductsRepository().Delete(id);

            return RedirectToAction("Index");
        }

        public ActionResult InsertDataTableBinding(string productName, int supplierID, int categoryID,
            decimal unitPrice, string quantityPerUnit)
        {
            new ProductsRepository().Add(productName, supplierID, categoryID, unitPrice, quantityPerUnit);

            return RedirectToAction("Index");
        }
    }
}
