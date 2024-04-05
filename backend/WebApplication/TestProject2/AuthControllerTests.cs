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

    }
}
