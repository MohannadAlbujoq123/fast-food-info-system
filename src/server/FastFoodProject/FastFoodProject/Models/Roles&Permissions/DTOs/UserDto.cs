using System.Collections.Generic;

namespace FastFoodProject.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool IsDisabled { get; set; }
        public List<UserRoleDto> UserRoles { get; set; } = new List<UserRoleDto>();
    }


    public class UserRoleDto
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }
    public class CreateUserRequest
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
    }


    public class UpdateUserRequest
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public bool IsDisabled { get; set; }
        public int? RoleId { get; set; }
    }



}
