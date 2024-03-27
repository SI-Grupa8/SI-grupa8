using System;
using System.Text;
using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using Google.Authenticator;

namespace BLL.Services
{
	public class UserService : IUserService
	{
		private readonly IMapper _mapper;
		private readonly IUserRepository _userRepository;

		public UserService(IUserRepository userRepository, IMapper mapper)
		{
			_userRepository = userRepository;
			_mapper = mapper;
		}
        public async Task<UserDto> AddUser(UserRegisterDto userRegisterDto)
		{
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);

            User user = new User
            {
                Email = userRegisterDto.Email,
                PhoneNumber = userRegisterDto.PhoneNumber,
                PasswordHash = Encoding.UTF8.GetBytes(passwordHash),
                PasswordSalt = [],
                RoleID = 0
            };
            _userRepository.Add(user);

            await _userRepository.SaveChangesAsync();

            var userDto =  _mapper.Map<UserDto>(user);
            return  userDto;

        }

        public async Task<List<User>> GetAll()
        {
            return await _userRepository.GetAll();
        }

        public async Task<SetupCode> SetupCode(User user)
        {
            if (string.IsNullOrEmpty(user.TwoFactorKey))
            {
                string secretKey = GenerateSecretKey();
                user.TwoFactorKey = secretKey;
                user.TwoFactorEnabled = true;
                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();
                _mapper.Map<UserDto>(user);
            }

            var authenticator = new TwoFactorAuthenticator();
            var code=authenticator.GenerateSetupCode("WebApplication", user.Name + user.Surname, ConvertToBytes(user.TwoFactorKey, false), 300);
            return code;
        }

        public async Task<string> GenerateQRCodeImageUrl(User user, SetupCode setupCode)
        {
            string manualEntryKey = setupCode.ManualEntryKey;
            string fullName = Uri.EscapeDataString(user.Name + user.Surname);
            string qrCodeContent = $"otpauth://totp/WebApplication:{fullName}?secret={manualEntryKey}&issuer=WebApplicationApp";

            var qrCodeImageUrl = $"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl={qrCodeContent}";

            return qrCodeImageUrl;
        }

        private byte[] ConvertToBytes(string secret, bool secretIsBase32) =>
               secretIsBase32 ? Base32Encoding.ToBytes(secret) : Encoding.UTF8.GetBytes(secret);

        private string GenerateSecretKey(int length = 20)
        {
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var chars = new char[length];

            for (int i = 0; i < length; i++)
            {
                chars[i] = validChars[random.Next(validChars.Length)];
            }

            return new string(chars);
        }

    }
}

