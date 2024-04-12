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
        Task<DeviceDto> GetDeviceByID(int id);

        Task<List<DeviceDto>> GetAllForCompany(int companyId);

        Task<object> AddDevice(DeviceDto request);

        Task UpdateDevice(DeviceDto deviceDto);
      
        Task<List<DeviceDto>> GetDevicesByType(int adminId, List<int>? deviceTypeIDs = null);

        Task RemoveDevice(int deviceId, int companyId);

    }
}
