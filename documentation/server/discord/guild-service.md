---
description: Learn more about the guild service
---

# Guild Service

## Introduction

If you want to interact with your Discord Bot, it is needed to retrieve your server from the Guild cache. This needs to be fetch the guild by your server id. This can be anoying if you do this ever and ever. This why we create the Guildservice for you. At this time of writing the docs, there are only one feature inside the service. Grab your guild. Over the time, the service would be increase by more features and ideas.

{% hint style="warning" %}
Wishes and ideas can be posted inside \#ideas-features channel on our discord
{% endhint %}

## Basic Usage

Working with the guildservice is fearly simple. Create a new class and extend the guildservice.

{% hint style="success" %}
You can use any method you found on [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) documentation. The this.guild is only a wrapper for your own guild.
{% endhint %}

{% tabs %}
{% tab title="your-bot.component.ts" %}
```typescript
// If you extend the guild service, your class has access to
// this.guild => this is your own server
export class YourBotComponent extends GuildService {
    
  /**
   * Fetch all members and the giving roles for it
   */
  public fetchAllMembers(): void {
    this.guild.members
      .fetch()
      .then((members: Collection<string, GuildMember>) => {
        members.forEach((member: GuildMember) => {
          // For testing, log some informations
          UtilsService.log(JSON.stringify({
            name: member.user.username,
            displayName: member.displayName,
            roles: member.roles.cache.mapValues((role: Role) => role.name)
          }, null, 2));
        });
      })
      .catch((err) => {
        // Handle your error
      });
  }
}
```
{% endtab %}
{% endtabs %}



