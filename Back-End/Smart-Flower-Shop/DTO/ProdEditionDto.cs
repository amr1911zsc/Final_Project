namespace Smart_Flower_Shop.DTO
{
    public class ProdEditionDto //Editing product
    {
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public IFormFile? ImageFile { get; set; }



    }
}
