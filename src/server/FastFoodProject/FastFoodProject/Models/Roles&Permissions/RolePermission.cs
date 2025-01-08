using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace FastFoodProject.Models
{
    public class RolePermission
    {
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role Role { get; set; }

        public int PermissionId { get; set; }
        [ForeignKey("PermissionId")]
        public Permission Permission { get; set; }
    }

}
