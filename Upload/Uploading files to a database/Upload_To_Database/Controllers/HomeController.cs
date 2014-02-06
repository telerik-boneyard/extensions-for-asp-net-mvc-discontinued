namespace Upload_To_Database.Controllers
{
    using System.Collections.Generic;
    using System.Data.Linq;
    using System.IO;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Telerik.Web.Mvc;
    using Upload_To_Database.Models;

    public class HomeController : Controller
    {
        /// <summary>
        /// Displays the home page
        /// </summary>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Stores a file to the database
        /// </summary>
        [HttpPost]
        public ActionResult Save(IEnumerable<HttpPostedFileBase> files)
        {
            if (files != null)
            {
                var db = GetDataContext();

                foreach (var uploadedFile in files)
                {
                    var dbFile = new Models.UserFile();
                    // Some browsers send the full file name, we need to strip out the path
                    dbFile.Name = Path.GetFileName(uploadedFile.FileName);
                    dbFile.Data = new Binary(GetFileBytes(uploadedFile));

                    db.UserFiles.InsertOnSubmit(dbFile);
                }

                db.SubmitChanges();
            }

            // Return empty response so signify success
            return Content("");
        }

        /// <summary>
        /// Grid action - Get all files
        /// </summary>
        [GridAction]
        public ActionResult _GetFiles()
        {
            return View(new GridModel<Models.UserFile>
            {
                Data = GetDataContext().UserFiles
            });
        }

        /// <summary>
        /// Grid action - Delete file
        /// </summary>
        [GridAction]
        public ActionResult _DeleteFile(int id)
        {
            var db = GetDataContext();
            var file = db.UserFiles.First(f => f.ID == id);
            db.UserFiles.DeleteOnSubmit(file);
            db.SubmitChanges();

            return View(new GridModel<Models.UserFile>
            {
                Data = db.UserFiles
            });
        }

        /// <summary>
        /// Streams the file with the given ID from the database
        /// </summary>
        public ActionResult Download(int id)
        {
            var db = GetDataContext();
            var file = db.UserFiles.First(f => f.ID == id);
            return File(file.Data.ToArray(), "application/octet-stream", file.Name);
        }

        /// <summary>
        /// Creates the database, if it does not exist and return the data context.
        /// </summary>
        private UserFilesDataContext GetDataContext()
        {
            // Create the database using forward-mapping if it does not already exist
            var db = new UserFilesDataContext(Server.MapPath("~\\App_Data\\UserFiles.mdf"));
            if (!db.DatabaseExists())
            {
                db.CreateDatabase();
            }

            return db;
        }

        /// <summary>
        /// Read all bytes from an uploaded file
        /// </summary>
        private static byte[] GetFileBytes(HttpPostedFileBase file)
        {
            // Read the file in a byte array
            using (var fileStream = file.InputStream)
            {
                return ReadBytes(fileStream);
            }
        }

        /// <summary>
        /// Reads all bytes from a stream
        /// </summary>
        private static byte[] ReadBytes(Stream stream)
        {
            var buffer = new byte[stream.Length];
            using (var ms = new MemoryStream())
            {
                while (true)
                {
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if (read <= 0)
                    {
                        return ms.ToArray();
                    }

                    ms.Write(buffer, 0, read);
                }
            }
        }
    }
}
