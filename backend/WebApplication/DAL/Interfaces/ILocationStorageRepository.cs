﻿using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface ILocationStorageRepository : IRepository<LocationStorage>
    {
        Task<List<LocationStorage>> getLocationsByDeviceId(int deviceId);
        Task DeleteOldRecords(DateTime threshold);
    }
}
