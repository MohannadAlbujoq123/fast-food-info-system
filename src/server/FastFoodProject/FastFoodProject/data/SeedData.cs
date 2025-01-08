using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // Apply migrations
                await context.Database.MigrateAsync();

                // Seed permissions
                if (!context.Permissions.Any())
                {
                    foreach (Permissions permission in Enum.GetValues(typeof(Permissions)))
                    {
                        context.Permissions.Add(new Permission { PermissionName = permission.ToString() });
                    }
                    await context.SaveChangesAsync();
                }

                // Seed roles
                if (!context.Roles.Any())
                {
                    foreach (Roles role in Enum.GetValues(typeof(Roles)))
                    {
                        context.Roles.Add(new Role { RoleName = role.ToString() });
                    }
                    await context.SaveChangesAsync();

                    // Assign permissions to roles
                    var permissions = context.Permissions.ToList();
                    var buyerRole = context.Roles.First(r => r.RoleName == Roles.Buyer.ToString());
                    var sellerRole = context.Roles.First(r => r.RoleName == Roles.Seller.ToString());
                    var adminRole = context.Roles.First(r => r.RoleName == Roles.Admin.ToString());
                    var disabledSellerRole = context.Roles.First(r => r.RoleName == Roles.DisabledSeller.ToString());

                    AssignPermissionsToRole(context, buyerRole, PermissionGroups.BuyerPermissions);
                    AssignPermissionsToRole(context, sellerRole, PermissionGroups.SellerPermissions);
                    AssignPermissionsToRole(context, adminRole, PermissionGroups.AdminPermissions);
                    await context.SaveChangesAsync();
                }

                // Seed users
                if (!context.Users.Any())
                {
                    var adminRole = context.Roles.First(r => r.RoleName == Roles.Admin.ToString());
                    var buyerRole = context.Roles.First(r => r.RoleName == Roles.Buyer.ToString());
                    var sellerRole = context.Roles.First(r => r.RoleName == Roles.Seller.ToString());
                    var disabledSellerRole = context.Roles.First(r => r.RoleName == Roles.DisabledSeller.ToString());

                    var adminUser = new User { UserName = "admin", Email = "admin@example.com", Password = BCrypt.Net.BCrypt.HashPassword("admin123"), UserRoles = new List<UserRole> { new UserRole { RoleId = adminRole.Id } } };
                    var buyerUser = new User { UserName = "buyer", Email = "buyer@example.com", Password = BCrypt.Net.BCrypt.HashPassword("buyer123"), UserRoles = new List<UserRole> { new UserRole { RoleId = buyerRole.Id } } };
                    var sellerUser = new User { UserName = "seller", Email = "seller@example.com", Password = BCrypt.Net.BCrypt.HashPassword("seller123"), UserRoles = new List<UserRole> { new UserRole { RoleId = sellerRole.Id } } };
                    var disabledSellerUser = new User { UserName = "disabledSeller", Email = "disabledSeller@example.com", Password = BCrypt.Net.BCrypt.HashPassword("disabledSeller123"), UserRoles = new List<UserRole> { new UserRole { RoleId = disabledSellerRole.Id } } };

                    context.Users.AddRange(adminUser, buyerUser, sellerUser, disabledSellerUser);
                    await context.SaveChangesAsync();
                }

                // Seed products
                if (!context.Products.Any())
                {
                    context.Products.AddRange(
                        new Product
                        {
                            Id = 1,
                            ProductName = "Pizza",
                            ProductCode = "FD-00000001",
                            Description = "Delicious cheese pizza with a crispy crust.",
                            Price = 9.99m,
                            StarRating = 4.5,
                            ImageUrl = "assets/images/pizza.png",
                            Purchased = 6
                        },
                        new Product
                        {
                            Id = 2,
                            ProductName = "Burger",
                            ProductCode = "FD-00000002",
                            Description = "Juicy beef burger with fresh lettuce and tomato.",
                            Price = 7.99m,
                            StarRating = 4.7,
                            ImageUrl = "assets/images/burger.png",
                            Purchased = 8
                        },
                        new Product
                        {
                            Id = 3,
                            ProductName = "Pasta",
                            ProductCode = "FD-00000003",
                            Description = "Creamy Alfredo pasta with grilled chicken.",
                            Price = 12.99m,
                            StarRating = 4.3,
                            ImageUrl = "assets/images/pasta.png",
                            Purchased = 8
                        }
                    );
                    await context.SaveChangesAsync();
                }

            }
        }

        private static void AssignPermissionsToRole(ApplicationDbContext context, Role role, List<Permissions> permissions)
        {
            foreach (var permission in permissions)
            {
                var permissionEntity = context.Permissions.First(p => p.PermissionName == permission.ToString());
                context.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = permissionEntity.Id });
            }
        }
    }
}
