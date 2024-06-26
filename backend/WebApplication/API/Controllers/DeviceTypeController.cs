﻿using BLL.DTOs;
using BLL.Interfaces;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly IDeviceTypeService _deviceTypeService;

        public DeviceTypeController(IDeviceTypeService deviceTypeService)
        {
            _deviceTypeService = deviceTypeService;
        }

        [HttpGet("get-device-type")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DeviceTypeDto>> GetDeviceTypeByID(int id)
        {
            return await _deviceTypeService.GetDeviceTypeByID(id);
        }

        [HttpGet("get-all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<DeviceTypeDto>>> GetAll()
        {
            return Ok(await _deviceTypeService.GetAll());
        }
    }
}
