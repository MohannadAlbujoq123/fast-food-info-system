using AutoMapper;
using FastFoodProject.DTOs;
using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public ProductsController(IProductRepository productRepository, IUserRepository userRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            int? userId = null;
            if (int.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            var products = await _productRepository.GetAllProductsAsync();
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

            // Filter out disabled products or products created by disabled users that are not created by the current user
            if (userId.HasValue)
            {
                productDtos = productDtos.Where(p => (!p.IsDisabled && !IsUserDisabled(p.CreatedByUserId)) || p.CreatedByUserId == userId.Value);
            }
            else
            {
                productDtos = productDtos.Where(p => !p.IsDisabled && !IsUserDisabled(p.CreatedByUserId));
            }

            // Convert image to base64 string and include it in the response
            foreach (var productDto in productDtos)
            {
                if (!string.IsNullOrEmpty(productDto.ImageUrl))
                {
                    var filePath = Path.Combine("wwwroot", productDto.ImageUrl);
                    if (System.IO.File.Exists(filePath))
                    {
                        var imageBytes = System.IO.File.ReadAllBytes(filePath);
                        productDto.ImageBase64 = Convert.ToBase64String(imageBytes);
                    }
                }
            }

            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var userIdClaim = User.FindFirst("UserId")?.Value;
            int? userId = null;
            if (int.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            // Check if the product is disabled or the user is disabled and if the current user is not the creator
            if ((product.IsDisabled || IsUserDisabled(product.CreatedByUserId)) && product.CreatedByUserId != userId)
            {
                return Forbid();
            }

            var productDto = _mapper.Map<ProductDto>(product);

            // Convert image to base64 string and include it in the response
            if (!string.IsNullOrEmpty(productDto.ImageUrl))
            {
                var filePath = Path.Combine("wwwroot", productDto.ImageUrl);
                if (System.IO.File.Exists(filePath))
                {
                    var imageBytes = System.IO.File.ReadAllBytes(filePath);
                    productDto.ImageBase64 = Convert.ToBase64String(imageBytes);
                }
            }

            return Ok(productDto);
        }

        [HttpPost]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] CreateProductDto createProductDto, IFormFile image)
        {
            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            var product = _mapper.Map<Product>(createProductDto);
            product.CreatedByUserId = userId;

            if (image != null)
            {
                var imagePath = SaveImage(image, product.ProductName);
                product.ImageUrl = imagePath;
            }

            try
            {
                await _productRepository.AddProductAsync(product);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            var createdProductDto = _mapper.Map<ProductDto>(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, createdProductDto);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto updateProductDto, IFormFile? image)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (product.CreatedByUserId != userId)
            {
                return Forbid();
            }

            _mapper.Map(updateProductDto, product);

            if (image != null && image.Length > 0)
            {
                // Delete the old image if it exists
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    DeleteImage(product.ImageUrl);
                }

                var imagePath = SaveImage(image, product.ProductName);
                product.ImageUrl = imagePath;
            }

            try
            {
                await _productRepository.UpdateProductAsync(product);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (product.CreatedByUserId != userId)
            {
                return Forbid();
            }

            // Delete the image if it exists
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                DeleteImage(product.ImageUrl);
            }

            await _productRepository.DeleteProductAsync(id);
            return NoContent();
        }

        [HttpPut("{id}/disable")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> ToggleProductDisabled(int id)
        {
            if (!int.TryParse(User.FindFirst("UserId")?.Value, out var userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (product.CreatedByUserId != userId && userRole == "Seller")
            {
                return Forbid();
            }

            await _productRepository.ToggleProductDisabledAsync(id);
            return NoContent();
        }


        [HttpGet("images/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = Path.Combine("wwwroot", "assets", "images", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var image = System.IO.File.OpenRead(filePath);
            return File(image, "image/jpeg");
        }

        private string SaveImage(IFormFile image, string productName)
        {
            var fileName = $"{productName}_{DateTime.UtcNow.Ticks}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine("wwwroot", "assets", "images", fileName);

            if (!Directory.Exists(Path.Combine("wwwroot", "assets", "images")))
            {
                Directory.CreateDirectory(Path.Combine("wwwroot", "assets", "images"));
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                image.CopyTo(stream);
            }

            return $"assets/images/{fileName}";
        }

        private void DeleteImage(string imageUrl)
        {
            var filePath = Path.Combine("wwwroot", imageUrl);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        private bool IsUserDisabled(int userId)
        {
            var user = _userRepository.GetUserByIdAsync(userId).Result;
            return user?.IsDisabled ?? false;
        }
    }
}


