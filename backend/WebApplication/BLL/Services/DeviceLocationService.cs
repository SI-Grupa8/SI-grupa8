using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using BLL.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services
{
    public class DeviceLocationService : IDeviceLocationService
	{
		private readonly IMapper _mapper;
		private readonly IConfiguration _configuration;

		public DeviceLocationService(IConfiguration configuration, IMapper mapper)
		{
			_configuration = configuration;
			_mapper = mapper;
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
            //mac address whitelist
            //TODO

            var locCode = _configuration.GetSection("AppSettings:LocationCode").Value;

            if (IsValidLatitude(lat, locCode) && IsValidLongitude(lgi, locCode))
            {
                string decodedLat = DecodeLocation(lat, locCode);
                string decodedLng = DecodeLocation(lgi, locCode);

                // Save the location data in DB
                // when connected with branch where DB for device is implemented
            }
            else
            {
                // error: location not valid, acess denied
                // maybe return a string and write BadRequest("Invalid latitude or longitude. Access denied.");
                // in DeviceLocationController or: 
                // throw new InvalidOperationException();
                // and use try catch in DeviceLocationController 
            }
        }

        private static bool IsValidLatitude(string location, string locationCode)
        {
            return Regex.IsMatch(location, @"^-?\d{2}\.\d{3}{locationCode}\w{3}$");
        }

        private static bool IsValidLongitude(string location, string locationCode)
        {
            return Regex.IsMatch(location, @"^-?\d{2,3}\.\d{3}{locationCode}\w{3}$");
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

