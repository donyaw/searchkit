import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import ElasticAccessors from "../../../../../domain/accessors/ElasticAccessors.ts"
import * as _ from "lodash";
import * as classNames from 'classnames';
import {StateAccessorRef} from "../../../../../domain/StateAccessors.ts"

require("./../styles/index.scss");

interface IRefinementListFilter {
	searcher:ESClient;
	field:string
	operator?:string
	size?:string
	title:string
}

export default class RefinementListFilter extends React.Component<IRefinementListFilter, any> {
	accessor:StateAccessorRef

	constructor(props:IRefinementListFilter) {
		super(props)
		this.setAggs();
		let accessorMethod = props.operator == "OR" ? ElasticAccessors.facetOrFilter : ElasticAccessors.facetFilter;
		this.accessor = this.props.searcher.accessors.registerAccessor(
			this.props.field,
			accessorMethod
		)
	}

	setAggs() {
		this.props.searcher.setAggs(this.props.field, {
				"filter": this.props.searcher.getFilters(this.props.field),
				"aggs":{
					[this.props.field]:{
						"terms":{
							"field":this.props.field,
							size:this.props.size || 50
						}
					}
				}
			})
	}

	addFilter(option) {
		this.accessor.toggle(option.key)
	}

	renderOption(option) {
		let checkedClassName = classNames({
			"option__checkbox":true,
			"option__checkbox--checked":this.accessor.contains(option.key)
		})

		let optionClassName = classNames({
			"option":true,
			"option--checked":this.accessor.contains(option.key)
		})

		return (
			<div className={optionClassName} key={option.key} onClick={this.addFilter.bind(this, option)}>
				<div className={checkedClassName}></div>
				<div className="option__text">{option.key}</div>
				<div className="option__count">{option.doc_count}</div>
			</div>
		)
	}

	render() {
		return (
			<div className="refinement-list-filter">
				<div className="refinement-list-filter__header">{this.props.title}</div>
				<div className="refinement-list-filter__options">
			{(() => {
				if (_.has(this.props.searcher.results, ['aggregations',this.props.field,this.props.field,'buckets']) ) {
	        return _.map(this.props.searcher.results.aggregations[this.props.field][this.props.field].buckets, this.renderOption.bind(this))
				}
			})()}
				</div>
      </div>
		);
	}
}