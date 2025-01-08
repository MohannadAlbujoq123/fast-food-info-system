using Microsoft.AspNetCore.Authorization;

public class DisabledUserHandler : AuthorizationHandler<DisabledUserRequirement>
{
    private readonly IUserRepository _userRepository;

    public DisabledUserHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, DisabledUserRequirement requirement)
    {
        var userIdClaim = context.User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null)
        {
            context.Fail();
            return;
        }

        if (!int.TryParse(userIdClaim.Value, out var userId))
        {
            context.Fail();
            return;
        }

        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null || user.IsDisabled)
        {
            context.Fail();
            return;
        }

        context.Succeed(requirement);
    }
}

