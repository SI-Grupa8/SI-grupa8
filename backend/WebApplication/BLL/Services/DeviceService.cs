using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class DeviceService: IDeviceService
    {
        private readonly IMapper _mapper;
        private readonly IDeviceRepository _deviceRepository;

        public DeviceService(IDeviceRepository deviceRepository, IMapper mapper)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
        }

        public async Task<DeviceDto> GetDeviceByID(int id)
        {
            var device = await _deviceRepository.GetById(id);

            return _mapper.Map<DeviceDto>(device);
        }

        public async Task<List<DeviceDto>> GetAllByCompanyId(int companyID)
        {
            var devices = await _deviceRepository.GetAllByCompanyId(companyID);
            return _mapper.Map<List<DeviceDto>>(devices);
        }

        public async Task<DeviceDto> AddDevice(DeviceDto request)
        {
            var device = _mapper.Map<Device>(request);
            _deviceRepository.Add(device);
            _deviceRepository.SaveChangesAsync();
            return request;
        }

        public async void RemoveDevice(DeviceDto request)
        {
            var device = _mapper.Map<Device>(request);
            _deviceRepository.Remove(device);
            await _deviceRepository.SaveChangesAsync();
        }

        public async void UpdateDevice(DeviceDto request)
        {
            var device = _mapper.Map<Device>(request);
            _deviceRepository.Update(device);
            await _deviceRepository.SaveChangesAsync();
        }
    }
}
