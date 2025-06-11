using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Flower_Shop.DTO;
using Smart_Flower_Shop.Models;
using System.Text.Json;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        public ProductsController(ApplicationDbcontext db)
        {
            _context = db;
        }

        private readonly ApplicationDbcontext _context;



        [HttpGet("GetHomeFlowers")]
        public IActionResult GetFlowers(int pageNumber = 1, int pageSize = 5)
        {
            var totalCount = _context.Products.Count();

            var flowers = _context.Products
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new ProductsHomeDto
                {
                    Id = f.ProductId,
                    ImagePath = f.ImagePath,
                    Name = f.Name,
                    Type = f.Type,
                    Price = f.Price,
                    Quantity = f.Quantity
                })
                .ToList();

            var response = new
            {
              
                Items = flowers
            };

            return Ok(response);
        }


        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _context.Products
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDetailsDTO
                {
                    ImagePath= p.ImagePath,
                    Name = p.Name,
                    Type = p.Type,
                    Price = p.Price,
                   Quantity = p.Quantity,
               
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }


         






        [HttpPost("AddNewProduct")]
        public async Task<IActionResult> CreateProductWithImage([FromForm] ProductsDTO productDto)
        {
            if (productDto == null)
                return BadRequest("Invalid product data.");

            var category = _context.Categories.FirstOrDefault(c => c.CategoryId == productDto.CatgyId);
            if (category == null)
                return BadRequest("Category ID not found.");

            // 1. حفظ الصورة
            string imageName = null;
            if (productDto.ImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                imageName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, imageName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.ImageFile.CopyToAsync(stream);
                }
            }

            // 2. إنشاء المنتج
            var product = new Products
            {
                Name = productDto.Name,
                Quantity = productDto.Quantity,
                Price = productDto.Price,
                Type = productDto.Type,
                Description = productDto.Description,
                CatgyId = productDto.CatgyId,
                ImagePath = "Images/" + imageName

            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok("Product created successfully.");
        }


      /*  [HttpPut("UpdateImage/{id}")]
        public async Task<IActionResult> UpdateProductImage(int id, [FromForm] ImageDTO image)
        {
           
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("Product not found.");

            // ✅ التعامل مع الصورة
            if (image.ImageFile != null)
            {
                // 1. تحديد مسار الحفظ
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.ImageFile.FileName);
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // 2. حفظ الصورة
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.ImageFile.CopyToAsync(stream);
                }

                // 3. حذف الصورة القديمة (لو عايزة)
                if (!string.IsNullOrEmpty(product.ImagePath))
                {
                    var oldImagePath = Path.Combine("wwwroot", product.ImagePath);
                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                // 4. تحديث الـ ImagePath
                product.ImagePath = "Images/" + fileName;
            }

            // حفظ التعديلات
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product updated successfully." });

        }*/



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductAsync(int id, [FromForm] ProdEditionDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // تحديث البيانات الأخرى
            // تحديث الكمية بإضافة القيمة الجديدة
            // تحديث الكمية لو موجودة
            if (productDto.Quantity.HasValue)
            {
                product.Quantity += productDto.Quantity.Value;
            }

            // تحديث السعر لو موجود
            if (productDto.Price.HasValue)
            {
                product.Price = productDto.Price.Value;
            }


            // ✅ التعامل مع الصورة
            if (productDto.ImageFile != null)
            {
                // 1. تحديد مسار الحفظ
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImageFile.FileName);
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // 2. حفظ الصورة
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.ImageFile.CopyToAsync(stream);
                }

                // 3. حذف الصورة القديمة (لو عايزة)
                if (!string.IsNullOrEmpty(product.ImagePath))
                {
                    var oldImagePath = Path.Combine("wwwroot", product.ImagePath);
                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                // 4. تحديث الـ ImagePath
                product.ImagePath = "Images/" + fileName;
            }

            // حفظ التعديلات
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product updated successfully." });

        }



        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return NoContent();  // HTTP 204
        }


         [HttpGet("SearchByName")] //search bar 
         public async Task<IActionResult> SearchProducts(string keyword)
         {
             var result = await _context.Products
                 .Where(f => f.Name.Contains(keyword))
                 .Select(f => new
                 {
                     f.ProductId,
                    f.ImagePath,
                     f.Name,
                     f.Type,
                     f.Price,
                     f.Quantity,
                  

                 })
                 .ToListAsync();

             return Ok(result);
         }




        [HttpGet("CareProductsByType")]
        public async Task<IActionResult> CareProducts(string keyword)
        {
            var result = await _context.Products
                .Where(f => f.Type.Contains(keyword))
                .Select(f => new CareProductDto
                {
                   
                    ImagePath= f.ImagePath,
                    Name = f.Name,
                    Description = f.Description
                })
                .ToListAsync();

            return Ok(result);
        }




        /*  [HttpGet("SearchByKey")]
          public async Task<IActionResult> SearchProducts(string key, string value)
          {
              var products = await _context.Products.ToListAsync();

              var result = products
                  .Where(p =>
                  {
                      try // حولناه من استرنج عادى لاوبجكت ديكشنرى علشان نقدر نتحكم بشكل اكبر فى سيرش ب كى مش مجرد جمله ممكن تماتش فى اكتر من مكان
                      {
                          var json = JsonSerializer.Deserialize<Dictionary<string, string>>(p.Description);
                          return json != null && json.ContainsKey(key) && json[key].Contains(value, StringComparison.OrdinalIgnoreCase);
                      }
                      catch
                      {
                          return false;
                      }
                  })
                  .Select(f => new { f.Name, f.Price })
                  .ToList();

              return Ok(result);
          }*/



        /* [HttpGet("SearchType")]
         public async Task<IActionResult> SearchFlowers(string keyword)
         {
             var result = await _context.Products
                 .Where(f => f.Type.Contains(keyword))  // البحث في نوع الوردة بدلاً من الوصف
                 .Select(f => new
                 {
                     f.ProductId,
                     f.Name,
                     f.Price,
                     f.Quantity // إضافة نوع الوردة في النتيجة
                 })
                 .ToListAsync();

             return Ok(result);
         }*/











        /* [HttpPost("UploadImage")]
         public async Task<IActionResult> UploadTest([FromForm] ProdImageDto d)
         {
             var fileName = Guid.NewGuid().ToString() + Path.GetExtension(d.ImagePath.FileName);
             var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

             // حفظ الصورة في المجلد
             using var stream = new FileStream(filePath, FileMode.Create);
             await d.ImagePath.CopyToAsync(stream);

             // حفظ اسم الصورة فقط في قاعدة البيانات
             var item = new Products
             {
                 Name = d.Name,
                 ImagePath = fileName
             };

             await _context.Products.AddAsync(item);
             await _context.SaveChangesAsync();

             return Ok("Done");
         }*/



        /*  [HttpGet("filter")]
          public async Task<IActionResult> FilterFlowers(string Type = null, decimal? minPrice = null, decimal? maxPrice = null)
          {
              var query = _context.Products.AsQueryable();

              // فلترة بناءً على نوع الوردة إذا تم تمرير القيمة
              if (!string.IsNullOrEmpty(Type))
              {
                  query = query.Where(f => f.Type.Contains(Type));
              }

              // فلترة بناءً على السعر الأدنى إذا تم تمرير القيمة
              if (minPrice.HasValue)
              {
                  query = query.Where(f => f.Price >= minPrice.Value);
              }

              // فلترة بناءً على السعر الأعلى إذا تم تمرير القيمة
              if (maxPrice.HasValue)
              {
                  query = query.Where(f => f.Price <= maxPrice.Value);
              }

              var result = await query
                  .Select(f => new
                  {
                      f.ProductId,
                      f.Name,
                      f.Price,
                      f.Type
                  })
                  .ToListAsync();

              return Ok(result);
          }*/







    }
}


/*  [HttpGet("search")] // بيطلع الايرور 
        public async Task<IActionResult> SearchFlowers(string key, string value)
        {
            var result = await _context.Products
                .FromSqlInterpolated($"SELECT * FROM Products WHERE JSON_VALUE(Description, '$.{key}') LIKE '%{value}%'")
                .Select(f => new
                {

                    f.Name,
                    f.Price
                })
                .ToListAsync();

            return Ok(result);
        }*/



/*
[HttpGet("filter")]
public IActionResult FilterProducts(string type, decimal? minPrice, decimal? maxPrice)
{
  var products = _context.Products.AsQueryable();

  if (!string.IsNullOrEmpty(type))
  {
      products = products.Where(p => p.Type == type);
  }

  if (minPrice.HasValue)
  {
      products = products.Where(p => p.Price >= minPrice.Value);
  }

  if (maxPrice.HasValue)
  {
      products = products.Where(p => p.Price <= maxPrice.Value);
  }

  return Ok(products.ToList());
}*/

/* [HttpGet("GetProductsBySeason")] //دينامك 
 public IActionResult GetProductsBySeason(string season)
 {
     var products = _context.Products
         .FromSqlRaw("SELECT Name, Price FROM Products WHERE JSON_VALUE(Description, '$.season') = {0}", season)
         .Select(p => new ProductsDTO
         {
             Name = p.Name,
             Price = p.Price
         })
         .ToList();

     return Ok(products);
 }*/


         /* [HttpGet("GetAllProducts")] //مش مهمة اوى جنب وجود الباجميشن 
          public IActionResult GetAllProducts()
          {
              var products = _context.Products
                  .Select(p => new
                  {
                      p.Name,
                      p.Description
                  })
                  .ToList();

              return Ok(products);
          }*/



       /* [HttpGet("NewArrivals")]
        public async Task<IActionResult> GetNewArrivals()
        {
            var newProducts = await _context.Products
                .OrderByDescending(p => p.ProductId) // الأكبر هو الأحدث
                .Take(5)
                .ToListAsync();

            return Ok(newProducts);
        }*/
