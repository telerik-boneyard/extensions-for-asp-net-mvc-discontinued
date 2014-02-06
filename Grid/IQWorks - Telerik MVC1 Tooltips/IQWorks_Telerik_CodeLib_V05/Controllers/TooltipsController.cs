//------------------------------------------
// 03/20/2010 Information Quality Works
// This drives the tooltip views.
//------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using IQWorksTelerikCodeLib.Models;
using Telerik.Web.Mvc; 

namespace IQWorksTelerikCodeLib.Controllers
{
    public class TooltipsController : Controller
    {
        /// <summary>
        /// Show first page
        /// </summary>
      public ActionResult Index(int? workindex, string OtherParms)
            {
            TempData["workIndex"] = 0;

            if (workindex != null)
                TempData["workIndex"] = workindex;
       
            
            ViewData["orientation"] = "Horizontal"; // "Vertical";
            return View();
            }


      /// <summary>
      /// Show tooltip grid with over each row scenerio
      /// </summary>
      public ActionResult TooltipOverColumn()
          {
          IEnumerable<iqCompanyVM> vm = GetiqCompanies();
          return View(vm);
          }


        /// <summary>
        /// Show tooltip with data read from data
        /// </summary>
        public ActionResult TooltipFromData()
        {
            IEnumerable<iqCompanyVM> vm = GetiqCompanies();
            return View(vm);
        }




        /// <summary>
        /// Do the ajax binding
        /// </summary>
        [GridAction]
        public ActionResult _AjaxBindingCompany()
            {
            IEnumerable<iqCompanyVM> model = GetiqCompanies();
            return View(new GridModel
            {
                Data = model
            });

            }


        /// <summary>
        ///  load the viewmodel data
        /// </summary>
         
        private IEnumerable<iqCompanyVM> GetiqCompanies()
            {
            iqDataEntities iqData = new iqDataEntities();
           
            return from o in iqData.iqCompany
                   where (o.coCompanyName != " ")
                   select new iqCompanyVM()
                   {
                       cCompanyNo = o.coCompanyNo,
                       cCompanyName = o.coCompanyName,
                       cContact = o.coContact,
                       cEmail = o.coEmail,
                       cPhone = o.coPhone,
                       cGroupCode = o.coGroupCode  
                   };
            }


        /// <summary>
        /// This method returns data for the Tooltip from data 
        /// example.
        /// </summary>         
        public JsonResult CompanyGridTooltip(int? Id)
        {
            iqDataEntities _dataModel = new iqDataEntities();
            
            if (Id == null)
                Id = 6;
            var CompanyForTooltip = (from m in _dataModel.iqCompany
                                   where m.coCompanyNo == Id
                                   select m).First();

            var data = new
            {
                name = CompanyForTooltip.coCompanyName,
                address = CompanyForTooltip.coAddress1
            };

            // ASP.NET MVC2 Needs JsonRequestBehavior.AllowGet
            // return Json(data, JsonRequestBehavior.AllowGet);
            return Json(data);
        }
    }
}
