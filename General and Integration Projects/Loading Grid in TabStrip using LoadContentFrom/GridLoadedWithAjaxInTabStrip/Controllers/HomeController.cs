using GridLoadedWithAjaxInTabStrip.Models;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace GridLoadedWithAjaxInTabStrip.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        /// <summary>
        /// Displays the initial view ~/Views/Home/Index.aspx
        /// </summary>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Provides data for the grid. 
        /// Implements grid ajax binding: http://www.telerik.com/help/aspnet-mvc/telerik-ui-components-grid-data-binding-ajax-binding.html
        /// </summary>
        [GridAction]
        public ActionResult _Select()
        {
            // Creating dummy data to bind the grid 
            var data = Enumerable.Range(1, 100)
                                 .Select(index => new Customer
                                 {
                                     ID = index,
                                     Name = "Customer #" + index
                                 });

            // use GridModel in order for the GridActionAttribute to page, sort, filter or group the result and convert it to JSON
            return View(new GridModel(data));
        }

        /// <summary>
        /// Displays the partial view that contains the grid - ~/Views/Home/Grid.ascx. 
        /// Will be requested via ajax by the tabstrip when the user clicks the 'Grid' tab.
        /// </summary>
        /// <returns></returns>
        public ActionResult Grid()
        {
            return PartialView();
        }
    }
}
