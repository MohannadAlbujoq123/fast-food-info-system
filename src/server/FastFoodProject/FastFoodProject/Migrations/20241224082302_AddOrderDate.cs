using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FastFoodProject.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "OrderDate",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "Orders");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$oHw8WSaEmZE2GI1zU14uR.KOaPe0p1e614xZl3h5JEcIL4ob/aWYC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$MoUQfNOtIlUhnYl3idsQGOi5miomNyUhKc7NECBOzRDV2VEky4VPW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$ktcetdUBCw/Xk52YDk9dUuCEw0/wXGUUiwdKqE2jltuVJGWvLDCiy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$fBCZlJspsYp2yD7eSexweu.BIWGmOEGfaHAubOrqHpi5Ngu4naVFW");
        }
    }
}
