using System.ComponentModel.DataAnnotations;

namespace Smart_Flower_Shop.DTO
{
    public class LOGINDTO
    {

        [Required]
        public String UserName { get; set; }
        [Required]
        public String Password { get; set; }

    }
}
