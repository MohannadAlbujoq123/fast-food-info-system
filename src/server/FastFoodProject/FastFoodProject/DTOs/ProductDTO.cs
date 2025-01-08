namespace FastFoodProject.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string? Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double StarRating { get; set; } = 0;
        public string? ImageUrl { get; set; } = string.Empty;
        public int Purchased { get; set; } = 0;
        public string? ImageBase64 { get; set; }
        public bool IsDisabled { get; set; }
        public int CreatedByUserId { get; internal set; }
    }

    public class CreateProductDto
    {
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string? Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class UpdateProductDto
    {
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string? Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}

