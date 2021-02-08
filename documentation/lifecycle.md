---
description: Learn more about the Lifecycle
---

# Lifecycle

## Introduction

There a many scenarios, where you want to wait for a method to be completed before starting another. That's why we create a custom lifecycle system for booting up the framework. In simple words, the lifecycle is a kind of a queue, where each decorator run after each other in a particular order.

{% hint style="warning" %}
This lifecycle does not affected the alt:V lifecycle. They only help you perform different task on different steps.
{% endhint %}

## Loader

We have create a Loaderservice to fit our needs for the lifecycle we want. Using the loader is recommended and the setup is fairly easy. The only thing to do is, bootstrap your entry module and the loader starts the magic.

{% hint style="info" %}
This is available on server and client side
{% endhint %}

{% tabs %}
{% tab title="Server" %}
```typescript
const loader = container.resolve(LoaderService);

loader
    .bootstrap(ServerModule)
    .afterComplete(() => {
        // This method is called, if the lifecycle finished
    });
```
{% endtab %}

{% tab title="Client" %}
```typescript
const loader = container.resolve(LoaderService);

loader
    .bootstrap(ClientModule)
    .afterComplete(() => {
        // This method is called, if the lifecycle finished
        // You can send event to server to inform the player is ready
        // Example:
        UtilsService.log('~lg~Booting complete => ~w~Happy Playing');
        const eventService = container.resolve(EventService);
        eventService.emitServer('playerBootComplete');
    });
```
{% endtab %}
{% endtabs %}

{% hint style="success" %}
You don't need to load up other modules as well. Keep in mind, the available decorators do this for you.
{% endhint %}

## Available Decorators

{% tabs %}
{% tab title="@Before" %}
```typescript
@Before
public heavyTask(done: CallableFunction): void {
    setTimeout(() => {
        done();
    }, 10000)
}
```
{% endtab %}

{% tab title="@After" %}
```typescript
@After
public heavyTask(done: CallableFunction): void {
    setTimeout(() => {
        done();
    }, 10000)
}
```
{% endtab %}

{% tab title="@AfterBootstrap" %}
```typescript
@AfterBootstrap
public heavyTask(done: CallableFunction): void {
    setTimeout(() => {
        done();
    }, 10000)
}
```
{% endtab %}
{% endtabs %}

## Example

This is not the best 

```typescript
class YourModule {
    
    private loadedVehicles: number = 0;
    private loadedPedPositions: number = 0;
    
    // Push init the database as first step to queue
    @Before
    public initDatabase(done: CallableFunction): void {
        this.initYourDatabase().then(() => done());
    }
    
    // push load all server vehicles to queue after database is initialized
    @After
    public loadServerVehicles(done: CallableFunction): void {
        this.loadAllServerVehicles().then((loadedVehicles: number) => {
            this.loadedVehicles = loadedVehicles;
            done();
        });
    }
    
    // Push load all ped positions to queue after the vehicles loaded
    @After
    public loadPedPositions(done: CallableFunction): void {
        this.loadAllPedPositions().then((pedPositions: number) => {
            this.loadedPedPositions = pedPositions;
            done();
        });
    }
    
    // Last step, print out the loaded vehiles and ped positions
    @AfterBootstrap
    public printLoadedVehicles(done: CallableFunction): void {
        alt.log(`Successfully loaded ${this.loadedVehicles}`);
        alt.log(`Successfully loaded ${this.loadedPedPositions}`);
        done();
    }
    
}
```

{% hint style="info" %}
You can push as many as you want on each queue step. You only keep in mind, that any step would be call if the before step is finished and in this order:   
**@Before** -&gt; **@After** -&gt; **@AfterBootstrap**
{% endhint %}
