using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> roleManger;
        public RoleController(RoleManager<IdentityRole> roleManger)
        {
            this.roleManger = roleManger;

        }



        [HttpPost("create-role")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            // التأكد من أن اسم الدور غير فارغ
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty.");
            }

            // التحقق من وجود الدور في قاعدة البيانات
            bool roleExists = await roleManger.RoleExistsAsync(roleName);
            if (roleExists)
            {
                return BadRequest($"The role '{roleName}' already exists.");
            }

            // إنشاء الدور
            IdentityResult result = await roleManger.CreateAsync(new IdentityRole(roleName));

            if (result.Succeeded)
            {
                return Ok($"Role '{roleName}' created successfully.");
            }

            return BadRequest(result.Errors);
        }

        
         /* [HttpDelete("delete-role")]
        public async Task<IActionResult> DeleteRole(string roleName)
        {
            // التأكد من أن اسم الدور غير فارغ
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty.");
            }

            // التحقق من وجود الدور في قاعدة البيانات
            var role = await roleManger.FindByNameAsync(roleName);
            if (role == null)
            {
                return NotFound($"Role '{roleName}' does not exist.");
            }

            // حذف الدور
            IdentityResult result = await roleManger.DeleteAsync(role);

            if (result.Succeeded)
            {
                return Ok($"Role '{roleName}' deleted successfully.");
            }

            return BadRequest(result.Errors);
        }*/





    }
}
