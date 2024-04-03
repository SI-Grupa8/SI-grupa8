using BLL.DTOs;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IDeviceService
    {
        Task<Device> GetDeviceByID(int id);
        Task<List<DeviceDto>> GetAllByCompanyUsersIds(List<int> usersIds);
        Task<DeviceDto> AddDevice(DeviceDto deviceDto);
        Task UpdateDevice(Device device);
        Task RemoveDevice(Device device);
    }
}
