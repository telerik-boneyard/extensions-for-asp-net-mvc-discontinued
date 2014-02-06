using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using TelerikMvcGridNHibernate.Models;

namespace TelerikMvcGridNHibernate
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_BeginRequest()
        {
            NorthwindSession = sessonFactory.OpenSession();
        }

        protected void Applicaton_EndRequest()
        {
            NorthwindSession.Dispose();
        }

        public static ISession NorthwindSession
        {
            get
            {
                return (ISession)HttpContext.Current.Items["NorthwindSession"];
            }
            set
            {
                HttpContext.Current.Items["NorthwindSession"] = value;
            }
        }

        private static ISessionFactory sessonFactory;

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterRoutes(RouteTable.Routes);

            sessonFactory = Fluently.Configure()
                .Database(MsSqlConfiguration.MsSql2008.ConnectionString(connection => connection.FromConnectionStringWithKey("Northwind")))
                .Mappings(mappings => mappings.FluentMappings.AddFromAssemblyOf<Order>())
                .BuildSessionFactory();
        }
    }
}