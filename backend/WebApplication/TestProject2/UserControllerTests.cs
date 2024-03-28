using API.Controllers;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestProject2
{
    [TestClass]
    public class UserControllerTests
    {
        [TestMethod]
        public void Constructor_Injects_UserService()
        {
            // Arrange
            var userServiceMock = new Mock<IUserService>();

            // Act
            var controller = new UserController(userServiceMock.Object);

            // Assert
            Assert.IsNotNull(controller);
            Assert.AreSame(userServiceMock.Object, controller.GetUserService());
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
    }
}
