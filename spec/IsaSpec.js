describe("Isa", function () {
	var isa,
		obj1,
		obj2,
		result,
		expected;

	beforeEach(function () {
		isa = new Isa();
	});

	describe("incise()", function () {
		it("should return object specified by the guide functions", function () {
			var obj = {
				p1: {
					p11: 123,
					p12: {
						p121: "foo",
						p122: "baz",
						p123: "test"
					},
					p13: {
						p131: "quxx"
					}
				},
				p2: {
					p21: "bar",
					p22: "nonsense"
				}
			},
			fnGuide1,
			fnGuide2,
			fnGuides = [],
			result,
			expected = {
				p1: {
					p11: 123,
					p12: {
						p122: "baz",
						p123: "test"
					}
				},
				p2: {
					p22: "nonsense"
				}
			}

			fnGuide1 = function (obj) {
				return {
					p1: {
						p11: obj.p1.p11,
						p12: {
							p122: obj.p1.p12.p122
						}
					}
				};
			};

			fnGuide2 = function (obj) {
				return {
					p1: {
						p12: {
							p123: obj.p1.p12.p123
						}
					},
					p2: {
						p22: obj.p2.p22
					}
				};
			};

			fnGuides.push(fnGuide1);
			fnGuides.push(fnGuide2);

			result = isa.incise(obj, fnGuides);

			expect(result).toEqual(expected);
		});
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

		describe("when subtracting with object with property of array of primitives", function () {
			it("should remove values in the array", function () {
				obj1 = {
					p1: [
						123,
						456,
						123,
						789
					]
				};
				obj2 = {
					p1: [
						123,
						789
					]
				};
				expected = {
					p1: [
						456
					]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when subtracting with object with property of array of objects with ids", function () {
			it("should remove objects with matching ids from array", function () {
				obj1 = {
					p1: [
						{ id: 123 },
						{ id: 456 },
						{ id: 123 },
						{ id: 789 }
					]
				};
				obj2 = {
					p1: [
						{ id: 123 },
						{ id: 789 }
					]
				};
				expected = {
					p1: [
						{ id: 456 }
					]
				};

				result = isa.subtract(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});
	});

	describe("add()", function () {
		describe("when adding empty object", function () {
			it("should return the original object", function () {
				obj1 = { p1: 123 };
				obj2 = {};
				expected = obj1;

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with one layer of depth", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc"
				};
				obj2 = {
					p3: "foo"
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: "foo"
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with multiple layers of depth", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123,
						p32: {
							p321: "foo"
						}
					}
				};
				obj2 = {
					p3: {
						p33: 456,
						p34: {
							p341: 123
						}
					},
					p4: "foo",
					p5: {
						p51: 123
					}
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123,
						p32: {
							p321: "foo"
						},
						p33: 456,
						p34: {
							p341: 123
						}
					},
					p4: "foo",
					p5: {
						p51: 123
					}
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});

		describe("when adding with object with property of array type", function () {
			it("should combine values in the array", function () {
				obj1 = {
					p1: [
						123,
						456
					]
				};
				obj2 = {
					p1: [
						123,
						789
					]
				};
				expected = {
					p1: [
						123,
						456,
						123,
						789
					]
				};

				result = isa.add(obj1, obj2);

				expect(result).toEqual(expected);
			});
		});

		describe("when adding non-empty object with multiple layers of depth, two objects have same properties", function () {
			it("should return an object adding properties from obj2", function () {
				obj1 = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 123
					},
					p4: "foo"
				};
				obj2 = {
					p3: {
						p31: 456
					},
					p4: "bar"
				};
				expected = {
					p1: 123,
					p2: "abc",
					p3: {
						p31: 456
					},
					p4: "bar"
				};

				result = isa.add(obj1, obj2);
				expect(result).toEqual(expected);
			});
		});
	});
});
