using AutoMapper;
using BLL.Interfaces;
using DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class LocationStorageService: ILocationStorageService
    {
        private readonly IMapper _mapper;
        private readonly ILocationStorageRepository _locationStorageRepository;

        public LocationStorageService(ILocationStorageRepository locationStorageRepository, IMapper mapper)
        {
            _locationStorageRepository = locationStorageRepository;
            _mapper = mapper;
        }
    }
}
