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

        public async Task<Company> GetCompanyByID(int id)
        {
            var company = await _companyRepository.GetById(id);

            return company!;
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
            var company = await _companyRepository.GetById(companyId);

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
                //_userRepository.Update(adminUser);

                await _userRepository.SaveChangesAsync();
            }

            return returnedCompany;
        }

        public async Task<CompanyDto> UpdateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);

            foreach (var userDto in companyDto.Users)
            {
                var existingUser = await _userRepository.GetById(userDto.UserID);
                if (existingUser != null)
                {
                    if (company.Users == null)
                        company.Users = new List<User>();
                    company.Users.Add(existingUser);
                }
                else
                {
                    throw new ArgumentException($"User with ID {userDto.UserID} not found.");
                }
            }

            // Call UpdateWithAttachment instead of Update
            await _companyRepository.UpdateWithAttachment(company);

            // Return the updated companyDto
            return _mapper.Map<CompanyDto>(company);
        }


        public async Task<List<UserDto>> GetAllUsers(int adminId)
        {
            var adminUser = await _userRepository.GetById(adminId);

            var users = await _userRepository.GetAllByCompanyId((int)adminUser.CompanyID!);
            users.ForEach(x =>
            {
                x.Company!.Users = null!;
            });

            return _mapper.Map<List<UserDto>>(users);

        }
    }
}
