using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.IO;
using System.Diagnostics;
using ChartMVCExport.Models;

namespace ChartMVCExport.Controllers
{
    public class HomeController : Controller
    {
        // Download Inkscape from http://inkscape.org/
        private const string INKSCAPE_PATH = @"C:\Program Files (x86)\Inkscape\inkscape.exe";
        private const int WIDTH = 800;
        private const int HEIGHT = 600;

        //Defines the export format MIME types
        private readonly Dictionary<ExportFormat, string> MimeTypes = new Dictionary<ExportFormat, string>
        {
            { ExportFormat.PNG, "image/png" },
            { ExportFormat.PDF, "application/pdf" }
        };

        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View(SalesDataStore.GetData());
        }

        
        [HttpPost]
        public ActionResult _Export(string svg, ExportFormat format)
        {
            //Decode HTML-encoded SVG document
            var svgText = HttpUtility.UrlDecode(svg);
            var svgFile = TempFileName() + ".svg";
            System.IO.File.WriteAllText(svgFile, svgText);

            var outFile = DoExport(svgFile, format);
            var attachment = "export" + Path.GetExtension(outFile);

            return File(outFile, MimeTypes[format], attachment);
        }

        private string DoExport(string svgFile, ExportFormat format)
        {    
            //Determine extension from the export format 
            var extension = format == ExportFormat.PNG ? "png" : "pdf";
            var outFile = TempFileName() + "." + extension;

            // Full list of export options is available at
            // http://tavmjong.free.fr/INKSCAPE/MANUAL/html/CommandLine-Export.html
            var inkscape = new Process();
            inkscape.StartInfo.FileName = INKSCAPE_PATH;
            inkscape.StartInfo.Arguments =
                String.Format("--file \"{0}\" --export-{1} \"{2}\" --export-width {3} --export-height {4}",
                              svgFile, extension, outFile, WIDTH, HEIGHT);
            inkscape.StartInfo.UseShellExecute = true;
            inkscape.Start();

            inkscape.WaitForExit();

            return outFile;
        }

        private string TempFileName()
        {
            return Path.Combine(Server.MapPath("~/App_Data"), System.IO.Path.GetRandomFileName());
        }
    }
}
