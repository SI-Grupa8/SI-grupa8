using API.Controllers;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestProject2
{
    [TestClass]
    public class DeviceControllerTests
    {
        private Mock<IDeviceService> deviceServiceMock;
        private DeviceController controller;

        [TestInitialize]
        public void Initialize()
        {

            deviceServiceMock = new Mock<IDeviceService>();
            // Initialize controller with mock dependencies
            controller = new DeviceController(deviceServiceMock.Object);

            // Mock HttpContext for the controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [TestMethod]
        public void Constructor_Injects_DeviceService()
        {
            // Arrange
            var deviceServiceMock = new Mock<IDeviceService>();

            // Act
            var controller = new DeviceController(deviceServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public async Task GetAllForCompany_Returns_OkResult()
        {
            // Arrange
            var expectedData = new List<DeviceDto>(); // Provide expected data here
            var adminId = 1; // Sample admin ID for testing

            // Mock DeviceService.GetAllForCompany to return valid data
            deviceServiceMock.Setup(service => service.GetAllForCompany(adminId))
                             .ReturnsAsync(expectedData);

            // Set up mock HttpContext with a valid authorization token
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.GetAllForCompany(1);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task RemoveDevice_Returns_OkResult()
        {
            // Arrange
            var deviceId = 1; // Sample device ID for testing
            var adminId = 1; // Sample admin ID for testing

            // Set up mock HttpContext with a valid authorization token
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.RemoveDevice(deviceId, 1);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task AddDevice_Returns_OkResult()
        {
            // Arrange
            var request = new DeviceDto { Reference = "11:22", DeviceName = "ime" }; // Create a sample DeviceDto object

            // Mock DeviceService.AddDevice to return valid data
            var expectedData = new object(); // Provide expected data here
            deviceServiceMock.Setup(service => service.AddDevice(request))
                             .ReturnsAsync(expectedData);

            // Set up mock HttpContext with a valid authorization token
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.AddDevice(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task UpdateDevice_Returns_DeviceDto()
        {
            // Arrange
            var request = new DeviceDto { Reference = "11:22", DeviceName = "ime" }; // Create a sample DeviceDto object
            var companyId = 1; // Sample company ID for testing
            var expectedResult = new ActionResult<DeviceDto>(request); // Define expected result

            deviceServiceMock.Setup(service => service.UpdateDevice(request, companyId)).Returns(Task.CompletedTask);

            // Act
            var result = await controller.UpdateDevice(request, companyId);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(ActionResult<DeviceDto>)); // Check if result is of correct type
            Assert.AreEqual(expectedResult.Value, result.Value); // Check if returned value matches expected value
        }

        [TestMethod]
        public async Task FilterDevices_Returns_ListOfDeviceDto()
        {
            // Arrange
            var deviceTypeIDs = new List<int> { 1, 2, 3 }; // Sample device type IDs for testing
            var expectedResult = new List<DeviceDto>(); // Provide expected data here

            deviceServiceMock.Setup(service => service.GetDevicesByType(It.IsAny<int>(), deviceTypeIDs)).ReturnsAsync(expectedResult);

            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
            // Act
            var result = await controller.FilterDevices(deviceTypeIDs);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.AreEqual(expectedResult, result.Value); // Check if returned value matches expected value
        }
    }
}
