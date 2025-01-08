using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderProductDto> OrderProducts { get; set; }
    }
    public class PaginatedOrdersDto
    {
        public int TotalPages { get; set; }
        public List<OrderDto> Orders { get; set; }
    }



}
