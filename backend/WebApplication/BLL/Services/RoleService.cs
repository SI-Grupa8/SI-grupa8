using System;
using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Interfaces;

namespace BLL.Services
{
	public class RoleService : IRoleService
	{
        private readonly IMapper _mapper;
        private readonly IRoleRepository _roleRepository;

		public RoleService(IRoleRepository roleRepository, IMapper mapper)
		{
            _roleRepository = roleRepository;
            _mapper = mapper;
		}

        public async Task<RoleDto> GetRoleByID(int id)
        {
            var role = await _roleRepository.GetById(id);

            return _mapper.Map<RoleDto>(role);
        }
    }
}

