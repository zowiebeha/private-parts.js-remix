import createAssociativeFactoryFrom from "./private_parts.js";

const privateMethods = {
  privateMethodOne() { this.fruit = 'apple'; },
  privateMethodTwo() { console.log('hi from within some hidden state!') },
}

const getOrCreatePrivateStateFor = createAssociativeFactoryFrom(privateMethods);

function SomeConstructor() { }

// Example of private static state:
// (not protected, unless you do Object.create(SomeConstructor), but then it's not a function instance.)
SomeConstructor.doWorkWithoutConstructedInstances = function() {
    const staticPrivateStore = getOrCreatePrivateStateFor(this);
    staticPrivateStore.privateMethodOne();
    console.log("private static prop:", staticPrivateStore.fruit);
}
SomeConstructor.doWorkWithoutConstructedInstances();

// Example of inheritable, instance-unique private state:
SomeConstructor.prototype.publicMethod = function() {
  const instancePrivateStore = getOrCreatePrivateStateFor(this);
  instancePrivateStore.privateMethodOne();
  instancePrivateStore.privateMethodTwo();
}

const instance = new SomeConstructor();
instance.publicMethod();