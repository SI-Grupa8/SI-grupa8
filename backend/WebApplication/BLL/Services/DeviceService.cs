using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

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

        public async Task<DeviceDto> GetDeviceByID(int id)
        {
            var device = await _deviceRepository.GetById(id);

            return _mapper.Map<DeviceDto>(device); 
        }

        public async Task<List<DeviceDto>> GetAllForCompany(int companyId)
        {
            var company = await _companyRepository.GetAllUsersForCompany(companyId);

            company!.Users.ForEach(x =>
            {
                x!.Company = null;
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

        public async Task RemoveDevice(int deviceId, int companyId)
        {
            var device = await _deviceRepository.GetWithUser(deviceId);

            if(companyId != device!.User!.CompanyID)
            {
                throw new Exception("You do not have permissions to remove this device.");
            }

            _deviceRepository.Remove(device);
            await _deviceRepository.SaveChangesAsync();
        }

        public async Task UpdateDevice(DeviceDto deviceDto, int companyId)
        {
            var device = await _deviceRepository.GetWithUser(deviceDto.DeviceID);

            if (companyId != device!.User!.CompanyID)
            {
                throw new Exception("You do not have permissions to update this device.");
            }

            var updatedDevice = _mapper.Map<Device>(deviceDto);

            device = updatedDevice;
            await _deviceRepository.SaveChangesAsync();
        }

        public async Task<List<DeviceDto>> GetDevicesByType(int adminId, List<int>? deviceTypeIDs = null)
        {
            var user = await _userRepository.GetById(adminId);
            var companyUsers = await _companyRepository.GetAllUsersForCompany((int)user!.CompanyID!);

            companyUsers.Users.ForEach(x => x!.Company = null);

            var users = companyUsers.Users.Select(x => x!.UserID).ToList();

            var devices = await _deviceRepository.GetFilteredDevicesByUserIds(users, deviceTypeIDs);

            return _mapper.Map<List<DeviceDto>>(devices);
        }
    }
}
