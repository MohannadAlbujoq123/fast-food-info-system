using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;

namespace FastFoodProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }
        public DbSet<Configuration> Configurations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure unique constraints for UserName and Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure unique constraints for RoleName and PermissionName
            modelBuilder.Entity<Role>()
                .HasIndex(r => r.RoleName)
                .IsUnique();

            modelBuilder.Entity<Permission>()
                .HasIndex(p => p.PermissionName)
                .IsUnique();

            // Configure composite primary key for OrderProduct
            modelBuilder.Entity<OrderProduct>()
                .HasKey(op => new { op.OrderId, op.ProductId });

            modelBuilder.Entity<OrderProduct>()
                .HasOne(op => op.Order)
                .WithMany(o => o.OrderProducts)
                .HasForeignKey(op => op.OrderId);

            modelBuilder.Entity<OrderProduct>()
                .HasOne(op => op.Product)
                .WithMany(p => p.OrderProducts)
                .HasForeignKey(op => op.ProductId);

            // Configure composite primary key for RolePermission
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            // Configure composite primary key for UserRole
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            // Configure precision for Product Price
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            // Seed data
            modelBuilder.Entity<Product>().HasData(
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

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, RoleName = "Admin" },
                new Role { Id = 2, RoleName = "Buyer" },
                new Role { Id = 3, RoleName = "Seller" },
                new Role { Id = 4, RoleName = "DisabledSeller" }
            );

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, UserName = "admin", Email = "admin@example.com", Password = BCrypt.Net.BCrypt.HashPassword("admin123") },
                new User { Id = 2, UserName = "buyer", Email = "buyer@example.com", Password = BCrypt.Net.BCrypt.HashPassword("buyer123") },
                new User { Id = 3, UserName = "seller", Email = "seller@example.com", Password = BCrypt.Net.BCrypt.HashPassword("seller123") },
                new User { Id = 4, UserName = "disabledSeller", Email = "disabledSeller@example.com", Password = BCrypt.Net.BCrypt.HashPassword("disabledSeller123") }
            );

            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { UserId = 1, RoleId = 1 },
                new UserRole { UserId = 2, RoleId = 2 },
                new UserRole { UserId = 3, RoleId = 3 },
                new UserRole { UserId = 4, RoleId = 4 }
            );

            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    UserId = 2,
                    OrderDate = DateTime.UtcNow
                },
                new Order
                {
                    Id = 2,
                    UserId = 2,
                    OrderDate = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<OrderProduct>().HasData(
                new OrderProduct { OrderId = 1, ProductId = 1, Quantity = 2 },
                new OrderProduct { OrderId = 1, ProductId = 2, Quantity = 1 },
                new OrderProduct { OrderId = 2, ProductId = 3, Quantity = 1 },
                new OrderProduct { OrderId = 2, ProductId = 1, Quantity = 3 }
            );
        }
    }
}