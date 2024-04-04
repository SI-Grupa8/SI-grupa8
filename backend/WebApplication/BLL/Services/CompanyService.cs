using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;

namespace BLL.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IMapper _mapper;
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<Company> GetCompanyByID(int id)
        {
            var company = await _companyRepository.GetById(id);

            return company!;
        }

        public async Task<List<CompanyDto>> GetAll()
        {
            var companies=await _companyRepository.GetAll();
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

        public async Task<CompanyDto> AddCompany(CompanyDto companyDto)
        {
            var company = new Company
            {
                CompanyName = companyDto.CompanyName,
                AdminID = companyDto.AdminID
            };

            _companyRepository.Add(company);
            await _companyRepository.SaveChangesAsync();
            var returnedCompany = await GetCompanyByName(company.CompanyName); 

            return returnedCompany;
        }

        public async Task<CompanyDto> UpdateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);

            _companyRepository.Update(company);

            await _companyRepository.SaveChangesAsync();

            return companyDto;
        }

        public async Task<List<UserDto>> GetAllUsers(int adminId)
        {
            var company = await _companyRepository.GetByAdminId(adminId);

            var users = _mapper.Map<List<UserDto>>(company.Users.ToList());

            return users;

        }
    }
}
