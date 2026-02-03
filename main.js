import createAssociativeFactoryFrom from "./private_parts.js";

const privateMethods = {
  privateMethodOne() { this.fruit = 'apple'; },
  privateMethodTwo() { console.log('hi from within some hidden state!') },
}

const getOrCreatePrivateStateFor = createAssociativeFactoryFrom(privateMethods);

function SomeConstructor() { }

// Example of constructor-unique (static) private state (not inherited D:):
SomeConstructor.workWithoutConstructedInstances = function() {
    const staticPrivateStore = getOrCreatePrivateStateFor(SomeConstructor);
    staticPrivateStore.privateMethodOne();
    console.log("'protected' static prop:", staticPrivateStore.fruit);
}
SomeConstructor.workWithoutConstructedInstances();

// Example of inheritable, instance-unique private state:
SomeConstructor.prototype.publicMethod = function() {
  const instancePrivateStore = getOrCreatePrivateStateFor(this);
  instancePrivateStore.privateMethodOne();
  instancePrivateStore.privateMethodTwo();
}

const instance = new SomeConstructor();
instance.publicMethod();