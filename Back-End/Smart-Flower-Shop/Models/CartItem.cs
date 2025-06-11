using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Smart_Flower_Shop.Models
{
    public class CartItem
    {

        [Key]
        public int Id { get; set; }  // Primary Key
       
        [ForeignKey("Cart")]
        public int CartId { get; set; }  // Foreign Key يربطه بالكارت

        [ForeignKey("Product")]
        public int ProductId { get; set; }  // Foreign Key يربطه بالمنتج
        public decimal Price { get; set; }  // السعر الإجمالي للمنتج في الكارت
        public int Quantity { get; set; }  // كمية المنتج في الكارت


        // Navigation Properties
        [JsonIgnore]
        public Cart Cart { get; set; }
        public Products Product { get; set; }
    }
}
