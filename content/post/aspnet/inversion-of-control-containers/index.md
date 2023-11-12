---
title: "ASP.NET Core - Inversion of Control Container"
date: 2019-06-29
series: "Development"
type: post
---

ASP.NET Core supports [dependency injection](https://eddieabbondanz.io/post/software-design/dependency-injection/) directly out of the box. For Web APIs this is useful for automatically resolving dependencies needed by controllers, or if you're a fan of Uncle Bob's Clean Architecture it can be used to inject external dependencies such as the database into the inner layers.

Let's imagine we're building an API that has a `UserController` to provide an endpoint for retrieving users via their numeric id from the database. Since we don't want the `UserController` to directly interact with the database as it would violate the [single responsibility principle](https://scotch.io/bar-talk/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) we will rely upon a `UserService` to do the dirty work for us.

We'll even take it one step further and assume our `UserService` implements an `IUserService` interface to support dependency inversion by coding against the `IUserService` interface in the `UserController`.

```csharp
public interface IUserService {
  Task<User> GetUser(int id);
}

public class UserService : IUserService {
  public async Task<User> GetUser(int id) {
    //Magic goes here...
  }
}
```

And for completeness the `UserController`:

```csharp
[Route("api/user")]
[ApiController]
public class UserController : ControllerBase {
  private IUserService userService; //Need a way to instantiate this...

  [HttpGet("{id}")]
  public async Task<ActionResult> FindUserById(int id) {
    User user = await userService.FindById(id);

    if(user != null) {
      return Ok(user);
    } else {
      return NotFound();
    }
  }
}
```

# Registering Dependencies

In order for ASP.NET to be able to resolve a dependency, we need to register it with the IoC container. In older versions of ASP.NET this would be done in `global.asax`. However, this file is no longer present and the IoC container is now configured in `Startup.cs`. By default, `Startup.cs` is located within the root directory of your project. Open it up and locate the following method:

```csharp
  // This method gets called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services) {

  }
```

The parameter `services` of type `IServiceCollection` is the IoC container we need to set up. When it comes to registering a dependency with the container we have three different lifetimes available: transient, singleton, or scoped.

## Transient

Dependencies registered via `AddTransient()` will return a new instance each time the dependency is resolved. This is useful for lightweight, stateless classes that don't require initialization.

## Singleton

A [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) dependency registered via `AddSingleton()` will always return the same instance each time it's resolved from the container. This is useful for large classes that are expensive to instantiate, or require set up.

## Scoped

Lastly, a scoped dependency registered with `AddScoped()` will return a new instance per connection (request). For example if Client A made an API request it would be given one instance of the dependency but if Client B made a request it would be given another.

None of the three methods accept any parameters, instead the dependency type is passed in via generics. Each method is also overloaded to allow for registering a dependency to it's exact type, or to an interface / abstract class (useful for dependency inversion).

Continuing on with our example, if we want to register our `UserService` as a transient we could do so:

```csharp
  // This method gets called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services) {
    services.AddTransient<UserService>();
  }
```

But, if we want to fully utilize dependency inversion we would need to reference the interface `UserService` implements, or else ASP.NET won't be able to resolve a `IUserService` dependency with our service.

```csharp
  // This method gets called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services) {
    services.AddTransient<IUserService, UserService>();
  }
```

# Resolving Dependencies

We need to make a minor tweak to the constructor of `UserController` so ASP.NET knows to pass it a dependecy when creating the controller.

```csharp
[Route("api/user")]
public class UserController : BaseController {
  private IUserService userService;

  public UserController(IUserService service) {
    userService = service;
  }
  ...
}
```

Now ASP.NET will automatically inject our depedency of the `IUserService` when it instantiates an instance of the `UserController`.

\***\*Note**: Since the `UserController` constructor expects a parameter of type `IUserService` it is crucial we register the `UserService` with its interface. If we register `UserService` without its interface then ASP.NET will throw an exception due to being unable to find the dependency.

```csharp
//Good
services.AddTransient<IUserService, UserService>();

//Bad
services.AddTransient<UserService>();
```

# Nested Dependencies

The IoC container provided by ASP.NET supports nested dependencies. If our example of the `UserController` and `UserService` from earlier was a standard N-Tier structured project, there's a good chance our `UserService` needs some kind of way to interact with the data persistance layer. In a project with no objet relational mapping (ORM) library this would typically be a `UserRepo` to allow for CRUD (Create, Read, Update, and Delete) actions of users in the database.

To ensure we keep the layers of the project loosely-coupled we wouldn't want the `UserService` to have to create it's own `UserRepo` instance. Instead we would want to code against a `IUserRepo` interface and pass the instance of the repo into the service via it's constructor.

```csharp
public class UserService {
  private IUserRepo userRepo;

  public UserService(IUserRepo uRepo) {
    userRepo = uRepo;
  }
}

public interface IUserRepo {
  User FindById(int id);
}

public class UserRepo : IUserRepo {
  public User FindById(int id){
    //magic
  }
}
```

Then when we set up our IoC container we need to register the new dependency (the UserRepo)

```csharp
  // This method gets called by the runtime. Use this method to add services to the container.
  public void ConfigureServices(IServiceCollection services) {
    services.AddTransient<IUserRepo, UserRepo>();
    services.AddTransient<IUserService, UserService>();
  }
```

And now the IoC container will correctly resolve our `UserService` dependency and give it an instance of the `UserRepo`.

# 3rd Party IoC Containers

While the IoC container provided by ASP.NET should suffice for most uses, it does have some drawbacks. As noted by the [official documentation](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2#default-service-container-replacement) it lacks the following features:

- Property injection
- Injection based on name
- Child containers
- Custom lifetime management
- `Func<T>` support for lazy initialization

If any of these missing features are deal breakers for you, the default IoC container can be swapped out with an external library such as [AutoFac](https://www.nuget.org/packages/Autofac/) and following the instructions available [here](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2#default-service-container-replacement).
