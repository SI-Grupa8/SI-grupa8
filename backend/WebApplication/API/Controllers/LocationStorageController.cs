using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationStorageController : ControllerBase
    {
        private readonly ILocationStorageService _locationStorageService;

        public LocationStorageController(ILocationStorageService locationStorageService)
        {
            _locationStorageService = locationStorageService;
        }

    }
}
