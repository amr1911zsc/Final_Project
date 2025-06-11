using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Smart_Flower_Shop.Models
{
    [Table("OrderItems")]
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        [ForeignKey("Orders")]
        public int OrderId { get; set; } // تعديل الاسم ليكون أوضح

        [ForeignKey("Products")]
        public int ProductId { get; set; } // تعديل الاسم ليكون أوضح

        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        // الربط الصحيح مع `Orders`
        public Orders Orders { get; set; }

        // الربط الصحيح مع `Products`
        public Products Products { get; set; }
    }



}

