using System.Collections.Generic;

namespace FastFoodProject.Models
{
    public static class PermissionGroups
    {
        public static readonly List<Permissions> BuyerPermissions = new List<Permissions>
        {
            Permissions.ManageCart
        };

        public static readonly List<Permissions> SellerPermissions = new List<Permissions>
        {
            Permissions.AddProducts,
            Permissions.EditProducts,
            Permissions.DeleteProducts
        };

        public static readonly List<Permissions> AdminPermissions = new List<Permissions>(SellerPermissions)
        {
            Permissions.ManageUsers,
            Permissions.DisableBuyer,
            Permissions.DisableSeller
        };
    }
}


