import { Component } from 'react';
import type { Item } from '../../types/item';
import './ResultCard.css';

type ResultCardProps = {
  item: Item;
};

class ResultCard extends Component<ResultCardProps> {
  render() {
    return (
      <article className="result-card">
        <h3 className="result-card-title">{this.props.item.name}</h3>
        <p className="result-card-description">{this.props.item.description}</p>
      </article>
    );
  }
}

export default ResultCard;
