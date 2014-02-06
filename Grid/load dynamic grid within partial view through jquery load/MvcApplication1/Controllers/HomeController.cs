using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using Telerik.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Grid()
        {
            ViewData["total"] = DataCache.RowCount;
            return PartialView("_PartialGrid", DataCache.NameTable);
        }

        [GridAction(EnableCustomBinding = true)]
        public ActionResult _CustomBinding(GridCommand command)
        {
            IEnumerable<Dictionary<string, Object>> data = GetData4(command);

            return View(new GridModel
            {
                Data = data,
                Total = DataCache.RowCount
            });
        }

        private static IEnumerable<Dictionary<string, Object>> GetData4(GridCommand command)
        {
            DataTable DT = DataCache.FullTable;

            IEnumerable<DataRow> PT = DT.AsEnumerable().Skip((command.Page - 1) * command.PageSize).Take(command.PageSize);
            DT = PT.CopyToDataTable();

            List<Dictionary<string, Object>> rows = (from DataRow dr1 in DT.Rows
                                                     select DT.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => dr1[col])).ToList();

            return rows.ToList();
        }

        public static class DataCache
        {
            public static DataTable FullTable
            {
                get { return System.Web.HttpContext.Current.Session["FullTable"] == null ? GetTable() : (DataTable)System.Web.HttpContext.Current.Session["FullTable"]; }
                set { System.Web.HttpContext.Current.Session["FullTable"] = value; }
            }
            public static DataTable NameTable
            {
                get { return System.Web.HttpContext.Current.Session["NameTable"] == null ? FullTable.Clone() : (DataTable)System.Web.HttpContext.Current.Session["NameTable"]; }
                set { System.Web.HttpContext.Current.Session["NameTable"] = value; }
            }
            public static int RowCount
            {
                get { return System.Web.HttpContext.Current.Session["RowCount"] == null ? FullTable.Rows.Count : (int)System.Web.HttpContext.Current.Session["RowCount"]; }
                set { System.Web.HttpContext.Current.Session["RowCount"] = value; }
            }

            public static DataTable GetTable()
            {
                //
                // Here we create a DataTable with four columns.
                //
                DataTable table = new DataTable();
                table.Columns.Add("Number", typeof(int));
                table.Columns.Add("Abr", typeof(string));
                table.Columns.Add("Country", typeof(string));
                table.Columns.Add("Date", typeof(DateTime));

                //
                // Here we add DataRows.
                //
                table.Rows.Add(1, "AF", "AFGHANISTAN", DateTime.Now);
                table.Rows.Add(2, "AX", "ÅLAND ISLANDS", DateTime.Now);
                table.Rows.Add(3, "AL", "ALBANIA", DateTime.Now);
                table.Rows.Add(4, "DZ", "ALGERIA", DateTime.Now);
                table.Rows.Add(5, "AS", "AMERICAN SAMOA", DateTime.Now);
                table.Rows.Add(6, "AD", "ANDORRA", DateTime.Now);
                table.Rows.Add(7, "AO", "ANGOLA", DateTime.Now);
                table.Rows.Add(8, "AI", "ANGUILLA", DateTime.Now);
                table.Rows.Add(9, "AQ", "ANTARCTICA", DateTime.Now);
                table.Rows.Add(10, "AG", "ANTIGUA AND BARBUDA", DateTime.Now);
                table.Rows.Add(11, "AR", "ARGENTINA", DateTime.Now);
                table.Rows.Add(12, "AM", "ARMENIA", DateTime.Now);
                table.Rows.Add(13, "AW", "ARUBA", DateTime.Now);
                table.Rows.Add(14, "AU", "AUSTRALIA", DateTime.Now);
                table.Rows.Add(15, "AT", "AUSTRIA", DateTime.Now);
                table.Rows.Add(16, "AZ", "AZERBAIJAN", DateTime.Now);
                table.Rows.Add(17, "BS", "BAHAMAS", DateTime.Now);
                table.Rows.Add(18, "BH", "BAHRAIN", DateTime.Now);
                table.Rows.Add(19, "BD", "BANGLADESH", DateTime.Now);
                table.Rows.Add(20, "BB", "BARBADOS", DateTime.Now);
                table.Rows.Add(21, "BY", "BELARUS", DateTime.Now);
                table.Rows.Add(22, "BE", "BELGIUM", DateTime.Now);
                table.Rows.Add(23, "BZ", "BELIZE", DateTime.Now);
                table.Rows.Add(24, "BJ", "BENIN", DateTime.Now);
                table.Rows.Add(25, "BM", "BERMUDA", DateTime.Now);
                table.Rows.Add(26, "BT", "BHUTAN", DateTime.Now);
                table.Rows.Add(27, "BO", "BOLIVIA, PLURINATIONAL STATE OF", DateTime.Now);
                table.Rows.Add(28, "BQ", "BONAIRE, SAINT EUSTATIUS AND SABA", DateTime.Now);
                table.Rows.Add(29, "BA", "BOSNIA AND HERZEGOVINA", DateTime.Now);
                table.Rows.Add(30, "BW", "BOTSWANA", DateTime.Now);
                table.Rows.Add(31, "BV", "BOUVET ISLAND", DateTime.Now);
                table.Rows.Add(32, "BR", "BRAZIL", DateTime.Now);
                table.Rows.Add(33, "IO", "BRITISH INDIAN OCEAN TERRITORY", DateTime.Now);
                table.Rows.Add(34, "BN", "BRUNEI DARUSSALAM", DateTime.Now);
                table.Rows.Add(35, "BG", "BULGARIA", DateTime.Now);
                table.Rows.Add(36, "BF", "BURKINA FASO", DateTime.Now);
                table.Rows.Add(37, "BI", "BURUNDI", DateTime.Now);
                table.Rows.Add(38, "KH", "CAMBODIA", DateTime.Now);
                table.Rows.Add(39, "CM", "CAMEROON", DateTime.Now);
                table.Rows.Add(40, "CA", "CANADA", DateTime.Now);
                table.Rows.Add(41, "CV", "CAPE VERDE", DateTime.Now);
                table.Rows.Add(42, "KY", "CAYMAN ISLANDS", DateTime.Now);
                table.Rows.Add(43, "CF", "CENTRAL AFRICAN REPUBLIC", DateTime.Now);
                table.Rows.Add(44, "TD", "CHAD", DateTime.Now);
                table.Rows.Add(45, "CL", "CHILE", DateTime.Now);
                table.Rows.Add(46, "CN", "CHINA", DateTime.Now);
                table.Rows.Add(47, "CX", "CHRISTMAS ISLAND", DateTime.Now);
                table.Rows.Add(48, "CC", "COCOS (KEELING) ISLANDS", DateTime.Now);
                table.Rows.Add(49, "CO", "COLOMBIA", DateTime.Now);
                table.Rows.Add(50, "KM", "COMOROS", DateTime.Now);
                table.Rows.Add(51, "CG", "CONGO", DateTime.Now);
                table.Rows.Add(52, "CD", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", DateTime.Now);
                table.Rows.Add(53, "CK", "COOK ISLANDS", DateTime.Now);
                table.Rows.Add(54, "CR", "COSTA RICA", DateTime.Now);
                table.Rows.Add(55, "CI", "CÔTE D'IVOIRE", DateTime.Now);
                table.Rows.Add(56, "HR", "CROATIA", DateTime.Now);
                table.Rows.Add(57, "CU", "CUBA", DateTime.Now);
                table.Rows.Add(58, "CW", "CURAÇAO", DateTime.Now);
                table.Rows.Add(59, "CY", "CYPRUS", DateTime.Now);
                table.Rows.Add(60, "CZ", "CZECH REPUBLIC", DateTime.Now);
                table.Rows.Add(61, "DK", "DENMARK", DateTime.Now);
                table.Rows.Add(62, "DJ", "DJIBOUTI", DateTime.Now);
                table.Rows.Add(63, "DM", "DOMINICA", DateTime.Now);
                table.Rows.Add(64, "DO", "DOMINICAN REPUBLIC", DateTime.Now);
                table.Rows.Add(65, "EC", "ECUADOR", DateTime.Now);
                table.Rows.Add(66, "EG", "EGYPT", DateTime.Now);
                table.Rows.Add(67, "SV", "EL SALVADOR", DateTime.Now);
                table.Rows.Add(68, "GQ", "EQUATORIAL GUINEA", DateTime.Now);
                table.Rows.Add(69, "ER", "ERITREA", DateTime.Now);
                table.Rows.Add(70, "EE", "ESTONIA", DateTime.Now);
                table.Rows.Add(71, "ET", "ETHIOPIA", DateTime.Now);
                table.Rows.Add(72, "FK", "FALKLAND ISLANDS (MALVINAS)", DateTime.Now);
                table.Rows.Add(73, "FO", "FAROE ISLANDS", DateTime.Now);
                table.Rows.Add(74, "FJ", "FIJI", DateTime.Now);
                table.Rows.Add(75, "FI", "FINLAND", DateTime.Now);
                table.Rows.Add(76, "FR", "FRANCE", DateTime.Now);
                table.Rows.Add(77, "GF", "FRENCH GUIANA", DateTime.Now);
                table.Rows.Add(78, "PF", "FRENCH POLYNESIA", DateTime.Now);
                table.Rows.Add(79, "TF", "FRENCH SOUTHERN TERRITORIES", DateTime.Now);
                return table;
            }
        }  
    }
}
