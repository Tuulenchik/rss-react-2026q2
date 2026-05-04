import { Component } from "react";
import type { Item } from "../../types/item";
import ResultCard from "../ResultCard/ResultCard";
import './ResultsList.css'

type ResultsListProps = {
    items: Item[]
}

class ResultsList extends Component<ResultsListProps>{
    render() {
        if(this.props.items.length === 0){
            return <p className="results-empty">No results yet</p>
        }

        return(
            <div className="results-list">
                {this.props.items.map((item)=>(
                    <ResultCard key={item.id} item={item} />
                ))}
            </div>
        )
    }
}

export default ResultsList