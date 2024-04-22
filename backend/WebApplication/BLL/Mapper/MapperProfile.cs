using System;
using AutoMapper;
using DAL.Utilities;

namespace BLL.Mapper
{
    public class MapperProfile : Profile
	{
		public MapperProfile()
		{
			      CreateMap<DAL.Entities.User, DTOs.UserDto>().ReverseMap();
            CreateMap<DAL.Entities.Role, DTOs.RoleDto>().ReverseMap();
            CreateMap<DAL.Entities.Company, DTOs.CompanyDto>().ReverseMap();
            CreateMap<DAL.Entities.Device, DTOs.DeviceDto>().ReverseMap();
			      CreateMap<DAL.Entities.DeviceType, DTOs.DeviceTypeDto>().ReverseMap();
            CreateMap<DeviceFilter, DTOs.DeviceFilterDto>().ReverseMap();
			      CreateMap<DAL.Entities.LocationStorage, DTOs.LocationStorageDto>().ReverseMap();

        }
    }
}

