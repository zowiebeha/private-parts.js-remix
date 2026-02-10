import createAssociativeFactoryFrom from "./private_parts.js";

const privateMethods = {
  privateMethodOne() { this.fruit = 'apple'; },
  privateMethodTwo() { console.log('hi from within some hidden state!') },
}

/*
    Prevent modification.

    See inside createAssociativeFactoryFrom for the use of
    privateMethods as the [[Prototype]] of an empty private state store object.
*/
Object.freeze(privateMethods);

const getOrCreatePrivateStateFor = createAssociativeFactoryFrom(privateMethods);

function SomeConstructor() { }

/*
    Example of private static state access:
    
    Not inherited by derivative constructors, unless you use Object.create(SomeConstructor),
    .. but then the result would not be a Function instance.
*/
SomeConstructor.doWorkUntiedToConstructedInstances = function() {
    const staticPrivateStore = getOrCreatePrivateStateFor(this);
    staticPrivateStore.privateMethodOne();
    
    // `fruit` is stored on SomeConstructor itself:
    console.log("private static prop:", staticPrivateStore.fruit);
}
SomeConstructor.doWorkUntiedToConstructedInstances();

/*
    Example of inheritable, instance-unique private state access:
    
    Any derivative constructor Function instance with a `prototype` property
    .. of SomeConstructor will inherit this functionality.
    
    The private state will be unique to, and accessed by constructed instances which
    .. invoke their inherited `publicMethod`.
*/
SomeConstructor.prototype.publicMethod = function() {
  const instancePrivateStore = getOrCreatePrivateStateFor(this);
  instancePrivateStore.privateMethodOne();
  instancePrivateStore.privateMethodTwo();
}

const instance = new SomeConstructor();
instance.publicMethod();