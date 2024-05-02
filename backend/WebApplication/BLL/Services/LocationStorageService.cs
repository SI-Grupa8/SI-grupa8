using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class LocationStorageService: ILocationStorageService
    {
        private readonly IMapper _mapper;
        private readonly ILocationStorageRepository _locationStorageRepository;

        public LocationStorageService(ILocationStorageRepository locationStorageRepository, IMapper mapper)
        {
            _locationStorageRepository = locationStorageRepository;
            _mapper = mapper;
        }

        public async Task<List<LocationStorageDto>> GetLocationsByDeviceId(int deviceId)
        {
            var locations =  await _locationStorageRepository.getLocationsByDeviceId(deviceId);
            return _mapper.Map<List<LocationStorageDto>>(locations);
        }

        public async Task SaveLocation(LocationStorageDto locationStorageDto)
        {
            var location = _mapper.Map<LocationStorage>(locationStorageDto);
            _locationStorageRepository.Add(location);
            await _locationStorageRepository.SaveChangesAsync();
        }

        public async Task DeleteOldRecords(DateTime threshold)
        {
            await _locationStorageRepository.DeleteOldRecords(threshold);
        }
    }
}
