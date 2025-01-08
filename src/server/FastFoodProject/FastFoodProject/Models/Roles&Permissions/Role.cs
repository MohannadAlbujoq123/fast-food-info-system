using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; }

        public ICollection<RolePermission> RolePermissions { get; set; }
    }

}
