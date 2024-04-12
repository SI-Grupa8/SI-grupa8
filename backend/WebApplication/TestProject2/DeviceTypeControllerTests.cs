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
    public class DeviceTypeControllerTests
    {
        private Mock<IDeviceTypeService> deviceTypeServiceMock;
        private DeviceTypeController controller;

        [TestInitialize]
        public void Initialize()
        {
            deviceTypeServiceMock = new Mock<IDeviceTypeService>();
            controller = new DeviceTypeController(deviceTypeServiceMock.Object);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [TestMethod]
        public void Constructor_Injects_DeviceTypeService()
        {
            // Arrange
            var deviceTypeServiceMock = new Mock<IDeviceTypeService>();

            // Act
            var controller = new DeviceTypeController(deviceTypeServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceTypeController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public void Controller_Has_ApiController_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(DeviceTypeController);
            var apiControllerAttribute = controllerType.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, apiControllerAttribute.Length);
        }

        [TestMethod]
        public async Task GetDeviceTypeByID_Returns_DeviceTypeDto()
        {
            // Arrange
            var id = 1; // Sample device type ID for testing
            var expectedDeviceType = new DeviceTypeDto { DeviceTypeName="Name" }; // Sample device type object for testing

            deviceTypeServiceMock.Setup(service => service.GetDeviceTypeByID(id)).ReturnsAsync(expectedDeviceType);

            // Act
            var result = await controller.GetDeviceTypeByID(id);

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.AreEqual(expectedDeviceType, result.Value); // Check if returned value matches expected value
        }

        [TestMethod]
        public async Task GetAll_Returns_ListOfDeviceTypeDto()
        {
            // Arrange
            var expectedDeviceTypes = new List<DeviceTypeDto >(); // Sample list of device type objects for testing

            deviceTypeServiceMock.Setup(service => service.GetAll()).ReturnsAsync(expectedDeviceTypes);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.IsNotNull(result); // Check if result is not null
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult)); // Check if result is of correct type
        }
    }
}
