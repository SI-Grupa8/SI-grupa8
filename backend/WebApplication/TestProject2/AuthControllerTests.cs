using API.Controllers;
using BLL.Interfaces;
using BLL.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using API.JWTHelpers;
using DAL.Entities;
using BLL.Services;
using DAL.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace TestProject
{
    [TestClass]
    public class AuthControllerTests
    {
        private UserRegisterDto userRegisterDto;
        private UserLogIn userLogIn;
        private UserLoginTfa userLoginTfa;
        private Mock<IUserService> userServiceMock;
        private Mock<IConfiguration> configMock;
        private AuthController controller;

        [TestInitialize]
        public void Initialize()
        {
            // Initialize common objects
            userRegisterDto = new UserRegisterDto { Password="password" };
            userLogIn = new UserLogIn { Password = "password" };
      
            userLoginTfa = new UserLoginTfa(); 

            userServiceMock = new Mock<IUserService>();
            configMock = new Mock<IConfiguration>();

            // Initialize controller with mock dependencies
            controller = new AuthController(userServiceMock.Object, configMock.Object);

            // Mock HttpContext for the controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [TestMethod]
        public void Constructor_Injects_Dependencies()
        {
            // Arrange
            var configMock = new Mock<IConfiguration>();
            var userServiceMock = new Mock<IUserService>();

            // Act
            var controller = new AuthController(userServiceMock.Object, configMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(AuthController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(AuthController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public async Task Register_Returns_BadRequest_When_Input_Invalid()
        {
            // Arrange
            userServiceMock.Setup(service => service.AddUserRegister(It.IsAny<UserRegisterDto>()))
                           .ReturnsAsync((UserDto)null); // Mock service to return null

            // Act
            var result = await controller.Register(userRegisterDto);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task Login_Returns_BadRequest_When_Input_Invalid()
        {
            // Act
            var result = await controller.Login(userLogIn);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task LoginTfa_Returns_BadRequest_When_Input_Invalid()
        {
            // Arrange
            userServiceMock.Setup(service => service.UserLogInTfa(It.IsAny<UserLoginTfa>()))
                           .ReturnsAsync((null, null, null)); // Mock service to return null tuple for invalid input

            // Create a UserLogIn object with invalid input (empty email and phone number)
            var userLogIn = new UserLogIn { Email = "", PhoneNumber = "", Password="password" };

            // Act
            var result = await controller.Login(userLogIn);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task LoginTfa_Returns_Ok_When_Input_Valid()
        {
            // Arrange
            var expectedResult = (new CookieOptions(), "refreshToken", new object()); // Provide valid expected result here
            userServiceMock.Setup(service => service.UserLogInTfa(It.IsAny<UserLoginTfa>()))
                           .ReturnsAsync(expectedResult); // Mock service to return a tuple with valid values

            // Set up mock HttpContext with proper response
            var httpContext = new DefaultHttpContext();
            httpContext.Response.Cookies.Append("refreshToken", "dummyToken", new CookieOptions()); // Provide valid options here

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.LoginTfa(userLoginTfa);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task Login_Returns_Ok_WithData_When_Input_Valid()
        {
            // Arrange
            var expectedData = new object(); 
            var expectedResult = (new CookieOptions(), "refreshToken", expectedData); 
            userServiceMock.Setup(service => service.UserLogIn(It.IsAny<UserLogIn>()))
                           .ReturnsAsync(expectedResult); 

            // Create a UserLogIn object with valid input
            var userLogIn = new UserLogIn { Email = "test@example.com", Password = "password" };

            // Act
            var result = await controller.Login(userLogIn);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
            var okResult = (OkObjectResult)result.Result;
            Assert.AreEqual(expectedData, okResult.Value); // Check if data matches expected data
        }

        [TestMethod]
        public async Task Register_Returns_Ok_WithData_When_Input_Valid()
        {
            // Arrange
            var expectedUserDto = new UserDto(); // Provide expected UserDto object here
            userServiceMock.Setup(service => service.AddUserRegister(It.IsAny<UserRegisterDto>()))
                           .ReturnsAsync(expectedUserDto); // Mock service to return valid UserDto for valid input

            // Create a UserRegisterDto object with valid input
            var userRegisterDto = new UserRegisterDto { Email = "test@example.com", Password = "password" };

            // Act
            var result = await controller.Register(userRegisterDto);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
            var okResult = (OkObjectResult)result.Result;
            Assert.AreEqual(expectedUserDto, okResult.Value); // Check if data matches expected UserDto object
        }

        [TestMethod]
        public async Task EnableTwoFactorAuthentication_OkResult()
        {
            // Arrange
            var expectedData = new object(); // Provide expected data here
            var userId = 1; // Sample user ID for testing

            // Mock UserService.EnableTwoFactorAuthentication to return valid data
            userServiceMock.Setup(service => service.EnableTwoFactorAuthentication(userId))
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
            var result = await controller.EnableTwoFactorAuthentication();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task DisableTwoFactorAuthentication_OkResult()
        {
            // Arrange
            var userId = 1; // Sample user ID for testing

            // Mock UserService.DisableTfa to return an ActionResult
            userServiceMock.Setup(service => service.DisableTfa(userId));

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
            var result = await controller.DisableTwoFactorAuthentication();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task StoreTwoFactorAuthentication_OkResult()
        {
            // Arrange
            var request = new UserLoginTfa(); // Create a sample UserLoginTfa object
            var userId = 1; // Sample user ID for testing

            // Mock UserService.ConfirmTfa to return a UserDto
            var expectedUserDto = new UserDto(); // Create a sample UserDto object
            userServiceMock.Setup(service => service.ConfirmTfa(request, userId))
                           .ReturnsAsync(expectedUserDto);

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
            var result = await controller.StoreTwoFactorAuthentication(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }
    }
}
