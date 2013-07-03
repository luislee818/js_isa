var Isa;

// helper functions
function type(o){
	    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
}

// functions will not be cloned
function clone(o) {
	return JSON.parse(JSON.stringify(o));
}

// core functions
Isa = function () {};

/**
 * Get shared properties from two objects, "shared" means properties have the same name and hierarchy (property values are not checked)
 *
 * @memberOf Isa
 * @function
 * @param {} obj1 The first object
 * @param {} obj2 The second object
 * @return {} The object with shared properties
 */
Isa.prototype.intersect = function (obj1, obj2) {
	var result = {},
		property;

	if (obj1 === {} || obj2 === {}) {
		return {};
	}

	for (property in obj2) {
		if (obj1.hasOwnProperty(property))
		{
			if (type(obj1[property]) !== "Object") {
				result[property] = obj1[property];
			}
			else {
				result[property] = this.intersect(obj1[property], obj2[property]);
			}
		}
	}

	return result;
};

/**
 * Subtract properties with names in obj2 from obj1, only check property name, property values are not checked
 *
 * @memberOf Isa
 * @function
 * @param {} obj1 The first object, the object based on which to remove property from
 * @param {} obj2 The second object, the object based on which to look for properties to remove
 * @return {} The object with properties subtracted
 */
Isa.prototype.subtract = function (obj1, obj2) {
	var slate,
		property;

	if (obj2 === {}) {
		return obj1;
	}

	slate = clone(obj1);

	for (property in obj2) {
		if (slate.hasOwnProperty(property))
		{
			if (type(obj1[property]) !== "Object") {
				delete slate[property];
			}
			else {
				slate[property] = this.subtract(obj1[property], obj2[property]);
			}
		}
	}

	return slate;
};

/**
 * Add properties from two objects into one, when obj1 and obj2 have the same property, use value from obj2
 *
 * @memberOf Isa
 * @function
 * @param {} obj1 The first object
 * @param {} obj2 The second object
 * @return {} The object with properties added from both objects
 */
Isa.prototype.add = function (obj1, obj2) {
	var slate,
		property;

	if (obj2 === {}) {
		return obj1;
	}

	slate = clone(obj1);

	for (property in obj2) {
		if (slate.hasOwnProperty(property)) {
			if (type(slate[property]) !== "Object") {
				slate[property] = obj2[property];
			}
			else {
				slate[property] = this.add(slate[property], obj2[property]);
			}
		}
		else {
			slate[property] = obj2[property];
		}
	}

	return slate;
};
