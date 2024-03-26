using BLL.DTOs;
using DAL.Entities;
using System;
namespace BLL.Interfaces
{
	public interface IUserService
	{
        Task<UserDto> AddUser(UserRegisterDto userRegisterDto);
        Task<List<User>> GetAll();
    }
}

