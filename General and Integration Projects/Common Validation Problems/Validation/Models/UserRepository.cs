using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Validation.Models
{
    public class UserRepository
    {
        private const string SESSION_KEY = "users";

        public List<User> GetUsers()
        {
            var users = HttpContext.Current.Session[SESSION_KEY] as List<User>;
            if (users == null)
            {
                users = GenerateUsers();
                HttpContext.Current.Session[SESSION_KEY] = users;
            }
            return users;
        }

        public void InsertUser(User user)
        {
            user.UserID = Guid.NewGuid();
            var users = GetUsers();            
            users.Add(user);
        }

        public void UpdateUser(User updatedUser)
        {
            var user = GetUserByID(updatedUser.UserID);
            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;
        }

        private User GetUserByID(Guid userID)
        {
            var users = GetUsers();
            return users.FirstOrDefault(u => u.UserID == userID);
        }

        private List<User> GenerateUsers()
        {
            List<User> users = new List<User>();
            for (int i = 1; i < 5; i++)
            {
                users.Add(new User()
                {
                    UserID = Guid.NewGuid(),
                    UserName = "User" + i,
                    Email = i + "email@domain.com"
                });
            }

            return users;
        }
    }
}