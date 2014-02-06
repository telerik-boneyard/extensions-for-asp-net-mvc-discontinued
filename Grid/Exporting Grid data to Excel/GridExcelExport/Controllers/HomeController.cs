using GridExcelExport.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;
using Telerik.Web.Mvc.Extensions;
using NPOI.HSSF.UserModel;

namespace GridExcelExport.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(Model());
        }

        private IQueryable<Order> Model()
        {
            return new NorthwindEntities().Orders;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        [GridAction]
        public ActionResult IndexAjax()
        {
            return View(new GridModel(Model()));
        }

        public ActionResult Export(int page, string orderBy, string filter)
        {
            //Get the data representing the current grid state - page, sort and filter
            GridModel model = Model().ToGridModel(page, 10, orderBy, string.Empty, filter);
            var orders = model.Data.Cast<Order>();

            //Create new Excel workbook
            var workbook = new HSSFWorkbook();

            //Create new Excel sheet
            var sheet = workbook.CreateSheet();

            //(Optional) set the width of the columns
            sheet.SetColumnWidth(0, 10 * 256);
            sheet.SetColumnWidth(1, 50 * 256);
            sheet.SetColumnWidth(2, 50 * 256);
            sheet.SetColumnWidth(3, 50 * 256);

            //Create a header row
            var headerRow = sheet.CreateRow(0);

            //Set the column names in the header row
            headerRow.CreateCell(0).SetCellValue("OrderID");
            headerRow.CreateCell(1).SetCellValue("ShipAddress");
            headerRow.CreateCell(2).SetCellValue("CustomerID");
            headerRow.CreateCell(3).SetCellValue("OrderDate");

            //(Optional) freeze the header row so it is not scrolled
            sheet.CreateFreezePane(0, 1, 0, 1);

            int rowNumber = 1;

            //Populate the sheet with values from the grid data
            foreach (Order order in orders)
            {
                //Create a new row
                var row = sheet.CreateRow(rowNumber++);

                //Set values for the cells
                row.CreateCell(0).SetCellValue(order.OrderID);
                row.CreateCell(1).SetCellValue(order.ShipAddress);
                row.CreateCell(2).SetCellValue(order.CustomerID);
                row.CreateCell(3).SetCellValue(order.OrderDate.ToString());
            }

            //Write the workbook to a memory stream
            MemoryStream output = new MemoryStream();
            workbook.Write(output);

            //Return the result to the end user

            return File(output.ToArray(),   //The binary data of the XLS file
                "application/vnd.ms-excel", //MIME type of Excel files
                "GridExcelExport.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user
        }
    }
}
