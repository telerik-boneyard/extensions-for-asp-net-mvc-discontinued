using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChartMVCExport.Models
{
    public class SalesData
    {
        public string RepName { get; set; }

        public string DateString { get; set; }

        public decimal? TotalSales { get; set; }

        public decimal? RepSales { get; set; }
    }
}