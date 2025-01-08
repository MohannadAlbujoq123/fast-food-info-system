using Microsoft.AspNetCore.Authorization;

public class DisabledUserRequirement : IAuthorizationRequirement
{
    public DisabledUserRequirement() { }
}
