describe("Isa", function () {
	var isa,
		obj1,
		obj2,
		result,
		expected;

	beforeEach(function () {
		isa = new Isa();
	});

	describe("intersect()", function () {
		describe("when intersecting with empty object", function () {
			it("should return empty object when intersecting with empty object", function () {
				obj1 = {};
				obj2 = { p1: 123 };
				expected = {};

				result = isa.intersect(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when intersecting with object with single layer of depth", function () {
			it("should return object containing shared properties with values from obj1", function () {
				obj1 = {
					p1: 456,
					p2: "abc"
				};
				obj2 = {
					p1: 123,
					p3: []
				};
				expected = { p1: 456 };

				result = isa.intersect(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when intersecting with object with multiple layers of depth", function () {
			it("should return object containing shared properties with values from obj1", function () {
				obj1 = {
					p1: 456,
					p2: "abc",
					p3: {
						p31: "john",
						p32: {
							p321: "doe",
							p322: 123
						},
						p33: {}
					}
				};
				obj2 = {
					p1: 123,
					p3: {
						p31: "john",
						p32: {
							p322: "doedoedoe"
						},
						p33: {
							p331: 123
						}
					},
					p4: []
				};
				expected = {
					p1: 456,
					p3: {
						p31: "john",
						p32: {
							p322: 123
						},
						p33: {}
					}
				};

				result = isa.intersect(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});
	});

	describe("subtract()", function () {
		describe("when subtracting empty object", function () {
			it("should return original object", function () {
				obj1 = { p1: 123 };
				obj2 = {};
				expected = obj1;

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting non-empty object with one layer of depth", function () {
			it("should return an object subtracting properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc"
				};
				obj2 = {
					p1: "foo"
				};
				expected = {
					p2: "abc"
				};

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting non-empty object with multiple layers of depth", function () {
			it("should return an object subtracting properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123,
						p32: "foo",
						p33: "bar"
					}
				};
				obj2 = {
					p1: "foo",
					p3: {
						p31: 123,
						p34: "foo"
					}
				};
				expected = {
					p2: "abc",
					p3: {
						p32: "foo",
						p33: "bar"
					}
				};

				result = isa.subtract(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});
	});
});
