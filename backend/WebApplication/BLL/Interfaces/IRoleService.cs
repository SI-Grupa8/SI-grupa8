using System;
using BLL.DTOs;

namespace BLL.Interfaces
{
	public interface IRoleService
	{
		Task<RoleDto> GetRoleByID(int id);
	}
}

