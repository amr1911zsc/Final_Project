namespace Smart_Flower_Shop.DTO
{
    public class ProductsDTO
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }

        //Post
        public IFormFile? ImageFile { get; set; }

        public int CatgyId { get; set; }
    }

    // public Dictionary<string, string> Description { get; set; }


}

