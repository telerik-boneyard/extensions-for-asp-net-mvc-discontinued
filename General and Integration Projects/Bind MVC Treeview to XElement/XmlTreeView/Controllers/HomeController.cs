using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace XmlTreeView.Controllers {
	public class HomeController : Controller {
		public ActionResult Index() {
			ViewBag.Message = "Welcome to ASP.NET MVC!";

			return View(XElement.Parse(@"
<article>
	<header></header>
	<body>
	<section1></section1>
	<section2></section2>
	<section3></section3>
	</body>
	<footer></footer>
</article>"));
		}

		public ActionResult About() {
			return View();
		}
	}
}
