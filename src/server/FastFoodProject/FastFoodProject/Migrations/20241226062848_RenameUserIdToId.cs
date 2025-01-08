using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FastFoodProject.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserIdToId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "Roles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Products",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PermissionId",
                table: "Permissions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "Orders",
                newName: "Id");

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 1,
                column: "OrderDate",
                value: new DateTime(2024, 12, 26, 6, 28, 48, 461, DateTimeKind.Utc).AddTicks(2556));

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 2,
                column: "OrderDate",
                value: new DateTime(2024, 12, 26, 6, 28, 48, 461, DateTimeKind.Utc).AddTicks(2687));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$IW89xoQN0hk6Pu6gUIrb.udJqRusX.0WeZr7miGq9XU/Mozb0DG6e");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$uSxlh0fugUo2A.FkxAchOetFq678P8DBMkfalh.FMwRVIrXjOvuoi");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$Jm3B6GlPrCGv.rrvvej6ceGgDj6U3AJ.D20wyfYmmhRCsD9HV8XuW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$b2kZob5TnL.0Wwy.3nwY0e5W9I6kKZD9CtSwyqa45CHnpTkho.u1G");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Roles",
                newName: "RoleId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Products",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Permissions",
                newName: "PermissionId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Orders",
                newName: "OrderId");

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "OrderId",
                keyValue: 1,
                column: "OrderDate",
                value: new DateTime(2024, 12, 24, 8, 23, 1, 814, DateTimeKind.Utc).AddTicks(2645));

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "OrderId",
                keyValue: 2,
                column: "OrderDate",
                value: new DateTime(2024, 12, 24, 8, 23, 1, 814, DateTimeKind.Utc).AddTicks(2783));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$DxD5Zx2DYVs9tW0XEOdqsuHfb4UbLDS4EPkDJoTDK2sSrfU/4UUJK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$ikDlHDkjnMKxJtHDrMuyUOCeABtPTfeiUPdjhrwHuaUsXy.khcJ0e");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$xlxnyLm.wtIbiOFNe.iTgeh3Y4P0/fALDfEI6SFdSWocoTPH8R9L2");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$3.wNPNnTReLY6oGsBXkj4OR38lwg6uIrbGdyFftS7m9jjFjmRFL8a");
        }
    }
}
