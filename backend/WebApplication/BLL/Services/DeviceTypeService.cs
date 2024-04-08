using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class DeviceTypeService : IDeviceTypeService
    {
        private readonly IMapper _mapper;
        private readonly IDeviceTypeRepository _deviceTypeRepository;

        public DeviceTypeService(IDeviceTypeRepository deviceTypeRepository, IMapper mapper)
        {
            _deviceTypeRepository = deviceTypeRepository;
            _mapper = mapper;
        }

        public async Task<List<DeviceTypeDto>> GetAll()
        {
            var deviceTypes = await _deviceTypeRepository.GetAll();
            return _mapper.Map<List<DeviceTypeDto>>(deviceTypes);
        }

        public async Task<DeviceTypeDto> GetDeviceTypeByID(int id)
        {
            var role = await _deviceTypeRepository.GetById(id);

            return _mapper.Map<DeviceTypeDto>(role);
        }
    }
}
