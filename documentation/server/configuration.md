---
description: Learn more about Configuration
---

# Configuration

## Introduction

We create a very small and simple to use configuration service. This service would be used inside the framework, but if you want, you can use it too.

{% hint style="info" %}
We are not do any fancy magic stuff here. Thanks goes [`Lodash`](https://lodash.com/)
{% endhint %}

## Base Configuration

The base configuration is our minimal setup for running all the framework stuff. Keep in mind, if you not using like discord, don't remove the params. They not used but to prevent compile errors on your side, it would be better to let them stay.

```javascript
{
  "database": {
    "name": "default",
    "type": "mysql",
    "host": "altv-mysql",
    "port": 3306,
    "username": "gamemode",
    "password": "demo123",
    "database": "gamemode",
    "synchronize": true,
    "logging": false
  },
  "discord": {
    "client_id": "",
    "client_secret": "",
    "bot_secret": "",
    "server_id": "",
    "redirect_url": "http://127.0.0.1:1337/auth/discord",
    "auth_url": "https://discord.com/api/oauth2/authorize",
    "auth_token_url": "https://discord.com/api/oauth2/token",
    "user_me_url": "https://discord.com/api/users/@me"
  }
}

```

## Get Config Parameter

Getting a parameter from the config file is fearly simple. Use the power of Dependency Injection and you are ready to go.

{% hint style="warning" %}
Nested elements would be get by separate the child with an dot
{% endhint %}

```javascript
export class MyComponent {
    
    // Load with dependency injection
    constructor(
        private readonly configService: ConfigService
    ) {}

    // Work with the resolved class
    public yourMethod(): void {
        const myValue = this.configservice.get('discord.auth_token_url');
        // now lives inside myValue the auth_token_url
    }
}
```

You can retrieve a config value with all nested elements if you want

```javascript
export class MyComponent {
    
    // Load with dependency injection
    constructor(
        private readonly configService: ConfigService
    ) {}

    // Work with the resolved class
    public yourMethod(): void {
        const myValue = this.configservice.get('discord');
        // now lives inside myValue the complete discord config section
    }
}
```

In some case, you want to get a default value, if your needed param is empty or does not exists

```javascript
export class MyComponent {
    
    // Load with dependency injection
    constructor(
        private readonly configService: ConfigService
    ) {}

    // Work with the resolved class
    public yourMethod(): void {
        const myValue = this.configservice.get('param.not.exists', 'defaultValue');
        // now lives inside myValue the string 'defaultValue'
    }
}
```

## Set Config Parameter

It is possible, to create your own parameters or complete objects if you want. To prevent the needed base configuration for not beeing overrided, your custom configuration lives in his own scope. But no worry, they merged if you want to retrieve an value from the configservice. 

```javascript
export class MyComponent {
    
    // Load with dependency injection
    constructor(
        private readonly configService: ConfigService
    ) {}

    // Work with the resolved class
    public yourMethod(): void {
        this.configservice.set('hello', 'world');
        // now you have create an config key 'hello' with the value 'world'
    }
}
```

{% hint style="info" %}
Keep in mind, nesting works also too. You can nest your params as deep as you want, the ConfigService is handle all for you.
{% endhint %}

