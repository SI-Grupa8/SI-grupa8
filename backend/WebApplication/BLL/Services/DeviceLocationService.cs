using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

            //algoritam
            //TODO
        }
    }
}

