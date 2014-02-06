using System.Linq;
using System.Web.Mvc;
using DropDownInGrid.Models;
using Telerik.Web.Mvc;

namespace DropDownInGrid.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // All available categories. Used to populate the dropdownlist in ~/Views/Home/EditorTemplates/Category.ascx
            ViewBag.Categories = new Models.NorthwindEntities().Categories;

            return View();
        }

        [GridAction]
        public ActionResult Select()
        {
            var products = new Models.NorthwindEntities().Products;

            var data = from p in products
                           select new // Use anonymous type to avoid JSON serialization exceptions due to circular object references. Also serialize only the required properties (for performance)
                           {
                               p.Category,
                               p.ProductID,
                               p.ProductName,
                               p.CategoryID
                           };

            return View(new GridModel(data));
        }

        [GridAction]
        public ActionResult Update(Product product)
        {
            var northwind = new Models.NorthwindEntities();
           
            var products = northwind.Products;

            // Get the product being updated using the posted ProductID
            var actualProduct = products.FirstOrDefault(p => p.ProductID == product.ProductID);

            if (actualProduct != null)
            {
                // Update the ProductName using the posted product name
                actualProduct.ProductName = product.ProductName;
                var categories = northwind.Categories;

                // Find the category which has been chosen using the posted Category.CategoryID (specified using the dropdownlist)
                var category = categories.FirstOrDefault(c => c.CategoryID == product.Category.CategoryID);

                // Set the chosen Category
                actualProduct.Category = category;

                // Save the changes in the database
                northwind.SaveChanges();
            }

            var data = from p in products
                       select new // Use anonymous type to avoid JSON serialization exceptions due to circular object references. Also serialize only the required properties (for performance)
                       {
                           p.Category,
                           p.ProductID,
                           p.ProductName,
                           p.CategoryID
                       };
            
            return View(new GridModel(data));
        }

        [GridAction]
        public ActionResult Insert(Product product)
        {
            var northwind = new Models.NorthwindEntities();
           
            var products = northwind.Products;
            var categories = northwind.Categories;

            // Find the category which has been chosen using the posted Category.CategoryID (specified using the dropdownlist)
            var category = categories.FirstOrDefault(c => c.CategoryID == product.Category.CategoryID);
            // Set the chosen Category
            product.Category = category;
            // Add the new product
            products.AddObject(product);
            // Save the changes in the database
            northwind.SaveChanges();

            var data = from p in products
                       select new // Use anonymous type to avoid JSON serialization exceptions due to circular object references. Also serialize only the required properties (for performance)
                       {
                           p.Category,
                           p.ProductID,
                           p.ProductName,
                           p.CategoryID
                       };
            
            return View(new GridModel(data));
        }

        [GridAction]
        public ActionResult Delete(Product product)
        {
            var northwind = new Models.NorthwindEntities();

            var products = northwind.Products;

            // Get the product being deleted using the posted ProductID
            var actualProduct = products.FirstOrDefault(p => p.ProductID == product.ProductID);

            if (actualProduct != null)
            {
                // Delete the product
                products.DeleteObject(actualProduct);
                // Save the changes in the database
                northwind.SaveChanges();
            }

            var data = from p in products
                       select new // Use anonymous type to avoid JSON serialization exceptions due to circular object references. Also serialize only the required properties (for performance)
                       {
                           p.Category,
                           p.ProductID,
                           p.ProductName,
                           p.CategoryID
                       };

            return View(new GridModel(data));
        }

    }
}
