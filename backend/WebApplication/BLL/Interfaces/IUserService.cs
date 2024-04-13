using BLL.DTOs;
using DAL.Entities;
using Google.Authenticator;
using Microsoft.AspNetCore.Http;
using System;
namespace BLL.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> AddUser(UserRegisterDto userRegisterDto, int adminId);
        Task<List<UserDto>> GetAll();
        Task<SetupCode> SetupCode(User user);
        Task<User> GetUserByPhoneNumber(string phoneNumber);
        Task<User> GetUserByEmail(string email);
        Task RefreshUserToken(int userID, RefreshTokenDto refreshTokenDto);
        Task<User> GetByToken(string token);
        Task<UserDto> UpdateUser(UserDto userDto);

        Task<UserDto> AddUserRegister(UserRegisterDto userRegister);
        Task<List<UserDto>> GetAdminsWihotuCompany();

        Task RemoveUser(int userId);
        Task<List<UserDto>> GetAllAdmins();
        Task<List<UserDto>> GetAllByRole(string role);
        Task<User> GetUserById(int id);
        Task<List<int>> ExtractUserIDs(List<UserDto> users);
        
        Task<(CookieOptions cookiesOption, string refreshToken, object data)> UserLogIn(UserLogIn userRequest);
        Task<(CookieOptions cookiesOption, string refreshToken, object data)> UserLogInTfa(UserLoginTfa userRequest);
        Task<object> EnableTwoFactorAuthentication(int userID);
        Task<UserDto> GetUser(int userID);
        Task<UserDto> ConfirmTfa(UserLoginTfa request, int userID);
        Task<UserDto> DisableTfa(int userID);
        Task<UserDto> ChangeEmail(UserDto userDto);
    }
}



