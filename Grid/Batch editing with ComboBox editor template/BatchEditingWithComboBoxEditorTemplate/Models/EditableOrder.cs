using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BatchEditingWithComboBoxEditorTemplate.Models
{
    public class EditableOrder
    {
        public int OrderID { get; set; }
        [UIHint("Employee"), Required]
        public EditableEmployee Employee { get; set; }
        [DataType(DataType.Date), Required]
        public DateTime OrderDate { get; set; }
        [DataType(DataType.Currency), Required]
        public decimal Freight { get; set; }
    }
}