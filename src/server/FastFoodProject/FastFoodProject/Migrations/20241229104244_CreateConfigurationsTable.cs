using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FastFoodProject.Migrations
{
    public partial class CreateConfigurationsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Configurations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    ArName = table.Column<string>(nullable: true),
                    EnName = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false),
                    ComponentName = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configurations", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 1,
                column: "OrderDate",
                value: new DateTime(2024, 12, 29, 10, 42, 44, 549, DateTimeKind.Utc).AddTicks(322));

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 2,
                column: "OrderDate",
                value: new DateTime(2024, 12, 29, 10, 42, 44, 549, DateTimeKind.Utc).AddTicks(459));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$r4GBzHs51BaJ1M7Y9ZPAWOJ5lR82wyC9Sz4X8NKMBpuTzrEWhTOk.");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$i9dC17Kuxi10Psi3.JytS.8FQbyS7ZVmf4AEuzXcz1WD2RAD1TOZa");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$goHhX/MxPF.8orTZAm514.42U2496.N1/OaqzcHkOZiJPE9BmcjOi");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$GQP4KqMWOwUR7AmS/ht2gOIeM05j8VtwFqN5vweFyfVJm8NaZElYO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Configurations");

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 1,
                column: "OrderDate",
                value: new DateTime(2024, 12, 29, 10, 40, 12, 313, DateTimeKind.Utc).AddTicks(3901));

            migrationBuilder.UpdateData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: 2,
                column: "OrderDate",
                value: new DateTime(2024, 12, 29, 10, 40, 12, 313, DateTimeKind.Utc).AddTicks(4028));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$KGNnxL88EQn4pBhnOGhakOue5/mq09yZ6YduhTdsZFZ3Z5cDtV4rm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$yn9J1x5qhp7/lhBpt3ZJ5OVy9GOhkXyQ1NZXZd3vGp7tiqkXEPuae");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "Password",
                value: "$2a$11$rODRdr5StCstIeZGJsJ19.K.xLZCZlYW6YFyUl2BEWx1Pv0pNTHt6");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Password",
                value: "$2a$11$Gu0DdbtT7WrducQIt71AmuSs5V050p0CvmnpV604ify1/ucdvweKy");
        }
    }
}