using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FastFoodProject.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDisabledAndCreatedByUserIdToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 1,
                column: "OrderDate",
                value: new DateTime(2024, 12, 26, 7, 9, 51, 215, DateTimeKind.Utc).AddTicks(4914));

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 2,
                column: "OrderDate",
                value: new DateTime(2024, 12, 26, 7, 9, 51, 215, DateTimeKind.Utc).AddTicks(5040));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedByUserId", "IsDisabled" },
                values: new object[] { 0, false });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedByUserId", "IsDisabled" },
                values: new object[] { 0, false });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedByUserId", "IsDisabled" },
                values: new object[] { 0, false });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$sA1ER5FVVZb8X1h5j0RxyuDZx1PqxbRjgPQJuEuTLPnkyg5WftHZq");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$MfQRv0g3IvnjwJmtvJYVC..YmbefagJK.J9.Ehe/nP1Yo4rNLeTyG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$qTXJlQv6mceQfAEru1DPJesfyllEGv70VBQMCDujCwAD9KW0Qzz9u");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$zxxPCX.MK/kK.RaSxVBd8eT2DOJ66QyXBlvSbs/QmsLmStrmhcSTe");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "Products");

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
    }
}
