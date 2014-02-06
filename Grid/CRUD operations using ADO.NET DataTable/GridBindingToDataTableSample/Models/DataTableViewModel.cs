namespace GridBindingToDataTableSample.Models
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Web;

    public class DataTableViewModel
    {
        public DataTable Data { get; set; }
    }

    public class ProductsRepository
    {
        private static DataTable GetProducts()
        {
            var dataTable = (DataTable)HttpContext.Current.Session["ProductsTable"];
            if (dataTable == null)
                HttpContext.Current.Session["ProductsTable"] = dataTable = new DbGateway().FetchData("SELECT * FROM Products");
            return dataTable;
        }

        public DataTable All()
        {
            return GetProducts();
        }

        public void Add(string productName, int supplierId, int categoryId,
            decimal unitPrice, string quantityPerUnit)
        {
            var products = GetProducts();
            var product = products.NewRow();

            product["ProductID"] = products.AsEnumerable().Max(p => p.Field<int>("ProductID")) + 1;
            product["ProductName"] = productName;
            product["SupplierID"] = supplierId;
            product["CategoryID"] = categoryId;
            product["UnitPrice"] = unitPrice;
            product["QuantityPerUnit"] = quantityPerUnit;
            product["Discontinued"] = false;

            products.Rows.Add(product);
        }

        public void Update(int productId, string productName, int supplierId, int categoryId,
            decimal unitPrice, string quantityPerUnit)
        {
            ExecuteOnProduct(productId, p =>
            {
                p.BeginEdit();
                try
                {
                    p["ProductName"] = productName;
                    p["SupplierID"] = supplierId;
                    p["CategoryID"] = categoryId;
                    p["UnitPrice"] = unitPrice;
                    p["QuantityPerUnit"] = quantityPerUnit;
                    p.EndEdit();
                }
                catch (Exception)
                {
                    p.CancelEdit();
                    throw;
                }
            });
        }

        public void Delete(int productId)
        {
            ExecuteOnProduct(productId, p =>
            {
                p.Delete();
                p.Table.AcceptChanges();
            });
        }

        private void ExecuteOnProduct(int productId, Action<DataRow> executor)
        {
            var productsTable = GetProducts();
            var productToChange = productsTable.AsEnumerable().FirstOrDefault(p => p.Field<int>("ProductID") == productId);
            if (productToChange != null)
            {
                executor(productToChange);
            }
        }
    }
}