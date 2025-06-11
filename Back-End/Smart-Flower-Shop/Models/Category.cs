using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Flower_Shop.Models
{

   
    public class Category
    {

        [Key]
        public int CategoryId { get; set; }
        [MaxLength(50)]
        public string Name { get; set; }

        public ICollection<Products> products { get; set; }



    }
}
