using FastFoodProject.Data;
using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await (from product in _context.Products
                          select product).ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await (from product in _context.Products
                          where product.Id == id
                          select product).FirstOrDefaultAsync();
        }

        public async Task AddProductAsync(Product product)
        {
            ValidateProduct(product);
            if (await IsProductNameUniqueAsync(product.ProductName) && await IsProductCodeUniqueAsync(product.ProductCode))
            {
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("Product name or product code already exists.");
            }
        }

        public async Task UpdateProductAsync(Product product)
        {
            ValidateProduct(product);
            if (await IsProductNameUniqueAsync(product.ProductName, product.Id) && await IsProductCodeUniqueAsync(product.ProductCode, product.Id))
            {
                _context.Products.Update(product);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("Product name or product code already exists.");
            }
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await (from p in _context.Products
                                 where p.Id == id
                                 select p).FirstOrDefaultAsync();
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ToggleProductDisabledAsync(int productId)
        {
            var product = await (from p in _context.Products
                                 where p.Id == productId
                                 select p).FirstOrDefaultAsync();
            if (product != null)
            {
                product.IsDisabled = !product.IsDisabled;
                await _context.SaveChangesAsync();
            }
        }

        private void ValidateProduct(Product product)
        {
            if (string.IsNullOrEmpty(product.ProductName))
            {
                throw new ArgumentException("Product name is required.");
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(product.ProductCode, @"^[A-Z]{2}-\d{8}$"))
            {
                throw new ArgumentException("ProductCode must be in the format AA-00000000.");
            }

            if (product.Price < 0)
            {
                throw new ArgumentException("Price cannot be negative.");
            }

            if (product.StarRating < 0 || product.StarRating > 5)
            {
                throw new ArgumentException("StarRating must be between 0 and 5.");
            }
        }

        private async Task<bool> IsProductNameUniqueAsync(string productName, int? productId = null)
        {
            return !await (from product in _context.Products
                           where product.ProductName == productName && (!productId.HasValue || product.Id != productId.Value)
                           select product).AnyAsync();
        }

        private async Task<bool> IsProductCodeUniqueAsync(string productCode, int? productId = null)
        {
            return !await (from product in _context.Products
                           where product.ProductCode == productCode && (!productId.HasValue || product.Id != productId.Value)
                           select product).AnyAsync();
        }
    }
}
