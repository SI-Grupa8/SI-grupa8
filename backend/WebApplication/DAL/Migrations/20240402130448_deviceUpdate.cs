using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class deviceUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_Companies_CompanyID",
                table: "Devices");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Companies_CompanyID",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "CompanyID",
                table: "Devices",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_CompanyID",
                table: "Devices",
                newName: "IX_Devices_UserID");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_Users_UserID",
                table: "Devices",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Companies_CompanyID",
                table: "Users",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "CompanyID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_Users_UserID",
                table: "Devices");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Companies_CompanyID",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Devices",
                newName: "CompanyID");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_UserID",
                table: "Devices",
                newName: "IX_Devices_CompanyID");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_Companies_CompanyID",
                table: "Devices",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "CompanyID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Companies_CompanyID",
                table: "Users",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "CompanyID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
