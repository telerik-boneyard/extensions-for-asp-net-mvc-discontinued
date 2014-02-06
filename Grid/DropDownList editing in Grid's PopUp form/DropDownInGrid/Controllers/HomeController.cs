namespace DropDownInGrid.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Models;
    using Telerik.Web.Mvc;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Categories = new NorthwindDataContext().Categories;
            return View();
        }

        [GridAction]
        public JsonResult GetProducts()
        {
            return Json(new GridModel(new NorthwindDataContext()
                                          .Products.Select(p => new ProductViewModel
                                                           {
                                                               ProductID = p.ProductID,
                                                               ProductName = p.ProductName,
                                                               CategoryID = p.CategoryID,
                                                               CategoryName = p.Category.CategoryName
                                                           })));
        }

        [GridAction]
        public JsonResult Update(int id)
        {
            var db = new NorthwindDataContext();
            var product = db.Products.SingleOrDefault(p => p.ProductID == id);
            if(TryUpdateModel(product))
            {
                db.SubmitChanges();
            }
            return Json(new GridModel(db.Products.Select(p => new ProductViewModel
                                          {
                                              ProductID = p.ProductID,
                                              ProductName = p.ProductName,
                                              CategoryID = p.CategoryID,
                                              CategoryName = p.Category.CategoryName
                                          })));
        }

    }
}