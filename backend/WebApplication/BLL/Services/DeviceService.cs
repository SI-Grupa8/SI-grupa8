﻿using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;

namespace BLL.Services
{
    public class DeviceService: IDeviceService
    {
        private readonly IMapper _mapper;
        private readonly IDeviceRepository _deviceRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;
        private readonly IDeviceLocationService _deviceLocationService;

        public DeviceService(IDeviceRepository deviceRepository, IMapper mapper, ICompanyRepository companyRepository, IDeviceLocationService deviceLocationService, IUserRepository userRepository)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
            _companyRepository = companyRepository;
            _deviceLocationService = deviceLocationService;
            _userRepository = userRepository;
        }

        public async Task<Device> GetDeviceByID(int id)
        {
            var device = await _deviceRepository.GetById(id);

            return device!;
        }

        public async Task<List<DeviceDto>> GetAllForCompany(int adminId)
        {
            var user = await _userRepository.GetById((int)adminId);

            var company = await _companyRepository.GetAllUsersForCompany((int)user!.CompanyID!);

            company.Users.ForEach(x =>
            {
                x.Company = null;
            });

            var users = company.Users.Select(x => x!.UserID).ToList();

            var devices = await _deviceRepository.GetAllByCompanyUsersIds(users);
            
            return _mapper.Map<List<DeviceDto>>(devices);
        }

        public async Task<object> AddDevice(DeviceDto request)
        {
            var deviceToken = _deviceLocationService.CreateDeviceToken(request.Reference);

            var device = _mapper.Map<Device>(request);
            _deviceRepository.Add(device);
            await _deviceRepository.SaveChangesAsync();
            // added to return correct id, instead of just returning request
            // because request always has id 0
            var returnedDevice = await _deviceRepository.GetByMacAddress(request.Reference);
            return new {
                deviceToken,
                response = returnedDevice
            };
        }

        public async Task RemoveDevice(int deviceId, int adminId)
        {
            var device = await _deviceRepository.GetWithUser(deviceId);

            var admin = await _userRepository.GetById(adminId);

            if(admin!.CompanyID != device!.User!.CompanyID)
            {
                throw new Exception("You do not have permissions to remove this device.");
            }

            _deviceRepository.Remove(device);
            await _deviceRepository.SaveChangesAsync();
        }

        public async Task UpdateDevice(DeviceDto deviceDto, int adminId)
        {
            var device = await _deviceRepository.GetWithUser(deviceDto.DeviceID);

            var admin = await _userRepository.GetById(adminId);

            if (admin!.CompanyID != device!.User!.CompanyID)
            {
                throw new Exception("You do not have permissions to update this device.");
            }

            var updatedDevice = _mapper.Map<Device>(deviceDto);

            device = updatedDevice;
            await _deviceRepository.SaveChangesAsync();
        }
    }
}
