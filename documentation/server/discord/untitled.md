---
description: Learn more about the Discord Bot
---

# Bot

## Introduction

Integrate an Discord Bot to your gamemode can have some benefits for you. Creating a whitelist, use the awesome permission layer from discord for ingame actions, read some server stats, kick players and so on. The list can be go further.

{% hint style="info" %}
Creating your own bot can not be simpler as this.
{% endhint %}

## Setup the Bot

#### Step 1

Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and create an account and application it not already exists

#### Step 2

Visit the **Bot** Page and **Add Bot** or using an existing one

#### Step 3

Store the Bot Token inside your environment.json and setup like the picture below

![Uncheck Public Bot and Check Privileged Gateway and Presence Intent](../../../.gitbook/assets/image%20%283%29.png)

#### Step 4

Generate an OAuth url and setup permissions for your bot, copy / paste to your browser and invite him to your server.

![We prefer to check only the permissions you really want](../../../.gitbook/assets/image%20%285%29.png)

![Invite the bot to your server](../../../.gitbook/assets/image%20%286%29.png)

{% hint style="success" %}
That's all for setup. The Framework does the rest for you.
{% endhint %}

## Example Usage

This example does not demonstrate a realworld example. It will only teach you the usage with the decorator and the interaction with the bot.

{% hint style="warning" %}
To keep it simple as possible, there is a decorator for you to interact with bot events.  
Any available bot event from [discord.js](https://discord.js.org/#/) are also useable with the decorator. The event params would be moved to the method.   
  
Keep in mind, the decorator is only server side
{% endhint %}

{% tabs %}
{% tab title="Listen for GuildMemberUpdate" %}
```typescript
export class MyComponent {

    // If you want to do something if a guild member was updated
    // then you can easy listen for this event with a decorator
    
    @OnDiscord('guildMemberUpdate')
    public doSomething(oldMember: GuildMember, newMember: GuildMember): void {
        // You can now do something with the oldMember and the newMember
        // e.g. Check if a roles exists and kick if not
    }

}
```
{% endtab %}
{% endtabs %}

