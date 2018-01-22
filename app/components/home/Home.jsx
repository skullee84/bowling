import React from 'react';
import update from 'react-addons-update';
import {TweenMax, Elastic} from 'gsap';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      move: 450,
      animations: [],
      scores: []
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.setState({
      move: this.refs.line.clientHeight - 40
    });
  }

  getRandomNumber(max, min) {
    return Math.random() * (max - min) + min;
  }

  handleKeyPress = (e) => {
    e.preventDefault();
    this.handleReset();
    if(e.keyCode === 13) {
      this.saveAnimation(TweenMax.to('.ball', this.getRandomNumber(0, 2), {y: -this.state.move, onComplete: this.moveComplete}));
    }
  }

  saveAnimation = (animation) => {
    let {animations} = this.state;
    animations.push(animation);
    this.setState({animations});
  }

  moveComplete = () => {
    const config = { ease: Elastic.easeOut.config(0.2, 5), y: this.getRandomNumber(-10, -100) };

    this.saveAnimation(TweenMax.to('.centerB', this.getRandomNumber(2, 5), config));
    this.saveAnimation(TweenMax.to('.leftB', this.getRandomNumber(1, 5), update(config, {$merge: {x: this.getRandomNumber(-10, -100)}})));
    this.saveAnimation(TweenMax.to('.rightB', this.getRandomNumber(1, 5), update(config, {$merge: {x: this.getRandomNumber(10, 100)}})));
    this.saveAnimation(TweenMax.to('.leftB-l', this.getRandomNumber(1, 5), update(config, {$merge: {x: this.getRandomNumber(-10, -100)}})));
    this.saveAnimation(TweenMax.to('.rightB-l', this.getRandomNumber(1, 5), update(config, {$merge: {x: this.getRandomNumber(10, 100)}})));

    this.renderScore();
  }

  renderScore = () => {
    let {scores} = this.state;
    let score = Math.floor(this.getRandomNumber(0, 11));
    const scoreLength = scores.length;

    if(scores.length > 19) scores = [];

    if(scores.length % 2 == 1) {
      if(score == 10 || (scores[scoreLength - 1] + score) >= 10) {
        scores.push('/');
      }else {
        scores.push(score);
      }
    }else {
      if(score == 10) {
        scores.push('X');
        scores.push('-');
      }else {
        scores.push(score);
      }
    }

    this.setState({scores});
  }

  handleReset = () => {
    const {animations} = this.state;
    animations.map((item, idx) => {
      if(item.isActive()) {
        item.kill();
      }
      item.pause(0);
    });
    this.setState({animations: []});
  }

  renderRows = () => {
    let {scores} = this.state;
    return (
      <tr className="text-center">
        {[...Array(20).keys()].map((item, idx) => {
          return <td key={idx}>{scores.length > idx ? scores[idx] : ''}</td>;
        })}
      </tr>
    )
  }

  renderScores = () => {
    let {scores} = this.state;
    return (
      <tr className="text-center">
        {[...Array(20).keys()].map((item, idx) => {
          return idx % 2 == 1 && (
            <td colSpan="2" key={idx}>{this.renderSum(idx)}</td>
          );
        })}
      </tr>
    )
  }

  renderSum = (idx) => {
    const {scores, sum} = this.state;
    let prevValue = scores[idx - 1];
    let currentValue = scores[idx];

    if(prevValue && currentValue) {
      console.log(prevValue, currentValue);
    }

    return 0;
  }

  render() {
    return (
      <div>
        <table className="table table-sm table-bordered">
          <thead>
            <tr className="text-center">
              <th colSpan="2" scope="col">1</th>
              <th colSpan="2" scope="col">2</th>
              <th colSpan="2" scope="col">3</th>
              <th colSpan="2" scope="col">4</th>
              <th colSpan="2" scope="col">5</th>
              <th colSpan="2" scope="col">6</th>
              <th colSpan="2" scope="col">7</th>
              <th colSpan="2" scope="col">8</th>
              <th colSpan="2" scope="col">9</th>
              <th colSpan="2" scope="col">10</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
            {this.renderScores()}
          </tbody>
        </table>

        <div className="border border-secondary">
          <div className="row">
            <div className="col text-center" ref="myDiv">
              <i className="fa fa-circle-thin fa-2x mx-1 leftB-l" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 leftB" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 rightB" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 rightB-l" aria-hidden="true"></i>
            </div>
            <div className="col text-center">
              <button onClick={this.handleReset}>reset</button>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <i className="fa fa-circle-thin fa-2x mx-1 leftB" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 centerB" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 rightB" aria-hidden="true"></i>
            </div>
            <div className="col text-center"></div>
          </div>
          <div className="row">
            <div className="col text-center">
              <i className="fa fa-circle-thin fa-2x mx-1 leftB" aria-hidden="true"></i>
              <i className="fa fa-circle-thin fa-2x mx-1 rightB" aria-hidden="true"></i>
            </div>
            <div className="col text-center"></div>
          </div>
          <div className="row">
            <div className="col text-center">
              <i className="fa fa-circle-thin fa-2x mx-1 centerB" aria-hidden="true"></i>
            </div>
            <div className="col text-center"></div>
          </div>
          <div className="row align-items-end" style={{height: 450}} ref="line">
            <div className="col text-center" ref="ballArea">
              <i className="fa fa-bullseye fa-3x ball" aria-hidden="true"></i>
            </div>
            <div className="col text-center"></div>
          </div>
        </div>
      </div>
    );
  }
}
