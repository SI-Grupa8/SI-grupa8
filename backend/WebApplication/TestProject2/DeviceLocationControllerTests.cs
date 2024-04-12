using API.Controllers;
using BLL.Interfaces;
using BLL.Services;
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
    }
}
