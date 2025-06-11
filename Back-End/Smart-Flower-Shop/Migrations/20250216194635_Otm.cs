using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Flower_Shop.Migrations
{
    public partial class Otm : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CatgyId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CatgyId",
                table: "Products",
                column: "CatgyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CatgyId",
                table: "Products",
                column: "CatgyId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CatgyId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_CatgyId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CatgyId",
                table: "Products");
        }
    }
}
