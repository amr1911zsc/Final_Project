using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Flower_Shop.Migrations
{
    public partial class editOrderProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProduct_Products_productsProductId",
                table: "OrderProduct");

            migrationBuilder.DropIndex(
                name: "IX_OrderProduct_productsProductId",
                table: "OrderProduct");

            migrationBuilder.DropColumn(
                name: "productsProductId",
                table: "OrderProduct");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProduct_Prod_ID",
                table: "OrderProduct",
                column: "Prod_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Products_Prod_ID",
                table: "OrderProduct",
                column: "Prod_ID",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProduct_Products_Prod_ID",
                table: "OrderProduct");

            migrationBuilder.DropIndex(
                name: "IX_OrderProduct_Prod_ID",
                table: "OrderProduct");

            migrationBuilder.AddColumn<int>(
                name: "productsProductId",
                table: "OrderProduct",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrderProduct_productsProductId",
                table: "OrderProduct",
                column: "productsProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Products_productsProductId",
                table: "OrderProduct",
                column: "productsProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
