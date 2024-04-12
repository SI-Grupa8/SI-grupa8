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
    public class CompanyControllerTests
    {
        private Mock<ICompanyService> companyServiceMock;
        private CompanyController controller;

        [TestInitialize]
        public void Initialize()
        {
            companyServiceMock = new Mock<ICompanyService>();

            // Initialize controller with mock dependencies
            controller = new CompanyController(companyServiceMock.Object);

            // Mock HttpContext for the controller
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }
        [TestMethod]
        public void Constructor_Injects_CompanyService()
        {
            // Arrange
            var companyServiceMock = new Mock<ICompanyService>();

            // Act
            var controller = new CompanyController(companyServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(CompanyController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(CompanyController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public async Task GetAllCompanies_OkResult()
        {
            // Arrange
            var expectedCompanies = new List<CompanyDto>(); // Provide a list of sample CompanyDto objects

            // Mock CompanyService.GetAll to return a list of CompanyDto
            companyServiceMock.Setup(service => service.GetAll())
                              .ReturnsAsync(expectedCompanies);

            // Set up mock HttpContext with a valid authorization token
            var token = "dummyToken"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task RemoveCompany_OkResult()
        {
            // Arrange
            var companyId = 1; // Sample company ID for testing

            // Set up mock HttpContext with a valid authorization token
            var token = "dummyToken"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.RemoveCompany(companyId);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task AddCompany_OkResult()
        {
            // Arrange
            var company = new CompanyDto(); // Create a sample CompanyDto object
            var expectedCompanyDto = new CompanyDto(); // Create a sample CompanyDto object

            // Mock CompanyService.AddCompany to return a CompanyDto
            companyServiceMock.Setup(service => service.AddCompany(company, 1))
                              .ReturnsAsync(expectedCompanyDto);

            // Set up mock HttpContext with a valid authorization token
            var token = "dummyToken"; // Generate a valid JWT token
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer " + token;

            // Set up the controller context with the mock HttpContext
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            // Act
            var result = await controller.AddCompany(company);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task UpdateCompany_OkResult()
        {
            // Arrange
            var company = new CompanyDto(); // Create a sample CompanyDto object
            var expectedCompanyDto = new CompanyDto(); // Create a sample CompanyDto object

            // Mock CompanyService.UpdateCompany to return a CompanyDto
            companyServiceMock.Setup(service => service.UpdateCompany(company))
                              .ReturnsAsync(expectedCompanyDto);

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
            var result = await controller.UpdateCompany(company);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
        }

        [TestMethod]
        public async Task GetAllUsers_OkResult()
        {
            // Arrange
            var expectedUsers = new List<UserDto>(); // Provide a list of sample UserDto objects

            // Mock CompanyService.GetAllUsers to return a list of UserDto
            companyServiceMock.Setup(service => service.GetAllUsers(It.IsAny<int>()))
                              .ReturnsAsync(expectedUsers);

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
            var result = await controller.GetAllUsers(1);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }

        [TestMethod]
        public async Task GetCompanyById_OkResult()
        {
            var expected = new CompanyDto();

            // Mock CompanyService.GetAllUsers to return a list of UserDto
            companyServiceMock.Setup(service => service.GetCompanyByID(1))
                              .ReturnsAsync(expected);

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
            var result = await controller.GetCompanyById(1);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is Ok
        }
    }
}
