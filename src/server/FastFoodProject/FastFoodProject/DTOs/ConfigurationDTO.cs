namespace FastFoodProject.DTOs
{
    public class ConfigurationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ArName { get; set; }
        public string EnName { get; set; }
        public int Order { get; set; }
        public string ComponentName { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateConfigurationDto
    {
        public string Name { get; set; }
        public string ArName { get; set; }
        public string EnName { get; set; }
        public int Order { get; set; }
        public string ComponentName { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateConfigurationDto
    {
        public string Name { get; set; }
        public string ArName { get; set; }
        public string EnName { get; set; }
        public int Order { get; set; }
        public string ComponentName { get; set; }
        public bool IsActive { get; set; }
    }
}