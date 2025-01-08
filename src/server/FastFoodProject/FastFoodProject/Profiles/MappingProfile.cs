using AutoMapper;
using FastFoodProject.DTOs;
using FastFoodProject.Models;

namespace FastFoodProject
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<Configuration, ConfigurationDto>().ReverseMap();
            CreateMap<Configuration, CreateConfigurationDto>().ReverseMap();
            CreateMap<Configuration, UpdateConfigurationDto>().ReverseMap();

        }
    }
}

