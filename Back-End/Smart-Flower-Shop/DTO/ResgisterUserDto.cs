using System.ComponentModel.DataAnnotations;

namespace Smart_Flower_Shop.DTO
{
    public class ResgisterUserDto
    {

        [Required]
        public string FullName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string password { get; set; }

        [DataType(DataType.Password)]
        [Compare("password")]
        public string confirmPassword { get; set; }
        public string Address { get; set; }
        public string phone { get; set; }
        public string Email { get; set; }
    }
}
