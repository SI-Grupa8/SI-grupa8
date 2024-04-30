using API.Controllers;
using BLL.DTOs;
using BLL.Interfaces;
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
    public class LocationStorageControllerTests
    {
        private Mock<ILocationStorageService> _locationStorageServiceMock;
        private LocationStorageController _controller;

        [TestInitialize]
        public void Setup()
        {
            _locationStorageServiceMock = new Mock<ILocationStorageService>();
            _controller = new LocationStorageController(_locationStorageServiceMock.Object);
        }

        [TestMethod]
        public void Constructor_Injects_LocationStorageService()
        {
            // Arrange
            var locationStorageServiceMock = new Mock<ILocationStorageService>();

            // Act
            var controller = new LocationStorageController(locationStorageServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(LocationStorageController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public async Task SaveLocation_Returns_OkResult()
        {
            // Arrange
            var locationStorageDto = new LocationStorageDto();

            // Act
            var result = await _controller.SaveLocation(locationStorageDto);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetLocationsByDeviceId_Returns_OkResult_For_Admin_User()
        {
            // Arrange
            var deviceId = 1;
            var locations = new List<LocationStorageDto> { new LocationStorageDto(), new LocationStorageDto() };
            _locationStorageServiceMock.Setup(service => service.GetLocationsByDeviceId(deviceId)).ReturnsAsync(locations);

            // Act
            var result = await _controller.GetLocationsByDeviceId(deviceId);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<List<LocationStorageDto>>));
            //var okResult = (OkObjectResult)result;
            //Assert.AreEqual(locations, okResult.Value);
        }
    }
}
