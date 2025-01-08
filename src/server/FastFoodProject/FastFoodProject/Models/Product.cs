using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ProductName { get; set; }

        [Required]
        [RegularExpression(@"^[A-Z]{2}-\d{8}$", ErrorMessage = "ProductCode must be in the format AA-00000000")]
        public string ProductCode { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, 5)]
        public double StarRating { get; set; }

        [Required]
        [StringLength(200)]
        public string ImageUrl { get; set; }

        public int Purchased { get; set; }

        public bool IsDisabled { get; set; } = false;

        [Required]
        public int CreatedByUserId { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; }
    }
}
