using System.Collections.Generic;

namespace GridDropDownTreeView.Models
{
    public class Plant
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public IList<ProductionLine> ProductionLines
        {
            get;
            private set;

        }

        public Plant()
        {
            ProductionLines = new List<ProductionLine>();
        }
    }

}