﻿// <auto-generated />
using System;
using FastFoodProject.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FastFoodProject.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241226070951_AddIsDisabledAndCreatedByUserIdToProduct")]
    partial class AddIsDisabledAndCreatedByUserIdToProduct
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("FastFoodProject.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Orders");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            OrderDate = new DateTime(2024, 12, 26, 7, 9, 51, 215, DateTimeKind.Utc).AddTicks(4914),
                            UserId = 2
                        },
                        new
                        {
                            Id = 2,
                            OrderDate = new DateTime(2024, 12, 26, 7, 9, 51, 215, DateTimeKind.Utc).AddTicks(5040),
                            UserId = 2
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.OrderProduct", b =>
                {
                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("OrderId", "ProductId");

                    b.HasIndex("ProductId");

                    b.ToTable("OrderProducts");

                    b.HasData(
                        new
                        {
                            OrderId = 1,
                            ProductId = 1,
                            Quantity = 2
                        },
                        new
                        {
                            OrderId = 1,
                            ProductId = 2,
                            Quantity = 1
                        },
                        new
                        {
                            OrderId = 2,
                            ProductId = 3,
                            Quantity = 1
                        },
                        new
                        {
                            OrderId = 2,
                            ProductId = 1,
                            Quantity = 3
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.Permission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("PermissionName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("PermissionName")
                        .IsUnique();

                    b.ToTable("Permissions");
                });

            modelBuilder.Entity("FastFoodProject.Models.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedByUserId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<bool>("IsDisabled")
                        .HasColumnType("bit");

                    b.Property<decimal>("Price")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("ProductCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("Purchased")
                        .HasColumnType("int");

                    b.Property<double>("StarRating")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.ToTable("Products");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CreatedByUserId = 0,
                            Description = "Delicious cheese pizza with a crispy crust.",
                            ImageUrl = "assets/images/pizza.png",
                            IsDisabled = false,
                            Price = 9.99m,
                            ProductCode = "FD-00000001",
                            ProductName = "Pizza",
                            Purchased = 6,
                            StarRating = 4.5
                        },
                        new
                        {
                            Id = 2,
                            CreatedByUserId = 0,
                            Description = "Juicy beef burger with fresh lettuce and tomato.",
                            ImageUrl = "assets/images/burger.png",
                            IsDisabled = false,
                            Price = 7.99m,
                            ProductCode = "FD-00000002",
                            ProductName = "Burger",
                            Purchased = 8,
                            StarRating = 4.7000000000000002
                        },
                        new
                        {
                            Id = 3,
                            CreatedByUserId = 0,
                            Description = "Creamy Alfredo pasta with grilled chicken.",
                            ImageUrl = "assets/images/pasta.png",
                            IsDisabled = false,
                            Price = 12.99m,
                            ProductCode = "FD-00000003",
                            ProductName = "Pasta",
                            Purchased = 8,
                            StarRating = 4.2999999999999998
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("RoleName")
                        .IsUnique();

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            RoleName = "Admin"
                        },
                        new
                        {
                            Id = 2,
                            RoleName = "Buyer"
                        },
                        new
                        {
                            Id = 3,
                            RoleName = "Seller"
                        },
                        new
                        {
                            Id = 4,
                            RoleName = "DisabledSeller"
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.RolePermission", b =>
                {
                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<int>("PermissionId")
                        .HasColumnType("int");

                    b.HasKey("RoleId", "PermissionId");

                    b.HasIndex("PermissionId");

                    b.ToTable("RolePermissions");
                });

            modelBuilder.Entity("FastFoodProject.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<bool>("IsDisabled")
                        .HasColumnType("bit");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "admin@example.com",
                            IsDisabled = false,
                            Password = "$2a$11$sA1ER5FVVZb8X1h5j0RxyuDZx1PqxbRjgPQJuEuTLPnkyg5WftHZq",
                            UserName = "admin"
                        },
                        new
                        {
                            Id = 2,
                            Email = "buyer@example.com",
                            IsDisabled = false,
                            Password = "$2a$11$MfQRv0g3IvnjwJmtvJYVC..YmbefagJK.J9.Ehe/nP1Yo4rNLeTyG",
                            UserName = "buyer"
                        },
                        new
                        {
                            Id = 3,
                            Email = "seller@example.com",
                            IsDisabled = false,
                            Password = "$2a$11$qTXJlQv6mceQfAEru1DPJesfyllEGv70VBQMCDujCwAD9KW0Qzz9u",
                            UserName = "seller"
                        },
                        new
                        {
                            Id = 4,
                            Email = "disabledSeller@example.com",
                            IsDisabled = false,
                            Password = "$2a$11$zxxPCX.MK/kK.RaSxVBd8eT2DOJ66QyXBlvSbs/QmsLmStrmhcSTe",
                            UserName = "disabledSeller"
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.UserRole", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles");

                    b.HasData(
                        new
                        {
                            UserId = 1,
                            RoleId = 1
                        },
                        new
                        {
                            UserId = 2,
                            RoleId = 2
                        },
                        new
                        {
                            UserId = 3,
                            RoleId = 3
                        },
                        new
                        {
                            UserId = 4,
                            RoleId = 4
                        });
                });

            modelBuilder.Entity("FastFoodProject.Models.OrderProduct", b =>
                {
                    b.HasOne("FastFoodProject.Models.Order", "Order")
                        .WithMany("OrderProducts")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FastFoodProject.Models.Product", "Product")
                        .WithMany("OrderProducts")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Order");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("FastFoodProject.Models.RolePermission", b =>
                {
                    b.HasOne("FastFoodProject.Models.Permission", "Permission")
                        .WithMany()
                        .HasForeignKey("PermissionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FastFoodProject.Models.Role", "Role")
                        .WithMany("RolePermissions")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Permission");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("FastFoodProject.Models.UserRole", b =>
                {
                    b.HasOne("FastFoodProject.Models.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FastFoodProject.Models.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FastFoodProject.Models.Order", b =>
                {
                    b.Navigation("OrderProducts");
                });

            modelBuilder.Entity("FastFoodProject.Models.Product", b =>
                {
                    b.Navigation("OrderProducts");
                });

            modelBuilder.Entity("FastFoodProject.Models.Role", b =>
                {
                    b.Navigation("RolePermissions");
                });

            modelBuilder.Entity("FastFoodProject.Models.User", b =>
                {
                    b.Navigation("UserRoles");
                });
#pragma warning restore 612, 618
        }
    }
}
