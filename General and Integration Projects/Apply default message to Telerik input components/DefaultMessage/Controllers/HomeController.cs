namespace DefaultMessage.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using DefaultMessage.Models;

    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult _AjaxLoading(string text)
        {
            using (var nw = new NorthwindDataContext())
            {
                var products = nw.Products.AsQueryable();

                if (!string.IsNullOrEmpty(text))
                {
                    products = products.Where((p) => p.ProductName.StartsWith(text));
                }

                return new JsonResult
                {
                    Data = new SelectList(products.ToList(), "ProductID", "ProductName")
                };
            }
        }

        [HttpPost]
        public ActionResult _AutoCompleteAjaxLoading(string text)
        {
            using (var nw = new NorthwindDataContext())
            {
                var products = nw.Products.AsQueryable();

                if (!string.IsNullOrEmpty(text))
                {
                    products = products.Where((p) => p.ProductName.StartsWith(text));
                }

                return new JsonResult { Data = products.Select(p => p.ProductName).ToList() };
            }
        }
    }
}