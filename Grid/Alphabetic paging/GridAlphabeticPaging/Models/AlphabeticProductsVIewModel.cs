namespace GridAlphabeticPaging.Models
{
    using System.Collections.Generic;

    public class AlphabeticProductsViewModel
    {
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<string> Letters { get; set; }
        public string SelectedLetter { get; set; }
    }
}