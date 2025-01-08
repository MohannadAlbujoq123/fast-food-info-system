using System.ComponentModel.DataAnnotations;

namespace FastFoodProject.Models
{
    public class Configuration
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string ArName { get; set; }
        public string EnName { get; set; }
        public int Order { get; set; }
        public string ComponentName { get; set; }
        public bool IsActive { get; set; }
    }
}