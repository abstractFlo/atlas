---
description: Learn more about the di-container decorators
---

# Decorator

## tsyringe Decorators

### @singleton

If you want to get every time the same instance from your class, use the **@singleton** decorator

```typescript
@singleton()
export class MyClass {}

// resolve class from container
const resolve1 = container.resolve(MyClass);
const resolve2 = container.resolve(MyClass);

resolve1 === resolve2;
```

### @injectable

If you want to get every time a new instance from your class, use the **@injectable** decorator.

```typescript
@injectable()
export class MyClass {}

// resolve class from container
const resolve1 = container.resolve(MyClass);
const resolve2 = container.resolve(MyClass);

resolve1 !== resolve2;
```

## Custom DI Decorators

We created some custom decorators to interact with the di-container. This decorators are needed for internal work. The complete framework use many shared classes and helpers on both sides. This decorators helps us to connected the server and client with the shared classes.

{% hint style="danger" %}
Every custom decorator must be declared after the tsyringe decorator
{% endhint %}

### @Module

The **@Module** decorator is the most used custom decorator. This decorator handle all your other module imports and components. It combines the autoloading feature and **@StringResolver**

{% tabs %}
{% tab title="index.ts" %}
```typescript
container.resolve(FirstModule)
```
{% endtab %}

{% tab title="first.module.ts" %}
```typescript
@Module({
    imports: [SecondModule],
    components: [FirstComponent]
})
@singleton()
export class FirstModule {}
```
{% endtab %}

{% tab title="second.module.ts" %}
```typescript
@Module({
    components: [SecondComponent]
})
@singleton()
export class SecondModule{}
```
{% endtab %}

{% tab title="first.component.ts" %}
```typescript
@singleton()
export class FirstComponent{}
```
{% endtab %}

{% tab title="second.component.ts" %}
```typescript
@singleton()
export class SecondComponent{}
```
{% endtab %}
{% endtabs %}

{% hint style="success" %}
The example above shows your the magic. Only one line of code for import. Resolve the module from container, autoload all other declared modules and components. This keep your code clean and nice.
{% endhint %}

### @StringResolver

The **@StringResolver** register the decorated class as an String InjectionToken inside the decorator.  
This is needed if you want to resolve a class based on string constructor name

{% hint style="info" %}
This decorator is only needed, if you get errors on resolving your class. There are not many usecases.
{% endhint %}

```typescript
@StringResolver
export class MyClass {}

// resolve class from container
const resolve1 = container.resolve('MyClass');

resolve1 instanceof MyClass === true
```



