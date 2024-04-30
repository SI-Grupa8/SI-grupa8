using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IMapper _mapper;
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;

        public CompanyService(ICompanyRepository companyRepository, IMapper mapper, IUserRepository userRepository)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        public async Task<CompanyDto> GetCompanyByID(int id)
        {
            var company = await _companyRepository.GetById(id);

            return _mapper.Map<CompanyDto>(company);
        }

        public async Task<List<CompanyDto>> GetAll()
        {
            var companies=await _companyRepository.GetAllWithAdmins();
            companies.ForEach(x =>
            {
                x.Users.ForEach(x => x!.Company = null);
            }
            );

            companies.ForEach(x =>
            {
                x.Users.RemoveAll(x => x.RoleID != 1);
            });
            return _mapper.Map<List<CompanyDto>>(companies);
        }

        public async Task<CompanyDto> GetCompanyByName(string name)
        {
            var company = await _companyRepository.GetByName(name);

            return _mapper.Map<CompanyDto>(company);
        }

        public async Task RemoveCompany(int companyId)
        {
            var company =  await _companyRepository.GetAllUsersForCompany(companyId);
            var users = company.Users.ToList();
            
            users.ForEach(x =>
            {
                x.Company = null;
            });

            users.ForEach(x => x.CompanyID = null);

            await _userRepository.SaveChangesAsync();
            _companyRepository.Remove(company!);

            await _companyRepository.SaveChangesAsync();
        }

        public async Task<CompanyDto> AddCompany(CompanyDto companyDto, int? adminId=0)
        {
            var company = new Company
            {
                CompanyName = companyDto.CompanyName
            };

            _companyRepository.Add(company);
            await _companyRepository.SaveChangesAsync();

            var returnedCompany = await GetCompanyByName(company.CompanyName);

            if (adminId != 0)
            {
                var adminUser = await _userRepository.GetById((int)adminId!);

                adminUser.CompanyID = returnedCompany.CompanyID;
                adminUser.RoleID = 1;

                await _userRepository.SaveChangesAsync();
            }

            return returnedCompany;
        }

        public async Task<CompanyDto> UpdateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);

            if (companyDto.Users == null)
            {
                companyDto.Users = new List<UserDto>(); 
            }

            foreach (var userDto in companyDto.Users)
            {
                var existingUser = await _userRepository.GetById(userDto.UserID); 
                if (existingUser != null)
                {
                    existingUser.CompanyID = companyDto.CompanyID;
                    existingUser.RoleID = 1;

                }
                else
                {
                    throw new ArgumentException($"User with ID {userDto.UserID} not found.");
                }
            }

            await _userRepository.SaveChangesAsync();

            return companyDto;
        }

        public async Task<List<UserDto>> GetAllUsers(int companyId)
        {
            var company = await _companyRepository.GetAllUsersForCompany(companyId);

            var users = company.Users.ToList();

            users.ForEach(x =>
            {
                x.Company = null;
            });

            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<object> GetUserStatistics(int companyId)
        {
            return await _companyRepository.GetUserStatistics(companyId);
        }
    }
}
