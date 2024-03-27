using BLL.DTOs;
using DAL.Entities;
using Google.Authenticator;
using System;
namespace BLL.Interfaces
{
	public interface IUserService
	{
        Task<UserDto> AddUser(UserRegisterDto userRegisterDto);
        Task<List<User>> GetAll();
        Task<SetupCode> SetupCode(User user);
        Task<string> GenerateQRCodeImageUrl(User user, SetupCode setupCode);
    }
}

