using GridDropDownTreeView.Models;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace GridDropDownTreeView.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // data source for the dropdownlist
            ViewData["plants"] = new[] 
            {
                new Plant
                {
                    ID = 1,
                    Name = "Plant 1"
                },
                new Plant
                {
                    ID = 2,
                    Name = "Plant 2"
                }
            };

            return View();
        }

        /// <summary>
        /// Invoked using $.get when the end-user selects an option from the drop down
        /// </summary>
        /// <param name="plantId">The value which the user selected (plantId)</param>
        /// <returns>Partial view which contains the treeview (TreeView.ascx)</returns>
        public ActionResult TreeView(int plantId)
        {
            // data source for the treeview. We are using dummy data here.
            var plants = new [] 
            { 
                new Plant()
                {
                    ID = plantId,
                    Name = "Plant " + plantId,
                    ProductionLines =
                    {
                        new ProductionLine
                        {
                            ID = plantId  + 1,
                            Name = "First Production line (PlantID " + plantId + ", ProductionLineID " + (plantId  + 1) + ")"
                        },                    
                        new ProductionLine
                        {
                            ID = plantId  + 2,
                            Name = "Second Production line (PlantID " + plantId + ", ProductionLineID " + (plantId  + 2) + ")"
                        },
                    }
                }
            };

            return PartialView(plants);
        }

        /// <summary>
        /// Invoked using $.get when the end-user selects a tree node.
        /// </summary>
        /// <param name="productionLineId">The value of the selectd node (productioLineId)</param>
        /// <returns>Partial view which contains the grid (Grid.ascx)</returns>
        public ActionResult Grid(int productionLineId)
        {
            return PartialView(productionLineId);
        }

        /// <summary>
        /// Invoked by the grid to provide data for the ajax binding.
        /// </summary>
        /// <param name="productionLineId">ProductionLineId which is used to return the right data.</param>
        /// <returns></returns>
        [GridAction]
        public ActionResult ProductionRequests(int productionLineId)
        {
            // data source for the grid. We are using dummy data here.
            var productionRequests = new[] 
            { 
                new ProductionRequest
                {
                    Name = "First production request (ProductionLineID " + productionLineId + ")"
                },
                new ProductionRequest
                {
                    Name = "Second production request (ProductionLineID " + productionLineId + ")"
                }
            };

            return View(new GridModel(productionRequests));
        }
    }
}

