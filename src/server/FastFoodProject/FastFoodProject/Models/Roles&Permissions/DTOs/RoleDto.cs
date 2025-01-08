using System.Collections.Generic;

namespace FastFoodProject.Models
{
    public class RoleDto
    {
        public int? Id { get; set; } = 0;
        public string RoleName { get; set; }
        public List<PermissionDto> RolePermissions { get; set; } = new List<PermissionDto>();
    }


    public class CreateRoleRequest
    {
        public string RoleName { get; set; }
        public List<int> RolePermissions { get; set; } = new List<int>();
    }

    public class UpdateRoleRequest
    {
        public string RoleName { get; set; }
        public List<int> RolePermissions { get; set; } = new List<int>();
    }
}
