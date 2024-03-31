using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using Google.Authenticator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Services
{
	public class UserService : IUserService
	{
		private readonly IMapper _mapper;
		private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

		public UserService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
		{
			_userRepository = userRepository;
			_mapper = mapper;
            _configuration = configuration;
		}

        public async Task<object> EnableTwoFactorAuthentication(int userID)
        {
            var user = await _userRepository.GetById(userID);

            if (user == null) throw new Exception("User not found");

            var setup = await SetupCode(user);
            var QRCodeImageUrl = GenerateQRCodeImageUrl(user, setup);
            return new
            {
                setup.ManualEntryKey,
                QRCodeImageUrl
            };
        }

        public async Task<(CookieOptions cookiesOption, string refreshToken, object data)> UserLogIn(UserLogIn userRequest)
        {
            var user = new User();
            if (!string.IsNullOrEmpty(userRequest.Email))
            {
                user = await _userRepository.FindByEmail(userRequest.Email);
            }
            else if (!string.IsNullOrEmpty(userRequest.PhoneNumber))
            {
                user = await _userRepository.FindByPhoneNumber(userRequest.PhoneNumber);
            }

            if (!BCrypt.Net.BCrypt.Verify(userRequest.Password, Encoding.UTF8.GetString(user.PasswordHash)))
            {
                throw new Exception("Wrong password.");
            }

            string token = CreateToken(user);
            var refreshToken = GenerateRefreshToken();
            var cookieOptions = SetRefreshToken(refreshToken, user);
            RefreshTokenDto refresh = new RefreshTokenDto()
            {
                Token = refreshToken.Token,
                Created = refreshToken.Created,
                Expires = refreshToken.Expires,
            };
            await RefreshUserToken(user.UserID, refresh);

            return (cookieOptions, refreshToken.Token,
                new 
            {
                token = token,
                twoFaEnabled = user.TwoFactorEnabled,
                email = user.Email,
                refresh = refresh.Token,
                expires = refresh.Expires.ToString()
            });

        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _userRepository.FindByEmail(email);
            return user ;
        }

        public async Task<User> GetByToken(string token)
        {
            return await _userRepository.GetByToken(token);
        }

        public async Task<User> GetUserByPhoneNumber(string phoneNumber)
        {
            var user = await _userRepository.FindByPhoneNumber(phoneNumber);
            return user;
        }

        public async Task<UserDto> AddUser(UserRegisterDto userRegisterDto)
		{
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);

            User user = new User
            {
                Name = userRegisterDto.Name,
                Surname = userRegisterDto.Surname,
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

        public async Task<User> UpdateUser(User user)
        {
            
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
            return user;
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

        public string GenerateQRCodeImageUrl(User user, SetupCode setupCode)
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

        public async Task RefreshUserToken(int userID, RefreshTokenDto refreshTokenDto)
        {
            var existingUser = await _userRepository.GetById(userID);

            if (existingUser != null)
            {
                // Update the properties of the existing user with the new token information
                existingUser.RefreshToken = refreshTokenDto.Token;
                existingUser.TokenCreated = refreshTokenDto.Created.ToUniversalTime();
                existingUser.TokenExpires = refreshTokenDto.Expires.ToUniversalTime(); // Adjust expiration as needed

                // Save changes to the database
                await _userRepository.SaveChangesAsync();

                var userDto = _mapper.Map<UserDto>(existingUser);
                // Return or use the updated userDto as needed
            }
            else
            {
                // Handle the case where the user with the specified ID does not exist
                // This could be logging an error, throwing an exception, or any other appropriate action
            }
            /*var oldUser = await _userRepository.GetById(userID);
            User user = new User
            {
                Email = oldUser.Email,
                PhoneNumber = oldUser.PhoneNumber,
                PasswordHash = oldUser.PasswordHash,
                PasswordSalt = oldUser.PasswordSalt,
                RoleID = oldUser.RoleID,
                RefreshToken = refreshTokenDto.RefreshToken,
                TokenCreated = refreshTokenDto.TokenCreated.ToUniversalTime(),
                //TokenExpires = refreshTokenDto.TokenExpires.ToUniversalTime()
                TokenExpires = DateTime.Now.AddSeconds(20).ToUniversalTime()
            };
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
            var userDto = _mapper.Map<UserDto>(user);*/
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email.ToString()),
                new Claim(ClaimTypes.Role, user.Role.RoleName.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private RefreshTokenDto GenerateRefreshToken()
        {
            var refreshToken = new RefreshTokenDto
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                //Expires = DateTime.Now.AddMinutes(30),
                Expires = DateTime.Now.AddMinutes(30),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private CookieOptions SetRefreshToken(RefreshTokenDto newRefreshToken, User user)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };

            //Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;

            return cookieOptions;
        }

        public async Task<UserDto> GetUser(int userID)
        {
            var user = await _userRepository.GetById(userID);

            return _mapper.Map<UserDto>(user);
        }
    }
}

