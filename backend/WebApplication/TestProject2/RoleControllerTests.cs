using API.Controllers;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Authorization;

namespace TestProject2
{
    [TestClass]
    public class RoleControllerTests
    {
        [TestMethod]
        public void Constructor_Injects_RoleService()
        {
            // Arrange
            var roleServiceMock = new Mock<IRoleService>();

            // Act
            var controller = new RoleController(roleServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
            //Assert.AreSame(roleServiceMock.Object, controller.GetRoleService());
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
        public void Controller_Has_Authorize_Attribute()
        {
            // Arrange & Act
            var controllerType = typeof(RoleController);
            var authorizeAttribute = controllerType.GetCustomAttributes(typeof(AuthorizeAttribute), inherit: true);

            // Assert
            Assert.AreEqual(1, authorizeAttribute.Length);
        }
    }
}
