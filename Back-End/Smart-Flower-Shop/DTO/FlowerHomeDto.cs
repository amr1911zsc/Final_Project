namespace Smart_Flower_Shop.DTO
{
    public class ProductsHomeDto
    {
        public int Id { get; set; }
        public string? ImagePath { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal Price { get; set; }

        public int Quantity { get; set; }

    }
}
