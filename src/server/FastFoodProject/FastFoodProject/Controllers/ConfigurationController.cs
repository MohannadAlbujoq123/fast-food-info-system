using AutoMapper;
using FastFoodProject.DTOs;
using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/configurations")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfigurationRepository _configurationRepository;
        private readonly IMapper _mapper;

        public ConfigurationController(IConfigurationRepository configurationRepository, IMapper mapper)
        {
            _configurationRepository = configurationRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConfigurationDto>>> GetConfigurations()
        {
            var configurations = await _configurationRepository.GetAllConfigurationsAsync();
            var configurationDtos = _mapper.Map<IEnumerable<ConfigurationDto>>(configurations);
            return Ok(configurationDtos);
        }

        [HttpPost]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ConfigurationDto>> CreateConfiguration([FromBody] CreateConfigurationDto createConfigurationDto)
        {
            var configuration = _mapper.Map<Configuration>(createConfigurationDto);
            await _configurationRepository.AddConfigurationAsync(configuration);

            var configurationDto = _mapper.Map<ConfigurationDto>(configuration);
            return CreatedAtAction(nameof(GetConfigurations), new { id = configuration.Id }, configurationDto);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateConfiguration(int id, [FromBody] UpdateConfigurationDto updateConfigurationDto)
        {
            var configuration = await _configurationRepository.GetConfigurationByIdAsync(id);
            if (configuration == null)
            {
                return NotFound();
            }

            _mapper.Map(updateConfigurationDto, configuration);
            await _configurationRepository.UpdateConfigurationAsync(configuration);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConfiguration(int id)
        {
            var configuration = await _configurationRepository.GetConfigurationByIdAsync(id);
            if (configuration == null)
            {
                return NotFound();
            }

            await _configurationRepository.DeleteConfigurationAsync(id);
            return NoContent();
        }
    }
}