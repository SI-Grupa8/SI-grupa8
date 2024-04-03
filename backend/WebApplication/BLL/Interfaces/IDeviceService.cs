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

        Task<List<DeviceDto>> GetAllForCompany(int adminId);

        Task<object> AddDevice(DeviceDto request);

        Task UpdateDevice(DeviceDto deviceDto, int adminId);

        Task RemoveDevice(int deviceId, int adminId);
    }
}
