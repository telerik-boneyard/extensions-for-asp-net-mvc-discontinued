namespace GridAlphabeticPaging.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Models;

    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index(string letter)
        {
            var db = new NorthwindDataContext();
            return View(new AlphabeticProductsViewModel
                            {
                                Products = db.Products,
                                Letters = Enumerable.Range(65, 25).Select(i => ((char)i).ToString()),
                                SelectedLetter = letter
                            });
        }
    }
}