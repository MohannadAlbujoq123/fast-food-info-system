using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string UserName { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        public bool IsDisabled { get; set; } = false;

        public ICollection<UserRole> UserRoles { get; set; }
    }

}

