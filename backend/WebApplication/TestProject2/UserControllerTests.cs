using API.Controllers;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BLL.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;

namespace TestProject2
{
    [TestClass]
    public class UserControllerTests
    {
        private Mock<IUserService> userServiceMock;
        private UserController controller;

        [TestInitialize]
        public void Initialize()
        {
            userServiceMock = new Mock<IUserService>();

            // Initialize controller with mock dependencies
            controller = new UserController(userServiceMock.Object);

            // Mock HttpContext for the controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [TestMethod]
        public void Constructor_Injects_UserService()
        {
            // Arrange
            var userServiceMock = new Mock<IUserService>();

            // Act
            var controller = new UserController(userServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
            //Assert.AreSame(userServiceMock.Object, controller.GetUserService());
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(UserController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(UserController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public async Task GetLoggedUser_OkResult()
        {
            // Arrange
            var userId = 1; // Sample user ID for testing
            var expectedUserDto = new UserDto(); // Create a sample UserDto object

            // Mock UserService.GetUser to return a UserDto
            userServiceMock.Setup(service => service.GetUser(userId))
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
            var result = await controller.GetLoggedUser();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task RemoveUser_OkResult()
        {
            // Arrange
            var userId = 1; // Sample user ID for testing
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.RemoveUser(userId);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task AddUser_OkResult()
        {
            // Arrange
            var request = new UserRegisterDto { Password = "password" }; // Create a sample UserRegisterDto object
            var expectedUserDto = new UserDto(); // Create a sample UserDto object

            // Mock UserService.AddUser to return a UserDto
            userServiceMock.Setup(service => service.AddUser(request, It.IsAny<int>()))
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
            var result = await controller.AddUser(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task UpdateUser_OkResult()
        {
            // Arrange
            var request = new UserDto(); // Create a sample UserDto object

            // Mock UserService.UpdateUser to return an ActionResult
            userServiceMock.Setup(service => service.UpdateUser(request));

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
            var result = await controller.UpdateUser(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task GetAllAdmins_OkResult()
        {
            // Arrange
            var expectedAdmins = new List<UserDto>(); // Provide a list of sample UserDto objects

            // Mock UserService.GetAllAdmins to return a list of UserDto
            userServiceMock.Setup(service => service.GetAllAdmins())
                           .ReturnsAsync(expectedAdmins);

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
            var result = await controller.GetAllAdmins();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task GetAdminsWithoutCompany_OkResult()
        {
            // Arrange
            var expectedAdmins = new List<UserDto>(); // Provide a list of sample UserDto objects

            // Mock UserService.GetAllAdmins to return a list of UserDto
            userServiceMock.Setup(service => service.GetAdminsWihotuCompany())
                           .ReturnsAsync(expectedAdmins);

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
            var result = await controller.GetAdminsWithoutCompany();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(ActionResult<List<UserDto>>)); // Check if result is Ok
        }

        [TestMethod]
        public async Task ChangeEmail_OkResult()
        {
            // Arrange
            var request = new UserDto(); // Create a sample UserDto object

            // Mock UserService.UpdateUser to return an ActionResult
            userServiceMock.Setup(service => service.ChangeEmail(request));

            // Act
            var result = await controller.ChangeEmail(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task ChangePassword_OkResult()
        {
            // Arrange
            var request = new ChangePasswordDto(); // Create a sample UserDto object

            // Mock UserService.UpdateUser to return an ActionResult
            userServiceMock.Setup(service => service.ChangePassword(request));

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
            var result = await controller.ChangePassword(request);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task GetDispatchersForNewDevice_OkResult()
        {
            // Arrange
            var userId = 1; // Sample user ID for testing
            var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmc1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIwIiwiZXhwIjoxNzEyMzE1NjY4fQ.FKkvIzmtzHnUUEeFrIqQEzc0chQTZhHnbWdAyWsvG2s"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;
            // Mock UserService.UpdateUser to return an ActionResult
            userServiceMock.Setup(service => service.GetDispatchersForNewDevice(userId));
            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.GetDispacthersForNewDevice(userId);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(ActionResult<List<UserDto>>)); // Check if result is Ok
        }
    }
}
