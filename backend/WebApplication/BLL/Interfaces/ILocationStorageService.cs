using BLL.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ILocationStorageService
    {
        Task<List<LocationStorageDto>> GetLocationsByDeviceId(int deviceId);
        Task SaveLocation(LocationStorageDto locationStorageDto);
    }
}
