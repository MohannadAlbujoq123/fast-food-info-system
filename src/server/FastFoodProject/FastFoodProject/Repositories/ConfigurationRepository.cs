using FastFoodProject.Data;
using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly ApplicationDbContext _context;

        public ConfigurationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Configuration>> GetAllConfigurationsAsync()
        {
            return await _context.Configurations.ToListAsync();
        }

        public async Task<Configuration> GetConfigurationByIdAsync(int id)
        {
            return await _context.Configurations.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddConfigurationAsync(Configuration configuration)
        {
            await _context.Configurations.AddAsync(configuration);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConfigurationAsync(Configuration configuration)
        {
            _context.Configurations.Update(configuration);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConfigurationAsync(int id)
        {
            var configuration = await _context.Configurations.FirstOrDefaultAsync(c => c.Id == id);
            if (configuration != null)
            {
                _context.Configurations.Remove(configuration);
                await _context.SaveChangesAsync();
            }
        }
    }
}