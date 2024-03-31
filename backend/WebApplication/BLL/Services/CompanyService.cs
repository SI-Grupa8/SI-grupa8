using AutoMapper;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Entities;
using DAL.Interfaces;
using DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<CompanyDto> GetCompanyByID(int id)
        {
            var company = await _companyRepository.GetById(id);

            return _mapper.Map<CompanyDto>(company);
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
        public async void RemoveCompany(CompanyDto request)
        {
            var company = _mapper.Map<Company>(request);
            _companyRepository.Remove(company);
            await _companyRepository.SaveChangesAsync();
        }
        public async Task<CompanyDto> AddCompany(CompanyDto request)
        {
            var company = _mapper.Map<Company>(request);
            _companyRepository.Add(company);
            _companyRepository.SaveChangesAsync();
            return request;
        }

        public async void UpdateCompany(CompanyDto request)
        {
            var company = _mapper.Map<Company>(request);
            _companyRepository.Update(company);
            await _companyRepository.SaveChangesAsync();
        }
    }
}
