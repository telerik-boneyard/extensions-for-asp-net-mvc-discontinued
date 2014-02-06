namespace ImageBrowserDBBinding.Controllers
{
    using System.IO;
    using System.Web;
    using System.Web.Mvc;
    using Models;
    using Telerik.Web.Mvc.UI;

    public class ImageBrowserController : Controller, IImageBrowserController
    {
        private const int ThumbnailHeight = 80;
        private const int ThumbnailWidth = 80;

        #region IImageBrowserController Members

        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult Browse(string path)
        {
            //TODO:Add security checks

            var files = new FilesRepository();
            BrowseResult result;
            if (string.IsNullOrEmpty(path) || path == "/")
            {
                var root = files.GetRootFolder();
                var rootPath = VirtualPathUtility.AppendTrailingSlash(root != null ? root.Name : string.Empty);
                result = new BrowseResult
                             {
                                 Files = files.Images(root),
                                 Directories = files.Folders(root),
                                 Path = rootPath,
                                 ContentPaths = new[] {rootPath}
                             };
            }
            else
            {
                result = new BrowseResult
                             {
                                 Files = files.Images(path),
                                 Directories = files.Folders(path),
                                 Path = VirtualPathUtility.AppendTrailingSlash(path),
                                 ContentPaths = new[] { VirtualPathUtility.AppendTrailingSlash(path) }
                             };
            }
            return Json(result);
        }

        public ActionResult Thumbnail(string path)
        {
            //TODO:Add security checks

            var files = new FilesRepository();
            var image = files.ImageByPath(path);
            if (image != null)
            {
                var desiredSize = new ImageSize {Width = ThumbnailWidth, Height = ThumbnailHeight};

                const string contentType = "image/png";

                var thumbnailCreator = new ThumbnailCreator(new FitImageResizer());

                using (var stream = new MemoryStream(image.Data.ToArray()))
                {
                    return File(thumbnailCreator.Create(stream, desiredSize, contentType), contentType);
                }
            }
            throw new HttpException(404, "File Not Found");
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DeleteFile(string path)
        {
            //TODO:Add security checks

            var files = new FilesRepository();
            var image = files.ImageByPath(path);
            if (image != null)
            {
                files.Delete(image);
                return Content("");
            }
            throw new HttpException(404, "File Not Found");
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DeleteDirectory(string path)
        {
            //TODO:Add security checks

            var files = new FilesRepository();
            var folder = files.GetFolderByPath(path);
            if (folder != null)
            {
                files.Delete(folder);
                return Content("");
            }
            throw new HttpException(404, "File Not Found");
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CreateDirectory(string path, string name)
        {
            //TODO:Add security checks

            var files = new FilesRepository();
            var folder = files.GetFolderByPath(path);
            if (folder != null)
            {
                files.CreateDirectory(folder, name);
                return Content("");
            }
            throw new HttpException(403, "Forbidden");
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Upload(string path, HttpPostedFileBase file)
        {
            //TODO:Add security checks

            if (file != null && !string.IsNullOrEmpty(path))
            {
                var files = new FilesRepository();
                var parentFolder = files.GetFolderByPath(path);
                if (parentFolder != null)
                {
                    files.SaveImage(parentFolder, file);
                    return Json(new FileEntry
                                    {
                                        Name = Path.GetFileName(file.FileName)
                                    }, "text/plain");
                }
            }
            throw new HttpException(404, "File Not Found");
        }

        #endregion

        public ActionResult Image(string path)
        {
            var files = new FilesRepository();
            var image = files.ImageByPath(path);
            if (image != null)
            {
                const string contentType = "image/png";
                return File(image.Data.ToArray(), contentType);
            }
            throw new HttpException(404, "File Not Found");
        }
    }
}