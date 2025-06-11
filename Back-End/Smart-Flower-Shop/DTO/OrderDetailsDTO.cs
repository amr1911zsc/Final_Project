namespace Smart_Flower_Shop.DTO
{
    public class OrderDetailsDTO
    {
        public int OrdersId { get; set; }
        public decimal TotalPrice { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime DateOfOrder { get; set; }
        public string OrderStatus { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string UserId { get; set; }
    }
}
