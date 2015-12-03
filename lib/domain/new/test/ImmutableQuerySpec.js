var _this = this;
var ImmutableQuery_ts_1 = require("../ImmutableQuery.ts");
var Builders_ts_1 = require("../Builders.ts");
var update = require("react-addons-update");
fdescribe("ImmutableQuery Test", function () {
    beforeEach(function () {
        _this.immutableQuery = new ImmutableQuery_ts_1.ImmutableQuery();
        _this.printJSON = function (ob) {
            console.log(JSON.stringify(ob, null, 2));
        };
    });
    it("update lib check", function () {
        console.log(update);
    });
    it("size", function () {
        var newQuery = _this.immutableQuery.setSize(10);
        expect(newQuery == _this.immutableQuery).toEqual(false);
        expect(newQuery.query.size).toEqual(10);
    });
    it("addFilter", function () {
        var filter = { term: { genre: "action" } };
        var newQuery = _this.immutableQuery.addFilter("genre", filter);
        _this.printJSON(newQuery.query);
        expect(newQuery.query).toEqual({
            "filter": Builders_ts_1.BoolMust([filter]),
            "query": Builders_ts_1.BoolMust()
        });
        expect(newQuery.index).toEqual({
            filters: {
                genre: filter
            }
        });
        expect(newQuery.getFilters()).toEqual({
            bool: { must: [filter] }
        });
        expect(newQuery.getFilters("genre"))
            .toEqual(Builders_ts_1.BoolMust());
        expect(newQuery.getFilters("author"))
            .toEqual(Builders_ts_1.BoolMust([filter]));
    });
    it("addQuery", function () {
        var query = Builders_ts_1.SimpleQueryString("hi", {
            default_operator: "and"
        });
        console.log(query);
        var newQuery = _this.immutableQuery.addQuery(query);
        expect(newQuery.query.query).toEqual(Builders_ts_1.BoolMust([query]));
        expect(newQuery.query.query.bool.must[0]).toEqual({
            simple_query_string: {
                default_operator: 'and',
                query: 'hi'
            }
        });
    });
    it("setAggs", function () {
        var newAggs = {
            genres: {
                terms: {
                    field: "genre"
                }
            }
        };
        var newQuery = _this.immutableQuery.setAggs(newAggs);
        expect(newQuery.query.aggs).toEqual(newAggs);
    });
    it("areQueriesDifferent", function () {
        var a = new ImmutableQuery_ts_1.ImmutableQuery();
        var b = new ImmutableQuery_ts_1.ImmutableQuery();
        expect(ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
        a = a.setSize(10);
        expect(ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(true);
        b = b.setSize(10);
        expect(ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
        a = a.addFilter("genre", { term: { genre: "action" } });
        expect(ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(true);
        b = b.addFilter("genre", { term: { genre: "action" } });
        expect(ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
    });
});
//# sourceMappingURL=ImmutableQuerySpec.js.map