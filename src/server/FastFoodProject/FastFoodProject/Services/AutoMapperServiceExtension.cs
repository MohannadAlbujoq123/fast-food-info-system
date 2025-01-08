using AutoMapper;

namespace FastFoodProject.Services
{
    public static class AutoMapperServiceExtension
    {
        public static void ConfigureAutoMappers(this IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
        }
    }
}
