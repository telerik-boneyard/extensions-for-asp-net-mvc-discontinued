namespace RazorSample.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Models;
    using Telerik.Web.Mvc;
    using System.Linq;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(GetData());
        }
        
        [GridAction]
        public ActionResult Select()
        {
            return GetView();
        }

        [HttpPost]
        [GridAction]
        public ActionResult Insert()
        {
            using (var db = new NorthwindDataContext())
            {
                var product = new Product();
                if (TryUpdateModel(product))
                {
                    db.Products.InsertOnSubmit(product);
                    db.SubmitChanges();
                }
            }
            return GetView();
        }

        [HttpPost]
        [GridAction]
        public ActionResult Update(int id)
        {
            using (var db = new NorthwindDataContext())
            {
                if(TryUpdateModel(db.Products.First(p => p.ProductID == id)))
                {
                    db.SubmitChanges();
                }
            }
            return GetView();
        }

        [HttpPost]
        [GridAction]
        public ActionResult Delete(int id)
        {
            using (var db = new NorthwindDataContext())
            {
                db.Products.DeleteOnSubmit(db.Products.First(p => p.ProductID == id));
                db.SubmitChanges();
            }
            return GetView();
        }

        private IEnumerable<dynamic> GetData()
        {
            var db = new NorthwindDataContext();
            return db.Products;
        }

        private JsonResult GetView()
        {
            return Json(GetData());
        }
    }
}
