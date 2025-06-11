using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Flower_Shop.DTO;
using Smart_Flower_Shop.Models;

namespace Smart_Flower_Shop.Controllers
{


    [Route("api/[controller]")] // api/Categories
    [ApiController]
    public class CategoryController : ControllerBase
    {

        public CategoryController(ApplicationDbcontext db)
        {
            _context = db;
        }

        private readonly ApplicationDbcontext _context;

        [HttpGet("GetAllCategories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDTO
                {
                    Id = c.CategoryId,
                    Name = c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }




        [HttpPost("AddCategory")]
        public async Task<IActionResult> CreateCategory(CategoryDTO category)
        {
            if (category == null)
            {
                return BadRequest("Invalid category data.");
            }

            // تحويل DTO إلى كائن Category الفعلي قبل الإضافة إلى قاعدة البيانات
            var newCategory = new Category
            {
                Name = category.Name
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            // تحويل الكاتجوري المضاف إلى DTO قبل الإرجاع
            var categoryDto = new CategoryDTO
            {
                Id = newCategory.CategoryId, // استخدم الـ ID بعد الحفظ
                Name = newCategory.Name
            };

            return Ok(categoryDto);
        }


        [HttpPut("UpdateCategory/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryDTO categoryDto)
        {
            if (categoryDto == null || id != categoryDto.Id)
            {
                return BadRequest("Invalid category data.");
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            // تحديث البيانات
            category.Name = categoryDto.Name;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            // إرجاع البيانات المحدثة كـ DTO
            return Ok(new CategoryDTO
            {
                Id = category.CategoryId,
                Name = category.Name
            });
        }

        [HttpDelete("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok($"Category with ID {id} has been deleted.");
        }




    }
}
