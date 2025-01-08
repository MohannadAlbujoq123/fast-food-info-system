using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string PermissionName { get; set; }
    }


}
