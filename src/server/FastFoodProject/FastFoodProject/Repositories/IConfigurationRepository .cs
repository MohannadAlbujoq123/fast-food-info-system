using FastFoodProject.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public interface IConfigurationRepository
    {
        Task<IEnumerable<Configuration>> GetAllConfigurationsAsync();
        Task<Configuration> GetConfigurationByIdAsync(int id);
        Task AddConfigurationAsync(Configuration configuration);
        Task UpdateConfigurationAsync(Configuration configuration);
        Task DeleteConfigurationAsync(int id);
    }
}