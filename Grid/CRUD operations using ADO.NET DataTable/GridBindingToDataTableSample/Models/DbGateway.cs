namespace GridBindingToDataTableSample.Models
{
    using System.Configuration;
    using System.Data;
    using System.Data.Common;

    public class DbGateway
    {
        private readonly ConnectionStringSettings connConfiguration;
        private readonly DbProviderFactory providerFactory;

        public DbGateway()
        {
            connConfiguration = ConfigurationManager.ConnectionStrings["Northwind"];
            providerFactory = DbProviderFactories.GetFactory(connConfiguration.ProviderName);
        }

        public DataTable FetchData(string commandText)
        {
            using (var conn = providerFactory.CreateConnection())
            {
                conn.ConnectionString = connConfiguration.ConnectionString;
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = commandText;
                    var result = new DataTable();
                    conn.Open();
                    result.Load(command.ExecuteReader(CommandBehavior.CloseConnection));
                    return result;
                }
            }
        }
    }
}