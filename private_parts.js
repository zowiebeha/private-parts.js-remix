/*
    A remix of Phillip Walton's 2014 imitative protective encapsulation.
    Made in the pursuit of truth, explicitness, conciseness, concept, and improvements to logic.
    
    Note:
        Use ES6 classes in production if you're able to.
        If they aren't available, my opinion is that underscore-led property identifiers are the best choice
        .. (though many web service titans and esteemed engineers differ in opinion).
        The following API and its usage require additional public state, which marks it as an impure implementation.
    
    Terms:
        - Public state store:
            A constructor function or object literal that is publicly accessible, which may be used as a key to reference
            .. associated state from the private store.
    
        - Private state store:
            An object literal of state meant to be private, and to achieve this it is replicated, mapped
            .. to a public state store within our file here, and this replicated instance accessible only through key access.
            
            This restricts the new instance's access to only the function returned by the 
            .. `createAssociativeFactoryFrom` function.
            
            Any own changes performed by the private state store are localized to the private state store,
            .. since it's its own object literal.
*/

// A map of public state stores to their private state stores.
const publicPrivateStateStoreMap = new WeakMap();

// Track private objects that have been mapped to a public state store.
const associatedPrivateStateStores = new WeakSet();

/**
 * Returns a function that upon invocation, either associates an object literal or function instance 
 * .. with a new instance of the passed private state store,
 * .. or retrieves an already associated private state store.
 *
 * An attempt to mimic protected state in a maintainable way.
 * 
 * @param {object|undefined} initialPrivateState
 *     An optional argument that, if present, will be used as the prototype of the private state store.
 */
function createAssociativeFactoryFrom(initialPrivateState){
    if (typeof initialPrivateState == "null" || typeof initialPrivateState == "undefined")
        initialPrivateState = {};
    else if (typeof initialPrivateState != "object")
        throw new Error("initialPrivateState must be an 'object' instance.");

  /**
   * A function that returns the private state store associated
   * .. with the public state reference passed.
   * @param {object|function} publicState
   *    The public object that is associated with a private object in the store.
   */
  return function(publicState) {
    if (typeof publicState != 'object' && typeof publicState != 'function') {
        throw new Error("publicState must be an 'object' instance or 'function' instance.");
    }
    // We shouldn't allow the creation of private state for private state.
    if (associatedPrivateStateStores.has(publicState)) {
        throw new Error("Cannot create private state storage for existing private state storage.");
    }

    // Check if we have a private state store in the map
    let privateState = publicPrivateStateStoreMap.get(publicState);
    
    if (!privateState) {
        privateState = Object.create(initialPrivateState);
        publicPrivateStateStoreMap.set(publicState, privateState);
        associatedPrivateStateStores.add(privateState);
    }
    
    return privateState;
  };
}

export default createAssociativeFactoryFrom;