using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services
{
    public class DeviceLocationService : IDeviceLocationService
	{
		private readonly IMapper _mapper;
		private readonly IConfiguration _configuration;
        private readonly IDeviceRepository _deviceRepository;
        private readonly ILocationStorageRepository _locationStorageRepository;

		public DeviceLocationService(IConfiguration configuration, IMapper mapper, IDeviceRepository deviceRepository, ILocationStorageRepository locationStorageRepository)
		{
			_configuration = configuration;
			_mapper = mapper;
            _deviceRepository = deviceRepository;
            _locationStorageRepository = locationStorageRepository;
		}

        public string CreateDeviceToken(string macAddressName)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, macAddressName)
            };
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:DeviceToken").Value!));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: signinCredentials
            );
            var deviceToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return deviceToken;
        }

        public async Task SaveCurrentLocation(string lat, string lgi, string macAddress)
        {
            
            var allowedMacString = _configuration.GetSection("AppSettings:MacWhitelist").Value!;
            var allowedMacList = allowedMacString.Split(';', StringSplitOptions.RemoveEmptyEntries)
            .Select(host => host.Trim())
            .ToList();

            if (!allowedMacList.Contains(macAddress))
            {
                throw new UnauthorizedAccessException("Unauthorized: Device's MAC address not whitelisted.");
            }

            var locCode = _configuration.GetSection("AppSettings:LocationCode").Value;

            if (IsValidLatitude(lat, locCode) && IsValidLongitude(lgi, locCode))
            {
                string decodedLat = DecodeLocation(lat, locCode);
                string decodedLng = DecodeLocation(lgi, locCode);

                // Save the location data in DB

                var device = await _deviceRepository.GetByMacAddress(macAddress);
                
                device.XCoordinate = decodedLng;
                device.YCoordinate = decodedLat;

                await _deviceRepository.SaveChangesAsync();

                var locationStorageDto = new LocationStorageDto
                {
                    DeviceID = device.DeviceID, 
                    XCoordinate = decodedLng,
                    YCoordinate = decodedLat, // these should actually be swapped but it will be changed later
                    Timestamp = DateTime.UtcNow 
                };

                var location = _mapper.Map<LocationStorage>(locationStorageDto);
                _locationStorageRepository.Add(location);
                await _locationStorageRepository.SaveChangesAsync();
            }
            else
            {
                throw new UnauthorizedAccessException("Unauthorized: Incorrect longitude and latitude values.");
            }
        }

        public List<LocationStorageDto> GetDeviceLocationsFilter(List<int> deviceIds, DateTime startTime, DateTime endTime)
        {

            var locations = _locationStorageRepository.GetFilteredLocation(deviceIds, startTime, endTime);

            return _mapper.Map<List<LocationStorageDto>>(locations);
        }

        private static bool IsValidLatitude(string location, string locationCode)
        {
            return Regex.IsMatch(location, @"^-?\d{2}\.\d{3}" + locationCode + @"\w{3}$");
        }

        private static bool IsValidLongitude(string location, string locationCode)
        {
            return Regex.IsMatch(location, @"^-?\d{2,3}\.\d{3}" + locationCode + @"\w{3}$");
        }

        private static string DecodeLocation(string location, string locationCode)
        {
            string beforeCode = location.Split(locationCode)[0];
            string afterCode = location.Split(locationCode)[1];
            string decodedLocation = beforeCode + afterCode;
            return decodedLocation;
        }
    }
}

