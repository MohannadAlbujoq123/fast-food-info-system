using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class OrderProductDto
    {
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
