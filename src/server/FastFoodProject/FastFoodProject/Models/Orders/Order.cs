using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; }
    }

}
