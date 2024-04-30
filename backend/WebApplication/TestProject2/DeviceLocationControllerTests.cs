using API.Controllers;
using API.JWTHelpers;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace TestProject2
{
    [TestClass]
    public class DeviceLocationControllerTests
    {
        private Mock<IDeviceLocationService> deviceLocationServiceMock;
        private DeviceLocationController controller;

        [TestInitialize]
        public void Initialize()
        {
            deviceLocationServiceMock = new Mock<IDeviceLocationService>();

            // Initialize controller with mock dependencies
            controller = new DeviceLocationController(deviceLocationServiceMock.Object);

            // Mock HttpContext for the controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Create mock object for IJwtSecurityTokenHandler and set up behavior
            var tokenHandlerMock = new Mock<IJwtSecurityTokenHandler>();
            tokenHandlerMock.Setup(handler => handler.ReadToken(It.IsAny<string>())).Returns(new JwtSecurityToken());
            JWTHelper.SetJwtSecurityTokenHandler(tokenHandlerMock.Object);
        }

        [TestMethod]
        public void Constructor_Injects_DeviceService()
        {
            // Arrange
            var deviceLocationServiceMock = new Mock<IDeviceLocationService>();

            // Act
            var controller = new DeviceLocationController(deviceLocationServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceLocationController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceLocationController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public void SetDeviceToken_Returns_OkResult()
        {
            // Arrange
            var macAddress = "sampleMacAddress"; // Provide a sample MAC address
            var expectedToken = "sampleToken"; // Provide the expected token value

            // Mock _deviceLocationService.CreateDeviceToken to return the expected token
            deviceLocationServiceMock.Setup(service => service.CreateDeviceToken(macAddress))
                                      .Returns(expectedToken);

            // Act
            var result = controller.SetDeviceToken(macAddress);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task SendCurrentLocation_Should_Return_OkResult_When_LocationSaved()
        {
            // Arrange
            var lat = "12.345secretCodeABC"; // Provide a sample latitude
            var lg = "123.456secretCodeDEF"; // Provide a sample longitude
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDAtQjAtRDAtNjMtQzItMjYiLCJleHAiOjE3MTcwODQ2NDB9.Wux2J7bb6TL4ZW--psf-jjuSnXjJ2CQCujuxTFWiMlU";
            var macAddress = "3C-55-76-79-00-0D"; // Provide a sample MAC address

            // Mock HttpContext to provide the token in the request header
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;
            controller.ControllerContext.HttpContext = httpContext;

            // Mock behavior of _deviceLocationService to avoid actual saving
            deviceLocationServiceMock.Setup(x => x.SaveCurrentLocation(lat, lg, macAddress)).Returns(Task.CompletedTask);

            await controller.SendCurrentLocation(lat, lg);
            
            var actionResult = await controller.SendCurrentLocation(lat, lg);
            var okResult = actionResult as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            var anonymousType = okResult.Value.GetType();
            var messageProperty = anonymousType.GetProperty("Message");
            var actualMessage = messageProperty?.GetValue(okResult.Value);

            Assert.AreEqual("Location saved", actualMessage);
        }

        [TestMethod]
        public async Task SendCurrentLocation_Should_Return_BadRequest_When_UnauthorizedAccessExceptionThrown()
        {
            // Arrange
            var lat = "12.345secretCodeABC"; // Provide a sample latitude
            var lg = "123.456secretCodeDEF"; // Provide a sample longitude
            var unauthorizedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMTIzIiwiZXhwIjoxNzE3MDg1ODkxfQ.cG3JfLJJGkT9fzrKUC1mpoKJ1rUxswPLaYuhKQMCnwA"; // Provide a sample token with an unauthorized MAC address
            var errorMessage = "Unauthorized access"; // Expected error message

            // Mock HttpContext to provide the token in the request header
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + unauthorizedToken;
            controller.ControllerContext.HttpContext = httpContext;

            // Mock behavior of _deviceLocationService to throw UnauthorizedAccessException
            deviceLocationServiceMock
                .Setup(x => x.SaveCurrentLocation(lat, lg, It.IsAny<string>()))
                .ThrowsAsync(new UnauthorizedAccessException(errorMessage));

            // Act and Assert
            var actionResult = await controller.SendCurrentLocation(lat, lg);

            // Assert
            Assert.IsNotNull(actionResult); // Ensure actionResult is not null

            // Ensure that the action result is a BadRequestObjectResult
            Assert.IsInstanceOfType(actionResult, typeof(BadRequestObjectResult));

            // Convert the action result to BadRequestObjectResult
            var badRequestResult = actionResult as BadRequestObjectResult;

            // Check if the error message matches the expected error message
            Assert.AreEqual(errorMessage, badRequestResult.Value);
        }

        [TestMethod]
        public void GetDeviceRoutesFilter_Should_Return_List_Of_LocationStorageDto()
        {
            // Arrange
            var time = new DateTimes { date1 = DateTime.UtcNow.AddDays(-1), date2 = DateTime.UtcNow }; // Provide a sample DateTimes object
            var deviceId = 1; // Provide a sample deviceId

            // Mock the expected list of LocationStorageDto returned by the service
            var expectedLocations = new List<LocationStorageDto>{};
            deviceLocationServiceMock.Setup(x => x.GetDeviceLocationsFilter(deviceId, time.date1, time.date2)).Returns(expectedLocations);
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
            // Act
            var actionResult = controller.GetDeviceRoutesFilter(time, deviceId);

            // Assert
            Assert.IsNotNull(actionResult); // Ensure actionResult is not null
            Assert.IsInstanceOfType(actionResult, typeof(ActionResult<List<LocationStorageDto>>)); // Ensure actionResult is of the correct type
        }

    }
}
