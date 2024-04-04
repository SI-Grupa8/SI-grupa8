using API.Controllers;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Authorization;
using BLL.DTOs;
using Microsoft.AspNetCore.Http;

namespace TestProject2
{
    [TestClass]
    public class RoleControllerTests
    {
        private Mock<IRoleService> _roleServiceMock;
        private RoleController _controller;

        [TestInitialize]
        public void Setup()
        {
            _roleServiceMock = new Mock<IRoleService>();
            _controller = new RoleController(_roleServiceMock.Object);
        }

        [TestMethod]
        public void Constructor_Injects_RoleService()
        {
            // Arrange
            var roleServiceMock = new Mock<IRoleService>();

            // Act
            var controller = new RoleController(roleServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
        }

        [TestMethod]
        public void Controller_Has_Route_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(RoleController);
            var routeAttribute = controllerType.GetCustomAttributes(typeof(RouteAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, routeAttribute.Length);
            Assert.AreEqual("api/[controller]", ((RouteAttribute)routeAttribute[0]).Template);
        }

        [TestMethod]
        public async Task GetRoleByID_Returns_OkResult_For_Authorized_User()
        {
            // Arrange
            var id = 1;
            _roleServiceMock.Setup(service => service.GetRoleByID(id)).ReturnsAsync(new RoleDto { RoleID = 1, RoleName = "User" });

            // Act
            var result = await _controller.GetRoleByID(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<RoleDto>));
            var roleDto = result.Value;
            Assert.AreEqual(id, roleDto.RoleID);
        }

        [TestMethod]
        public async Task GetRoleByID_For_Unauthorized_User()
        {
            // Arrange
            var id = 0;

            // Act
            var result = await _controller.GetRoleByID(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNull(result.Result);
        }
    }
}
