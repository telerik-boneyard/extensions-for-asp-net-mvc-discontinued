namespace ImageBrowserDBBinding.Models
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    using Telerik.Web.Mvc.UI;

    public class FilesRepository
    {
        private FilesDataContext dataContext;

        protected FilesDataContext Db
        {
            get { return dataContext ?? (dataContext = new FilesDataContext()); }
        }

        public IEnumerable<FileEntry> Images(string path)
        {
            return Images(GetFolderByPath(path));
        }

        public void SaveImage(Folder parent, HttpPostedFileBase file)
        {
            var buffer = new byte[file.InputStream.Length];
            file.InputStream.Read(buffer, 0, (int) file.InputStream.Length);
            var image = new Image
                            {
                                Name = Path.GetFileName(file.FileName),
                                Folder = parent,
                                Data = buffer
                            };
            Db.Images.InsertOnSubmit(image);
            Db.SubmitChanges();
        }

        public Folder GetFolderByPath(string path)
        {
            if (string.IsNullOrEmpty(path) || path == "/")
            {
                return GetRootFolder();
            }

            var name = GetFolderNames(path).Last().ToLower();

            path = NormalizePath(path, name);
            return Db.Folders.FirstOrDefault(f => f.Path.ToLower() == path && f.Name.ToLower() == name);
        }

        private string NormalizePath(string path, string name)
        {
            path = VirtualPathUtility.AppendTrailingSlash(path).Replace("\\", "/").ToLower();
            path = path.Remove(path.LastIndexOf(name));
            if (path.StartsWith("/"))
            {
                path = path.Remove(0, 1);
            }
            return path;
        }

        public IEnumerable<FileEntry> Images(Folder parent)
        {
            return parent == null ? new FileEntry[0] : parent.Images.Select(f => new FileEntry {Name = f.Name});
        }

        public Folder GetRootFolder()
        {
            return Db.Folders.SingleOrDefault(f => f.Parent == null);
        }

        public IEnumerable<DirectoryEntry> Folders(Folder parent)
        {
            return parent == null ? new DirectoryEntry[] {} : parent.ChildFolders.Select(f => new DirectoryEntry {Name = f.Name});
        }

        public IEnumerable<DirectoryEntry> Folders(string path)
        {
            return Folders(GetFolderByPath(path));
        }

        private IEnumerable<string> GetFolderNames(string path)
        {
            return path.Split(new[] {Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar},
                              StringSplitOptions.RemoveEmptyEntries);
        }

        public Image ImageByPath(string path)
        {
            var fileName = Path.GetFileName(path);
            var folder = GetFolderByPath(Path.GetDirectoryName(path));

            return Db.Images.SingleOrDefault(img => img.Name == fileName && img.FolderId == folder.Id);
        }

        public void CreateDirectory(Folder parent, string name)
        {
            var path = VirtualPathUtility.AppendTrailingSlash(Path.Combine(parent.Path, parent.Name));

            Db.Folders.InsertOnSubmit(new Folder {Name = name, ParentId = parent.Id, Path = path});
            Db.SubmitChanges();
        }

        public void Delete(Image image)
        {
            Db.Images.DeleteOnSubmit(image);
            Db.SubmitChanges();
        }

        public void Delete(Folder folder)
        {
            Db.Folders.DeleteOnSubmit(folder);
            Db.SubmitChanges();
        }
    }
}