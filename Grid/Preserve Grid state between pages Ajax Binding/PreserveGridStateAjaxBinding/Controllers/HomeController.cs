using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Telerik.Web.Mvc;
using Telerik.Web.Mvc.Extensions;
using PreserveGridStateAjaxBinding.Models;
namespace PreserveGridStateAjaxBinding.Controllers
{
    public class HomeController : Controller
    {
        private const string GRID_STATE_SESSION_KEY = "state";
        private NorthwindEntities context = new NorthwindEntities();

        public ActionResult Index()
        {
            var state = Session[GRID_STATE_SESSION_KEY] as RouteValueDictionary;
            if (state != null)
            {
                AddGridStateToRouteValues("Grid", state);
            }
            return View();
        }

        private void AddGridStateToRouteValues(string gridName, 
            RouteValueDictionary gridRouteValues)
        {
            // The Grid searches for its paramters and applies them if they are present
            foreach (var key in gridRouteValues.Keys)
            {
                if (!key.Contains(gridName + "-"))
                {
                    RouteData.Values[gridName + "-" + key] = gridRouteValues[key];
                }
            }          
        }

        [GridAction]
        public ActionResult _Select()
        {
            // The GridRouteValues ControllerBase extension method extracts the 
            // Grid's filter, orderBy, groupBy, page and size values from the current request
            Session[GRID_STATE_SESSION_KEY] = this.GridRouteValues();
            return View(new GridModel(context.Products));
        }

        public ActionResult ProductDetails(int id)
        {
            var product = context.Products.First(p => p.ProductID == id);
            return View(product);
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
