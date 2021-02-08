---
description: Learn more about the available ClientDecorators
---

# Client

## Basic Event Decorator

{% hint style="info" %}
Every basic event decorator can have an parameter for the eventname to be listen  
If not provided, the name from decorated method would be use as eventname.
{% endhint %}

{% tabs %}
{% tab title="@OnServer" %}
```typescript
@OnServer('customEventname')
public doFancyStuff(player: Player): void {
  // customEventname is the eventname for listen
}

@OnServer()
public youAwesomMethod(player: Player): void {
  // yourAwesomeMethod is the eventname for listen
}
```
{% endtab %}

{% tab title="@OnceServer" %}
```typescript
@OnceServer('customEventname')
public doFancyStuff(player: Player): void {
  // customEventname is the eventname for listen
}

@OnceServer()
public youAwesomMethod(player: Player): void {
  // yourAwesomeMethod is the eventname for listen
}
```
{% endtab %}

{% tab title="@OnGui" %}
```typescript
@OnGui('customEventname')
public doFancyStuff(player: Player): void {
  // customEventname is the eventname for listen
}

@OnGui()
public youAwesomMethod(player: Player): void {
  // yourAwesomeMethod is the eventname for listen
}
```
{% endtab %}
{% endtabs %}

## Key Event Decorators

Working with key events can become very confusing. This decorators help you focused on the funny part. 

{% hint style="info" %}
Key Event Decorators has one parameter, number or first char from name of the key
{% endhint %}

{% tabs %}
{% tab title="@KeyUp" %}
```typescript
@KeyUp('E')
public doSomething(): void {
    // Do something after release E key
}

@KeyUp(69) // E Key
public doSomething(): void {
    // Do something after release E key
}
```
{% endtab %}

{% tab title="@KeyDown" %}
```typescript
@KeyDown('E')
public doSomething(): void {
    // Do something after pressing E key
}

@KeyDown(69) // E Key
public doSomething(): void {
    // Do something after pressing E key
}
```
{% endtab %}
{% endtabs %}

## GameEntity Decorators

If you want to interact with GameEntity creation and destroying, then it can be really frustrating.  
The framework helps you a lot with this. No worry only one event listener is created for this decorators.  
You can use as many as you want without performance issues.

{% hint style="warning" %}
First param is an the string version for [BaseObjectType](https://docs.altv.mp/js/api/alt-client.BaseObjectType.html#fields).
{% endhint %}

{% tabs %}
{% tab title="@GameEntityCreate" %}
```typescript
@GameEntityCreated('Player')
public doSomething(entity: Player): void {
    // You don't need to check the instance of the entity to fit your needs
    // the decorator does this job for you
}
```
{% endtab %}

{% tab title="@GameEntityDestroy" %}
```typescript
@GameEntityDestroy('Player')
public doSomething(entity: Player): void {
    // You don't need to check the instance of the entity to fit your needs
    // the decorator does this job for you
}
```
{% endtab %}
{% endtabs %}

## MetaChange Decorators

Working with MetaChange \(**StreamSyncedMetaChange** and **SyncedMetaChange**\) is one of the most annoying part on development. This decorators helps you a lot. No headache, no brainfuck, it only works as you aspected.

{% hint style="warning" %}
First param is an the string version for [BaseObjectType](https://docs.altv.mp/js/api/alt-client.BaseObjectType.html#fields).
{% endhint %}

{% tabs %}
{% tab title="@SyncedMetaChange" %}
```typescript
@SyncedMetaChange('Player')
public doSomethingSpecial(
    entity: Player, 
    key: string, 
    newValue: any, 
    oldValue: any
): void {
    // Working with any meta change for a player entity
    // Check for key you want
}

@SyncedMetaChange('Player', 'yourKey')
public doSomethingSpecial(entity: Player, newValue: any, oldValue: any): void {
    // Working with any meta change for a player entity
    // Only called if the yourKey is triggered.
    // you can do directly working with the value and create clean code
}
```
{% endtab %}

{% tab title="@StreamSyncedMetaChange" %}
```typescript
@StreamSyncedMetaChange('Player')
public doSomethingSpecial(
    entity: Player, 
    key: string, 
    newValue: any, 
    oldValue: any
): void {
    // Working with any meta change for a player entity
    // Check for key you want
}

@StreamSyncedMetaChange('Player', 'yourKey')
public doSomethingSpecial(entity: Player, newValue: any, oldValue: any): void {
    // Working with any meta change for a player entity
    // Only called if the yourKey is triggered.
    // you can do directly working with the value and create clean code
}
```
{% endtab %}
{% endtabs %}

{% hint style="success" %}
If you use the second parameter for your key, please notice that this key is not present anymore inside the method parameter map.
{% endhint %}

